import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("event-banlist")
	.setNameLocalizations({ "zh-TW": "禁賽名單" })
	.setDescription("Get Event ban list")
	.setDescriptionLocalizations({ "zh-TW": "取得禁賽名單" })
	.addStringOption((option) => option.setRequired(true).setName("server").setDescription("server").setDescriptionLocalization("zh-TW", "伺服器").addChoices(
		{
			name: "生存",
			value: "SURVIVAL",
		},
		{
			name: "空島",
			value: "SKYBLOCK",
		},
	));

