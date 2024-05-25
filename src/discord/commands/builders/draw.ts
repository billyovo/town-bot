import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("draw")
	.setDescription("draw something")
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
					"name": "512x512",
					"value": "512x512",
				},
				{
					"name": "256x256",
					"value": "256x256",
				},
			),
	);