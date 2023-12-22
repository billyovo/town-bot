import { SlashCommandBuilder } from "discord.js";

const TZ_choices = [
	{
		name: "PST",
		value: "PST",
	},
	{
		name: "HKT",
		value: "UTC+8",
	},
	{
		name: "AEST",
		value: "Australia/Queensland",
	},
];
export const command = new SlashCommandBuilder()
	.setName("time")
	.setDescription("time")
	.addSubcommand(subcommand =>
		subcommand
			.setName("now")
			.setDescription("get time now"),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName("convert")
			.setDescription("convert time")
			.addStringOption(option =>
				option
					.setName("time")
					.setDescription("time")
					.setRequired(true),
			)
			.addStringOption(option =>
				option
					.setName("from_timezone")
					.setDescription("from timezone")
					.setRequired(true)
					.addChoices(...TZ_choices),
			)
			.addStringOption(option =>
				option
					.setName("to_timezone")
					.setDescription("to timezone")
					.setRequired(true)
					.addChoices(...TZ_choices),
			),
	);

