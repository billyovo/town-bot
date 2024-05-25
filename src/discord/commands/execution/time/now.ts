import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";

export function execute(interaction: ChatInputCommandInteraction) {
	const embed = new EmbedBuilder()
		.setColor("#282C34")
		.setTitle("Current Time");

	const zones = ["Asia/Taipei", "Canada/Pacific", "Australia/Queensland"];
	const names = ["Hong Kong", "Canada", "Australia"];
	const all_dt = zones.map((element) => {
		return DateTime.now().setZone(element);
	});
	const data = all_dt.map((dt) => (
		{
			isDayLightSaving: dt.isInDST ? ":sunny:" : "",
			timeString: dt.toFormat("HH:mm"),
			date: dt.toFormat("dd/LL"),
			utcOffSet: "UTC" + dt.toFormat("ZZ"),
		}
	));
	for (let i = 0;i < zones.length;i++) {
		embed.addFields(
			{
				name: names[i] + " " + data[i].isDayLightSaving + " (" + data[i].utcOffSet + ")",
				value: data[i].timeString + " | " + data[i].date,
			},
		);

	}

	interaction.reply({ embeds: [embed] });
}