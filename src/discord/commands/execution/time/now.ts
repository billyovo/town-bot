import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { DateTime } from "luxon";
import { TimeAPICurrentTimeData } from "~/src/@types/timeapi";
import { timeNow } from "~/src/lib/time/timeNow";

export async function execute(interaction: ChatInputCommandInteraction) {
	const embed = new EmbedBuilder()
		.setColor("#282C34")
		.setTitle("Current Time");

	const inputZone = interaction.options.getString("timezone") ?? "";
	const fromTimeZoneValid = DateTime.now().setZone(inputZone).isValid;
	if (inputZone && !fromTimeZoneValid) return interaction.reply({ content: "Invalid timezone", flags: MessageFlags.Ephemeral });

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

	const zoneData : ({data: TimeAPICurrentTimeData|null, zone: string})[] = await Promise.all(zones.map(async (zone) => {
		return {
			zone: zone,
			data: await timeNow(zone),
		};
	}));

	for (const timeData of zoneData) {
		const isDST = timeData.data?.dstActive ? ":sunny:" : "";
		embed.addFields({
			name: timeData.data?.timeZone ?? timeData.zone,
			value: timeData.data ? `${timeData.data.day}/${timeData.data.month} | ${timeData.data.time} ${isDST}` : "Failed to get time",
		});
	}

	await interaction.editReply({ embeds: [embed] });
}