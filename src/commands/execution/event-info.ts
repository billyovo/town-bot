import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from "discord.js";
import config from "@configs/config.json";

export async function execute(interaction: ChatInputCommandInteraction) {
	const buttonToHomepage = new ButtonBuilder()
		.setLabel("點我查看活動資訊網站")
		.setURL(config.homePage)
		.setStyle(ButtonStyle.Link);

	const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(buttonToHomepage);

	await interaction.reply({
		content: "點擊下方按鈕前往活動資訊網站",
		components: [row],
	});
}