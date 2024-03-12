import { ChatInputCommandInteraction, AttachmentBuilder } from "discord.js";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "path";
import { logger } from "~/logger/logger";

export async function execute(interaction: ChatInputCommandInteraction) {
	const url : string = (interaction.options.get("image")?.attachment?.url || interaction.options.get("link")?.value) as string;
	if (!url) {
		interaction.reply({ content: "Nothing is received!", ephemeral: true });
		return;
	}
	await interaction.deferReply();
	const canvas = createCanvas(1000, 560);
	const ctx = canvas.getContext("2d");

	try {
		const base = await loadImage(path.resolve(__dirname, "../../assets/lovethis.png"));
		const image = await loadImage(url);
		ctx.drawImage(image, 0, 0, image.width, image.height, 313, 79, 339, 263);
		ctx.drawImage(base, 0, 0);
		const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "output.png" });
		interaction.editReply({ files: [attachment] });
	}
	catch (error) {
		interaction.editReply({ content: "an error occured!" });
		if (error instanceof Error) {
			logger(error.message);
		}
	}
}