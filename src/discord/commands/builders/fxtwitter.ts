import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("fxtwitter")
	.setDescription("fix twitter")
	.addStringOption(option => option.setName("link").setDescription("link").setRequired(true));