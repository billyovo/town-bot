import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("event-record")
	.setNameLocalizations({ "zh-TW": "勝利紀錄" })
	.setDescription("Get win records of a player")
	.setDescriptionLocalizations({ "zh-TW": "取得玩家勝利紀錄" })
	.addStringOption((option) => option.setRequired(true).setName("name").setDescription("player name").setDescriptionLocalization("zh-TW", "玩家名稱"))
	.addStringOption((option) => option.setRequired(true).setName("server").setDescription("server").setDescriptionLocalization("zh-TW", "伺服器").addChoices(
		{
			name: "生存",
			value: "SURVIVAL",
		},
		{
			name: "空島",
			value: "SKYBLOCK",
		},
		{
			name: "全部",
			value: "ALL",
		},
	));

