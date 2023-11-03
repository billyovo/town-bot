import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("event-info")
	.setNameLocalizations({ "zh-TW": "活動資訊" })
	.setDescription("Get Information about all events")
	.setDescriptionLocalizations({ "zh-TW": "取得活動資訊" });

