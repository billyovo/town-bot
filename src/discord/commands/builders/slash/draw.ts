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
				{ "name": "1:1", "value": "1024x1024" },
				{ "name": "16:9", "value": "1344x768" },
				{ "name": "4:3", "value": "1184x864" },
				{ "name": "9:16", "value": "768x1344" },
				{ "name": "21:9", "value": "1536x672" },
				{ "name": "2:3", "value": "832x1248" },
				{ "name": "3:2", "value": "1248x832" },
				{ "name": "3:4", "value": "864x1184" },
				{ "name": "4:5", "value": "896x1152" },
				{ "name": "5:4", "value": "1152x896" },
			),
	)
	.addStringOption(option =>
		option.setName("image_url")
			.setDescription("image url")
			.setRequired(false),
	)
	.addAttachmentOption(option =>
		option.setName("image")
			.setDescription("image")
			.setRequired(false),
	);