import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { TimeAPICurrentTimeData } from "~/src/@types/timeapi";
import { timeNow } from "~/src/lib/time/timeNow";

export async function execute(interaction: ChatInputCommandInteraction) {
	const embed = new EmbedBuilder()
		.setColor("#282C34")
		.setTitle("Current Time");

	const inputZone = interaction.options.getString("timezone") ?? "";
	const fromTimeZoneValid = DateTime.now().setZone(inputZone).isValid;
	if (!fromTimeZoneValid) return interaction.reply({ content: "Invalid timezone", ephemeral: true });

	await interaction.deferReply();

	const zones = [];

	if (inputZone) {
		zones.push(inputZone);
	}
	else {
		zones.push("Asia/Taipei");
		zones.push("Canada/Pacific");
		zones.push("Australia/Queensland");
	}

	for (const zone of zones) {
		const data : TimeAPICurrentTimeData | null = await timeNow(zone);
		const isDST = data?.dstActive ? "☀" : "";
		embed.addFields({
			name: zone,
			value: data ? `${data.time} | ${data.time} ${isDST}` : "Failed to get time",
			inline: true,
		});
	}
	interaction.reply({ embeds: [embed] });
}