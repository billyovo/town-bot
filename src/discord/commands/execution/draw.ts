import { ChatInputCommandInteraction } from "discord.js";
import axios from "axios";
import { logger } from "~/src/lib/logger/logger";

export async function execute(interaction: ChatInputCommandInteraction) {
	if (!process.env.DRAW_LINK || !process.env.DRAW_KEY || !process.env.DRAW_API_VERSION) {
		await interaction.reply("The draw API token is not provided.");
		return;
	}

	const prompt : string = interaction.options!.getString("prompt")?.trim() ?? "";
	const size : string = interaction.options.getString("size") ?? "1024x1024";
	const quality : string = interaction.options.getString("quality") ?? "high";

	const headers = {
		"Cache-Control": "no-cache, must-revalidate",
		"Content-Type": "application/json",
		"api-key": process.env.DRAW_KEY,
	};
	const body = {
		prompt: prompt,
		size: size,
		n: 1,
		quality: quality,
		model: "gpt-image-1",
	};

	await interaction.deferReply();

	let imageRequest;
	try {
		imageRequest = await axios.post(process.env.DRAW_LINK, body, {
			headers,
			params: { "api-version": process.env.DRAW_API_VERSION },
			timeout: 120000,
		});
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	catch (error: any) {
		const msg =
			error?.response?.data?.error?.message ??
			error?.response?.data?.message ??
			error?.message ??
			"Failed to generate image";
		logger.error(msg);
		await interaction.editReply(msg);
		return;
	}

	if (!imageRequest) {
		await interaction.editReply("An error occurred when sending the request.");
		return;
	}

	const imageBase64 : string = imageRequest.data.data?.[0]?.b64_json;

	if (!imageBase64) {
		await interaction.editReply({ content: "Image not found in response." });
		return;
	}

	const imageBuffer : Buffer = Buffer.from(imageBase64, "base64");
	await interaction.editReply({ files: [imageBuffer], content: prompt });
}
