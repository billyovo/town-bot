import { ChatInputCommandInteraction } from "discord.js";
import { eventSchedule } from "@managers/eventScheduleManager";
import { timeBetweenSurvivalAndSkyblockInMillisecond } from "@constants/times";
import { getSingleEventTimeMessage } from "@assets/messages/messages";
import { EventScheduleItem } from "../../@types/eventSchedule";
import { TimeStampOptionEnum } from "@enums/timestamp";

export async function execute(interaction: ChatInputCommandInteraction) {
	const targetEvent : EventScheduleItem = eventSchedule.list.get(interaction.options.getString("event") || "") as EventScheduleItem;
	if (!targetEvent?.nextOccurrence) return interaction.reply("目前沒有活動");

	const message = getSingleEventTimeMessage({
		event: targetEvent,
		timeBetweenEvent: timeBetweenSurvivalAndSkyblockInMillisecond,
		timestampType: TimeStampOptionEnum.DATETIME,
	});
	await interaction.reply(message);
}