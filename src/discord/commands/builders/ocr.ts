import { ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("ocr")
	.setDescription("ocr")
	.setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
	.setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
	.addStringOption(option => option.setName("url").setDescription("image link").setRequired(true));