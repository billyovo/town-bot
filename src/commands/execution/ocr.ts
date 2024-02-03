import { ChatInputCommandInteraction } from "discord.js";
import { createWorker } from "tesseract.js";

export async function execute(interaction: ChatInputCommandInteraction) {
	interaction.deferReply();
	const url : string = interaction.options.get("url")?.value as string;

	if (!url) {
		interaction.reply({
			content: "Nothing is received!",
			ephemeral: true,
		});
		return;
	}

	const worker = await createWorker("eng+chi_tra+jpn", 1, {
		cachePath: "../assets/tesseract",
	});

	try {
		const ret = await worker.recognize(url);
		interaction.editReply({
			content: ret.data.text,
		});
	}
	catch (error) {
		interaction.editReply({
			content: "An error occurred!",
		});
	}
	finally {
		await worker.terminate();
	}

}
