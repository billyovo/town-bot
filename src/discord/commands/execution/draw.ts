import { ChatInputCommandInteraction } from "discord.js";
import axios from "axios";
import { logger } from "~/src/lib/logger/logger";
import { generateGeminiImage } from "~/src/lib/imageGeneration/gemini";
import { drawWithChat } from "~/src/lib/imageGeneration/openai";

export async function execute(interaction: ChatInputCommandInteraction) {
	const model = interaction.options.getString("model") || "openai";

	if (model === "gemini" && (!process.env.DRAW_LINK || !process.env.DRAW_KEY)) {
		await interaction.reply("The draw API token is not provided.");
		return;
	}
	if (model === "openai" && !process.env.OPENAI_API_KEY) {
		await interaction.reply("The OpenAI API key is not provided.");
		return;
	}

	const prompt = interaction.options.getString("prompt");
	if (!prompt) {
		await interaction.reply({ content: "Prompt is required.", ephemeral: true });
		return;
	}

	const size = interaction.options.getString("size");

	const imageURL = interaction.options.getString("image_url");
	const attachmentURL = interaction.options.getAttachment("image")?.url;

	const finalImageURL: string | undefined = imageURL || attachmentURL;
	const image: Buffer | null = finalImageURL
		? await axios
				.get(finalImageURL, { responseType: "arraybuffer" })
				.then((response) => Buffer.from(response.data))
				.catch(() => null)
		: null;

	if (finalImageURL && !image) {
		logger.error(`Failed to fetch image from URL: ${finalImageURL}`);
		await interaction.reply({ content: "Failed to fetch the provided image", ephemeral: true });
		return;
	}

	await interaction.deferReply();

	try {
		switch (model) {
			case "openai": {
				const result = await drawWithChat(prompt, image ?? undefined, size ?? "auto");

				const files = [{ attachment: result.image, name: "image.png" }];

				const promptQuote = result.revisedPrompt && result.revisedPrompt.replace(/^/gm, "> ");
				let content = [result.text, promptQuote].filter(Boolean).join("\n\n");
				if (content.length > 2000) {
					files.push({ attachment: Buffer.from(result.revisedPrompt, "utf8"), name: "revised_prompt.txt" });
					content = [result.text.slice(0, 1800), "> Full prompt attached."].filter(Boolean).join("\n\n");
				}
				await interaction.editReply({ files, content, allowedMentions: { parse: [] } });

				break;
			}
			case "gemini": {
				const result = await generateGeminiImage(prompt, image ?? undefined, size ?? "1:1");
				await interaction.editReply({ files: [result], content: prompt });
				break;
			}
			default:
				break;
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		logger.error(`Error while calling image generation ${message}`);
		await interaction.editReply({ content: `Error occured: ${message}` });
	}
}
