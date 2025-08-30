import { ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder } from "discord.js";


export const command = new SlashCommandBuilder()
	.setName("draw")
	.setDescription("draw something")
	.setIntegrationTypes([ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall])
	.setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
	.addStringOption(option => option.setName("prompt").setDescription("prompt").setRequired(true))
	.addStringOption(option =>
		option.setName("size")
			.setDescription("size")
			.setRequired(false)
			.addChoices(
				{
					"name": "1024x1024",
					"value": "1024x1024",
				},
				{
					"name": "1024x1536",
					"value": "1024x1536",
				},
				{
					"name": "1536x1024",
					"value": "1536x1024",
				},
			),
	)
	.addStringOption(option =>
		option.setName("quality")
			.setDescription("quality")
			.setRequired(false)
			.addChoices(
				{
					"name": "low",
					"value": "low",
				},
				{
					"name": "medium",
					"value": "medium",
				},
				{
					"name": "high",
					"value": "high",
				},
			),
	);