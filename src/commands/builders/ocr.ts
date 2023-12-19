import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("ocr")
	.setDescription("ocr")
	.addStringOption(option => option.setName("url").setDescription("image link").setRequired(true))
	.addStringOption(option => option.setName("lang")
		.setDescription("language")
		.setRequired(false)
		.addChoices(
			{
				name: "Japanese",
				value: "jpn",
			},
			{
				name: "Traditional chinese",
				value: "chi_tra",
			},
			{
				name: "Simplified chinese",
				value: "chi_sim",
			},
		),
	);

