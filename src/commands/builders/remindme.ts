import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("remindme")
	.setDescription("remind me")
	.addStringOption(option => option.setName("time").setDescription("time").setRequired(true))
	.addStringOption(option => option.setName("message").setDescription("message").setRequired(true))
	.addBooleanOption(option => option.setName("dm").setDescription("should this reminder be a DM?").setRequired(false));