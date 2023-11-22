import { ChatInputCommandInteraction, Collection } from "discord.js";
import { eventSchedule } from "@managers/eventScheduleManager";
import { timeBetweenSurvivalAndSkyblockInMillisecond } from "@constants/times";
import { getSingleEventTimeMessage } from "@assets/messages/messages";
import { EventScheduleItem } from "../../@types/eventSchedule";
import { TimeStampOptionEnum } from "@enums/timestamp";

export async function execute(interaction: ChatInputCommandInteraction) {
	const targetEventCollection : Collection<string, EventScheduleItem> = eventSchedule.tomorrow;
	if (targetEventCollection.size === 0) return interaction.reply("明天沒有活動");

	const message = targetEventCollection.map((event : EventScheduleItem) => {
		return getSingleEventTimeMessage({
			event: event,
			timeBetweenEvent: timeBetweenSurvivalAndSkyblockInMillisecond,
			timestampType: TimeStampOptionEnum.COUNTDOWN,
		});
	}).join("\n\n");

	await interaction.reply(message);
}