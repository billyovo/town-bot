import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { DateTime } from "luxon";
import { timeConvert } from "~/src/lib/time/timeConvert";

export async function execute(interaction: ChatInputCommandInteraction) {
	const time: string | null = interaction.options.getString("time") ?? null;
	const from_timezone: string | null = interaction.options.getString("from_timezone") ?? null;
	const to_timezone: string | null = interaction.options.getString("to_timezone") ?? null;

	if (!time) return interaction.reply({ content: "Please provide a time", flags: MessageFlags.Ephemeral });
	if (!from_timezone) return interaction.reply({ content: "Please provide a from timezone", flags: MessageFlags.Ephemeral });
	if (!to_timezone) return interaction.reply({ content: "Please provide a to timezone", flags: MessageFlags.Ephemeral });

	const fromTimeZoneValid = DateTime.now().setZone(from_timezone).isValid;
	const toTimeZoneValid = DateTime.now().setZone(to_timezone).isValid;

	if (!fromTimeZoneValid) return interaction.reply({ content: "Invalid from timezone", flags: MessageFlags.Ephemeral });
	if (!toTimeZoneValid) return interaction.reply({ content: "Invalid to timezone", flags: MessageFlags.Ephemeral });

	const completeTimeString = generateCorrectTimeFormat(time, from_timezone);

	const dt = DateTime.fromFormat(completeTimeString, "dd/MM HH:mm", {
		zone: from_timezone,
	});

	const response = await timeConvert(dt, from_timezone, to_timezone);
	const convertedTime = DateTime.fromISO(response?.conversionResult.dateTime ?? "");
	if (response === null) {
		return interaction.reply({ content: "Failed to convert the time", flags: MessageFlags.Ephemeral });
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
