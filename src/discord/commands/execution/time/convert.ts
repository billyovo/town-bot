import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { timeConvert } from "~/src/lib/utils/fetch/timeConvert";

export async function execute(interaction: ChatInputCommandInteraction) {
	const time = interaction.options?.get("time")?.value?.toString()?.trim() ?? null;
	const from_timezone = interaction.options?.get("from_timezone")?.value?.toString() ?? null;
	const to_timezone = interaction.options?.get("to_timezone")?.value?.toString() ?? null;

	if (!time || !from_timezone || !to_timezone) {
		return interaction.reply({ content: "Invalid time received", ephemeral: true });
	}

	const time_length = time.split(" ").length;
	// let me steal this
	const dt = DateTime.fromFormat(time, time_length === 1 ? "HH:mm" : "dd/MM HH:mm", {
		zone: from_timezone,
	});

	const response = await timeConvert(dt, from_timezone, to_timezone);
	if (response === null) {
		return interaction.reply({ content: "Failed to convert the time", ephemeral: true });
	}

	const convertedTime = DateTime.fromISO(response?.conversionResult.dateTime);

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
			value: convertedTime.toFormat("dd/MM | HH:mm"),
			inline: true,
		},
	);

	interaction.reply({ embeds: [embed] });
}
