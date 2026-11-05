import type OpenAI from "openai";
import { getOpenAIClient } from "../openai/client";
import sharp from "sharp";

export async function drawWithChat(prompt: string, image?: Buffer, size = "auto") {
	const openai = getOpenAIClient();
	const content: OpenAI.Responses.ResponseInputContent[] = [
		{ type: "input_text", text: `${image ? "Edit the image" : "Create an image of"}: ${prompt}` },
	];
	if (image) {
		const sourceImage = await sharp(image).rotate().png().toBuffer();
		content.push({
			type: "input_image",
			image_url: `data:image/png;base64,${sourceImage.toString("base64")}`,
			detail: "auto",
		});
	}
	const response = await openai.responses.create({
		model: "gpt-6-astra",
		input: [{ role: "user", content }],
		tools: [{ type: "image_generation", model: "gpt-image-2.6-sunburst", size, output_format: "png" }],
	});
	if (response.status !== "completed") throw new Error(`Draw response ${response.status}`);
	const generated = response.output.find((item) => item.type === "image_generation_call");
	if (!generated?.result) throw new Error(response.output_text || "No image data received from OpenAI");
	return {
		text: response.output_text,
		image: Buffer.from(generated.result, "base64"),
		revisedPrompt: generated.revised_prompt ?? "",
	};
}
