import axios from "axios";
import { logger } from "../logger/logger";

function createContents(prompt: string, image?: Buffer) {
	const contents = [];
	if (image) {
		contents.push({
			role: "user",
			parts: [{ inline_data: { mime_type: "image/png", data: image.toString("base64") } }],
		});
	}
	contents.push({ role: "user", parts: [{ text: prompt }] });
	return contents;
}

export async function generateGeminiImage(prompt: string, image?: Buffer, aspectRatio = "1:1") {
	const res = await axios
		.post(
			process.env.DRAW_LINK as string,
			{
				contents: createContents(prompt, image),
				generationConfig: { responseModalities: ["Image"], imageConfig: { aspectRatio } },
			},
			{ headers: { "api-key": process.env.DRAW_KEY } },
		)
		.catch((err) => {
			logger.error(`Gemini image API error ${JSON.stringify(err?.response?.data) || err.message}`);
			throw new Error(err?.response?.data?.message || err.message);
		});

	const data = res.data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
	if (!data) throw new Error("No image data received from the API");
	return Buffer.from(data, "base64");
}
