import { ChatInputCommandInteraction } from "discord.js";
import axios from "axios";
import { OpenAI, toFile } from "openai";
import { logger } from "~/src/lib/logger/logger";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	baseURL: process.env.OPENAI_DRAW_LINK || undefined,
});

function createPromptArray(prompt: string, imageBase64: string | null) {
	const builtPrompt = [];
	if (imageBase64) {
		builtPrompt.push({
			role: "user",
			parts: [
				{
					inline_data: {
						mime_type: "image/png",
						data: imageBase64,
					},
				},
			],
		});
	}
	builtPrompt.push({
		role: "user",
		parts: [
			{
				text: prompt,
			},
		],
	});
	return builtPrompt;
}

export async function execute(interaction: ChatInputCommandInteraction) {
	const model = interaction.options.getString("model") || "gemini";
	if (model === "gemini" && (!process.env.DRAW_LINK || !process.env.DRAW_KEY)) {
		await interaction.reply("The draw API token is not provided.");
		return;
	}
	if (model === "chatgpt" && !process.env.OPENAI_API_KEY) {
		await interaction.reply("The OpenAI API key is not provided.");
		return;
	}
	const prompt = interaction.options.getString("prompt");
	if (!prompt) {
		await interaction.reply({ content: "Prompt is required.", ephemeral: true });
		return;
	}
	const aspectRatio = interaction.options.getString("size") || "1:1";

	const imageURL = interaction.options.getString("image_url");
	const image = interaction.options.getAttachment("image")?.url;

	const finalImageURL: string | undefined = imageURL || image;
	const imageBase64: string | null = finalImageURL
		? await axios
				.get(finalImageURL, { responseType: "arraybuffer" })
				.then((response) => Buffer.from(response.data, "binary").toString("base64"))
		: null;

	if (finalImageURL && !imageBase64) {
		logger.error(`Failed to fetch image from URL: ${finalImageURL}`);
		await interaction.reply({ content: "Failed to fetch the provided image", ephemeral: true });
		return;
	}

	await interaction.deferReply();

	try {
		if (model === "chatgpt") {
			await chatgpt(prompt, imageBase64, interaction);
		} else {
			await gemini(prompt, aspectRatio, imageBase64, interaction);
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		logger.error(`Error while calling image generation ${message}`);
		await interaction.editReply({ content: `Error occured: ${message}` });
	}
}

async function gemini(
	prompt: string,
	aspectRatio: string,
	imageBase64: string | null,
	interaction: ChatInputCommandInteraction,
) {
	const res = await axios
		.post(
			process.env.DRAW_LINK as string,
			{
				contents: createPromptArray(prompt, imageBase64),
				generationConfig: {
					responseModalities: ["Image"],
					imageConfig: {
						aspectRatio: aspectRatio,
					},
				},
			},
			{
				headers: {
					"api-key": process.env.DRAW_KEY,
				},
			},
		)
		.catch(async (err) => {
			logger.error(`Error while calling image generation ${JSON.stringify(err?.response?.data) || err.message}`);
			await interaction.editReply({ content: `Error occured: ${err?.response?.data?.message || err.message}` });
			return null;
		});

	if (!res) return;

	const responsedImageBase64 = res?.data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
	if (!responsedImageBase64) {
		logger.error("No image data received from the API");
		await interaction.editReply({ content: "No image data received from the API" });
		return;
	}
	const imageBuffer: Buffer = Buffer.from(responsedImageBase64, "base64");
	await interaction.editReply({ files: [imageBuffer], content: prompt });
}

async function chatgpt(prompt: string, imageBase64: string | null, interaction: ChatInputCommandInteraction) {
	const res = imageBase64
		? await openai.images.edit({
				model: "gpt-image-2",
				prompt,
				size: "auto",
				image: await toFile(Buffer.from(imageBase64, "base64"), "image.png", { type: "image/png" }),
			})
		: await openai.images.generate({
				model: "gpt-image-2",
				prompt,
				size: "auto",
			});

	const responsedImageBase64 = res.data?.[0]?.b64_json;
	if (!responsedImageBase64) {
		logger.error("No image data received from the API");
		await interaction.editReply({ content: "No image data received from the API" });
		return;
	}
	const imageBuffer: Buffer = Buffer.from(responsedImageBase64, "base64");
	await interaction.editReply({ files: [imageBuffer], content: prompt });
}
