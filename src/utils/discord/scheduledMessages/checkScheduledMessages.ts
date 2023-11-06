import { scheduleTodayEventMessage, scheduleTomorrowEventMessage } from "./scheduleMessages";
import { DateTime } from "luxon";
import { timeBetweenSurvivalAndSkyblockInMillisecond } from "../../../constants/times";
import { ServerRoleMentionEnum } from "../../../enums/servers";
import { CheckTomorrowScheduleMessageOptions, checkTodayScheduleMessageOptions } from "../../../@types/discord";

export function checkTomorrowScheduleMessage(options: CheckTomorrowScheduleMessageOptions) : void {
	for (const [_key, event] of options.tomorrowEvents) {
		scheduleTomorrowEventMessage({ annoucementChannel: options.annoucementChannel, avatarURL: options.avatarURL ?? "", event: event });
	}
}

export function checkTodayScheduleMessage(options: checkTodayScheduleMessageOptions) : void {
	for (const [_key, event] of options.todayEvents) {
		const skyblockAnnoucementTime = DateTime.fromJSDate(event.nextOccurrence).toJSDate();
		const survivalAnnoucementTime = DateTime.fromJSDate(event.nextOccurrence)
			.plus({ millisecond: timeBetweenSurvivalAndSkyblockInMillisecond })
			.toJSDate();

		scheduleTodayEventMessage({
			annoucementChannel: options.annoucementChannel,
			event: event,
			startTime: skyblockAnnoucementTime,
			mentionedRole: ServerRoleMentionEnum.SKYBLOCK,
		});

		scheduleTodayEventMessage({
			annoucementChannel: options.annoucementChannel,
			event: event,
			startTime: survivalAnnoucementTime,
			mentionedRole: ServerRoleMentionEnum.SURVIVAL,

		});
	}
}