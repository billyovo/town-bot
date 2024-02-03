import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("ocr")
	.setDescription("ocr")
	.addStringOption(option => option.setName("url").setDescription("image link").setRequired(true));

