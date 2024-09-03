import { ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("anya-lovethis")
	.setDescription("Show your love")
	.addStringOption(option => option.setName("link").setDescription("image link").setRequired(false))
	.addAttachmentOption(option => option.setName("image").setDescription("image file").setRequired(false))
	.setIntegrationTypes(ApplicationIntegrationType.UserInstall)
	.setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]);
