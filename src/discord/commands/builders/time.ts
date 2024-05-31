import { SlashCommandBuilder } from "discord.js";
export const command = new SlashCommandBuilder()
	.setName("time")
	.setDescription("time")
	.addSubcommand(subcommand =>
		subcommand
			.setName("now")
			.setDescription("get time now")
			.addStringOption(option =>
				option
					.setName("timezone")
					.setDescription("timezone")
					.setRequired(false)
					.setAutocomplete(true),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName("convert")
			.setDescription("convert time")
			.addStringOption(option =>
				option
					.setName("time")
					.setDescription("time with format HH:mm or dd/MM HH:mm, e.g. 30/05 10:00 for May 30th 10AM")
					.setRequired(true),
			)
			.addStringOption(option =>
				option
					.setName("from_timezone")
					.setDescription("from timezone")
					.setRequired(true)
					.setAutocomplete(true),
			)
			.addStringOption(option =>
				option
					.setName("to_timezone")
					.setDescription("to timezone")
					.setRequired(true)
					.setAutocomplete(true),
			),
	);
