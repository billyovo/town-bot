import { ApplicationCommandType, ApplicationIntegrationType, ContextMenuCommandBuilder, InteractionContextType } from "discord.js";

export const command = new ContextMenuCommandBuilder()
	.setName("make-quote")
	.setType(ApplicationCommandType.Message)
	.setIntegrationTypes([ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall])
	.setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]);
