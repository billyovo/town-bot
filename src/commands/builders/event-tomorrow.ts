import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("event-tomorrow")
	.setNameLocalizations({ "zh-TW": "明天的活動" })
	.setDescription("Get tomorrow's event")
	.setDescriptionLocalizations({ "zh-TW": "顯示明天的活動" });

