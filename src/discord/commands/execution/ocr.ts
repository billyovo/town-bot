import { ChatInputCommandInteraction } from "discord.js";
import { createWorker } from "tesseract.js";
import { log } from "~/src/lib/logger/logger";
import { splitMessage } from "~/src/lib/utils/discord/splitMessage";

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


	await using OCRworker = await createOCRWorker();

	try {
		const ret = await OCRworker.worker.recognize(url);
		const recognizedText = ret ? ret.data.text : "Nothing is recognized!";
		const splitText = splitMessage(recognizedText.split("\n"), true);
		await interaction.editReply({
			content: splitText[0],
		});
		for (let i = 1; i < splitText.length; i++) {
			await interaction.followUp({
				content: splitText[i] + "\r\n",
			});
		}
	}
	catch (error) {
		if (error instanceof Error) {
			log(error.message);
		}
		await interaction.editReply({
			content: "An error occurred while processing the image!",
		});
	}

}

async function createOCRWorker() {
	const worker = await createWorker("eng+chi_tra+jpn", 1, {
		cachePath: "../assets/tesseract",
	});

	return {
		worker: worker,
		[Symbol.asyncDispose]: async () => {
			await worker.terminate();
		},
	};

}
