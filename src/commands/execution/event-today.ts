import { getSingleEventTimeMessage } from "@assets/messages/messages";
import { ChatInputCommandInteraction, Collection } from "discord.js";
import { eventSchedule } from "@managers/eventScheduleManager";
import { timeBetweenSurvivalAndSkyblockInMillisecond } from "@constants/times";
import { EventScheduleItem } from "../../@types/eventSchedule";
import { TimeStampOptionEnum } from "@enums/timestamp";

export async function execute(interaction: ChatInputCommandInteraction) {
	const targetEventCollection : Collection<string, EventScheduleItem> = eventSchedule.today;
	if (targetEventCollection.size === 0) return interaction.reply("今天沒有活動");

	const message = targetEventCollection.map((event : EventScheduleItem) => {
		return getSingleEventTimeMessage({
			event: event,
			timeBetweenEvent: timeBetweenSurvivalAndSkyblockInMillisecond,
			timestampType: TimeStampOptionEnum.COUNTDOWN,
		});
	}).join("\n\n");

	await interaction.reply(message);
}