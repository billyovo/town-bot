import axios from "axios";
import { AttachmentBuilder, Message, MessageContextMenuCommandInteraction, MessageFlags } from "discord.js";
import { logger } from "~/src/lib/logger/logger";

const API_URL = "https://api.voids.top/quote";
export async function execute(interaction: MessageContextMenuCommandInteraction) {
	const targetMessage: Message = interaction.targetMessage;

	try {
		const res = await axios.post(API_URL, {
			username: targetMessage.author.username,
			display_name: targetMessage.member?.displayName ?? targetMessage.author.globalName ?? targetMessage.author.username,
			text: targetMessage.cleanContent,
			avatar: targetMessage.author.displayAvatarURL(),
			color: false,
		});

		const attachment : AttachmentBuilder = new AttachmentBuilder(res.data.url, { name: "quote.png" });
		await interaction.reply({
			files: [attachment],
		});
	}
	catch (e) {
		if (axios.isAxiosError(e)) {
			logger.error(`${e.response?.status} ${JSON.stringify(e.response?.data) ?? e.message}`);
			await interaction.reply({
				content: "Failed to fetch quote",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if (e instanceof Error) {
			logger.error(e.message);
			await interaction.reply({
				content: "An Error Occurred",
				flags: MessageFlags.Ephemeral,
			});
		}
	}
}