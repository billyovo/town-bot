import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("draw")
	.setDescription("draw something")
	.addStringOption(option => option.setName("prompt").setDescription("prompt").setRequired(true));