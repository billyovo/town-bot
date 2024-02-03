import { ChatInputCommandInteraction } from "discord.js";
import { createWorker } from "tesseract.js";

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

	const fromText : string = (interaction.options.get("lang")?.value ?? "eng") as string;

	try {
		// const text = await tesseract.recognize(url, { lang: fromText, oem:1, psm: 3 });
		const worker = await createWorker(fromText);
		const { data : { text } } = await worker.recognize(url);
		interaction.editReply({ content: text || "I don't see anything!" });
	}
	catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
			interaction.editReply({ content: error.message });
		}
	}

}
