import { ApplicationIntegrationType, SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("remindme")
	.setDescription("remind me")
	.addStringOption(option => option.setName("time").setDescription("duration string like 6h30m, 1y3M, 5mins12s").setRequired(true))
	.addStringOption(option => option.setName("message").setDescription("message").setRequired(true))
	.addBooleanOption(option => option.setName("dm").setDescription("should this reminder be a DM?").setRequired(false))
	.setIntegrationTypes(ApplicationIntegrationType.UserInstall);