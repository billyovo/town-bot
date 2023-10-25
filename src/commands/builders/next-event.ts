import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("next-event")
	.setNameLocalizations({ "zh-TW": "下一次活動時間" })
	.setDescription("Get time of the next event")
	.setDescriptionLocalizations({ "zh-TW": "顯示下一次活動時間" });

