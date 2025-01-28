import { ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder } from "discord.js";


export const command = new SlashCommandBuilder()
	.setName("draw")
	.setDescription("draw something")
	.setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
	.setContexts([InteractionContextType.Guild])
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
					"name": "1792x1024",
					"value": "1792x1024",
				},
				{
					"name": "1024x1792",
					"value": "1024x1792",
				},
			),
	)
	.addStringOption(option =>
		option.setName("style")
			.setDescription("style")
			.setRequired(false)
			.addChoices(
				{
					"name": "vivid",
					"value": "vivid",
				},
				{
					"name": "natural",
					"value": "natural",
				},
			),
	)
	.addStringOption(option =>
		option.setName("quality")
			.setDescription("quality")
			.setRequired(false)
			.addChoices(
				{
					"name": "hd",
					"value": "hd",
				},
				{
					"name": "standard",
					"value": "standard",
				},
			),
	);