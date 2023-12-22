import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";

export function execute(interaction: ChatInputCommandInteraction) {
	const time = interaction.options?.get("time")?.value?.toString()?.trim() ?? null;
	const from_timezone = interaction.options?.get("from_timezone")?.value?.toString().trim().toUpperCase() ?? null;
	const to_timezone = interaction.options?.get("to_timezone")?.value?.toString().trim().toUpperCase() ?? null;

	if (!time || !from_timezone || !to_timezone) {
		return interaction.reply({ content: "Invalid time received", ephemeral: true });
	}

	const time_length = time.split(" ").length;

	const dt = DateTime.fromFormat(time, time_length === 1 ? "HH:mm" : "dd/MM HH:mm", {
		zone: from_timezone,
	});

	const dt_converted = dt.setZone(to_timezone);


	if (!dt.isValid || !dt_converted.isValid) {
		interaction.reply({ content: "Invalid time received", ephemeral: true });
		return;
	}


	const embed = new EmbedBuilder()
		.setColor("#282C34")
		.setTitle("Time Convert");
	embed.addFields(
		{
			name: from_timezone,
			value: dt.toFormat("dd/MM | HH:mm"),
			inline: true,
		},
		{
			name: "\u200b",
			value: ":arrow_right:",
			inline: true,
		},
		{
			name: to_timezone,
			value: dt_converted.toFormat("dd/MM | HH:mm"),
			inline: true,
		},
	);

	interaction.reply({ embeds: [embed] });
}