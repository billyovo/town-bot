import { TextChannel } from "discord.js";
import { eventSchedule } from "../../../managers/eventScheduleManager";
import { scheduleTodayEventMessage, scheduleTomorrowEventMessage } from "./scheduledEvents";
import { DateTime } from "luxon";
import { annoucementTimeBeforeEventStart, getEventTomorrowAnnoucementTime, timeBetweenSurvivalAndSkyblockInMillisecond } from "../../../constants/times";
import { ServerRoleMentionEnum } from "../../../enums/servers";

export function planTomorrowScheduleMessage(options: {annoucementChannel: TextChannel, avatarURL: string}){
    for(const [_key, event] of eventSchedule.tomorrow){
		scheduleTomorrowEventMessage({annoucementChannel: options.annoucementChannel , avatarURL: options.avatarURL ?? '', event: event});
	}
}

export function planTodayScheduleMessage(options: { annoucementChannel: TextChannel }){
    for(const [_key, event] of eventSchedule.today){
        console.log(`Scheduled today event annoucement for: ${event.title} ${event.emote}`)
		const skyblockAnnoucementTime = DateTime.fromJSDate(event.nextOccurrence).minus({millisecond: annoucementTimeBeforeEventStart }).toJSDate();
		const survivalAnnoucementTime = DateTime.fromJSDate(event.nextOccurrence)
										.minus({millisecond: annoucementTimeBeforeEventStart })
										.plus({millisecond: timeBetweenSurvivalAndSkyblockInMillisecond })
										.toJSDate();

		scheduleTodayEventMessage({
			annoucementChannel: options.annoucementChannel,
			event: event,
			startTime: skyblockAnnoucementTime,
			mentionedRole: ServerRoleMentionEnum.SKYBLOCK
		});

		scheduleTodayEventMessage({
			annoucementChannel: options.annoucementChannel,
			event: event,
            startTime: survivalAnnoucementTime,
			mentionedRole: ServerRoleMentionEnum.SURVIVAL
            
		});
	}
}