import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { createWorker } from "tesseract.js";
import { logger } from "~/src/lib/logger/logger";
import { sendSplitMessage, splitMessage } from "~/src/lib/utils/discord/splitMessage";

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply();
	const url : string = interaction.options.get("url")?.value as string;

	if (!url) {
		interaction.reply({
			content: "Nothing is received!",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}


	await using OCRworker = await createOCRWorker();

	try {
		const ret = await OCRworker.worker.recognize(url);
		const recognizedText = ret ? ret.data.text : "Nothing is recognized!";
		const splitText : string[] = splitMessage(recognizedText);
		await interaction.editReply({ content: splitText[0] });
		await sendSplitMessage(interaction, splitText);
	}
	catch (error) {
		if (error instanceof Error) {
			logger.error(error.message);
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
