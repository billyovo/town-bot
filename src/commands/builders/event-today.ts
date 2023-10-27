import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("event-today")
	.setNameLocalizations({ "zh-TW": "今天的活動" })
	.setDescription("Get today's event")
	.setDescriptionLocalizations({ "zh-TW": "顯示今天的活動" });

