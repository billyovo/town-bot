import { ChatInputCommandInteraction } from "discord.js";
import { createWorker } from "tesseract.js";
import { splitMessage } from "~/utils/discord/splitMessage";

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply();
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
		const recognizedText = ret.data.text === "" ? ["Nothing is recognized!"] : splitMessage(ret.data.text.split("\n"));

		await interaction.editReply({
			content: ret.data.text[0],
		});
		for (let i = 1; i < recognizedText.length; i++) {
			await interaction.followUp({
				content: recognizedText[i],
			});
		}
	}
	catch (error) {
		await interaction.editReply({
			content: "An error occurred!",
		});
	}
	finally {
		await worker.terminate();
	}

}
