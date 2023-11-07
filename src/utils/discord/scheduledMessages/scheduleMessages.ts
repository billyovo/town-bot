import { scheduleJob } from "node-schedule";
import { annoucementTimeBeforeEventStart, getEventTomorrowAnnoucementTime } from "@constants/times";
import { getEventTodayMessage, getEventTomorrowEmbed } from "@assets/messages/messages";
import { scheduleTodayEventMessageOptions, scheduleTomorrowEventMessageOptions } from "../../../@types/eventSchedule";
import { DateTime } from "luxon";
import { logger } from "../../../logger/logger";

export function scheduleTomorrowEventMessage(options: scheduleTomorrowEventMessageOptions) {
	logger(`Scheduled tomorrow event annoucement for: ${options.event.title} ${options.event.emote} at ${getEventTomorrowAnnoucementTime().toTimeString()}`);

	scheduleJob(getEventTomorrowAnnoucementTime(), () => {
		options.annoucementChannel?.send({
			embeds: [
				getEventTomorrowEmbed({ event: options.event, avatar: options.avatarURL }),
			],
		});
	});
}

export function scheduleTodayEventMessage(options: scheduleTodayEventMessageOptions) {
	const annouceTime = DateTime.fromJSDate(options.startTime).minus({ millisecond: annoucementTimeBeforeEventStart }).toJSDate();
	logger(`Scheduled today event annoucement for: ${options.event.title} ${options.event.emote} at ${annouceTime.toTimeString()}`);
	scheduleJob(annouceTime, () => {
		options.annoucementChannel?.send(getEventTodayMessage({
			event: options.event,
			startTime: options.startTime,
			mentionedRole: options.mentionedRole,
		}));
	});
}