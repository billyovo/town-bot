import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { timeConvert } from "~/src/lib/utils/fetch/timeConvert";

export async function execute(interaction: ChatInputCommandInteraction) {
	const time: string | null = interaction.options.getString("time") ?? null;
	const from_timezone: string | null = interaction.options.getString("from_timezone") ?? null;
	const to_timezone: string | null = interaction.options.getString("to_timezone") ?? null;

	if (!time || !from_timezone || !to_timezone) {
		return interaction.reply({ content: "Invalid time received", ephemeral: true });
	}

	const completeTimeString = generateCorrectTimeFormat(time, from_timezone);

	const dt = DateTime.fromFormat(completeTimeString, "dd/MM HH:mm", {
		zone: from_timezone,
	});

	const response = await timeConvert(dt, from_timezone, to_timezone);
	const convertedTime = DateTime.fromISO(response?.conversionResult.dateTime ?? "");
	if (response === null) {
		return interaction.reply({ content: "Failed to convert the time", ephemeral: true });
	}

	const embed = new EmbedBuilder()
		.setColor("#282C34")
		.setTitle("Time Convert")
		.addFields(
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

function formatDate(dateString: string) {
	const [day, month] = dateString.split("/");
	const paddedMonth = month.padStart(2, "0");
	const paddedDay = day.padStart(2, "0");
	return `${paddedDay}/${paddedMonth}`;
}

function generateCorrectTimeFormat(time: string, from_timezone: string) {
	const timeParts = time.split(" ");
	const timeString = timeParts.length > 1 ? timeParts[1] : timeParts[0];
	const dateString = timeParts.length > 1 ? timeParts[0] : DateTime.now().setZone(from_timezone).toFormat("dd/MM");
	const formattedDateString = formatDate(dateString);

	const completeTimeString = `${formattedDateString} ${timeString}`;

	return completeTimeString;
}
