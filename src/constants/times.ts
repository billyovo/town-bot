import { DateTime, Duration } from "luxon";

// 1 hour
export const timeBetweenSurvivalAndSkyblockInMillisecond = Duration.fromObject({ hours: 1 }).as("milliseconds");

// 20 minutes
export const annoucementTimeBeforeEventStart = Duration.fromObject({ minutes: 20 }).as("milliseconds");

// 5:00 PM
export function getEventTomorrowAnnoucementTime() {
	return DateTime.fromObject({ hour: 17, minute: 0, second: 0, millisecond: 0 }).toJSDate();
}

export const guildEventScheduleTime = Duration.fromObject({ days: 7 }).as("milliseconds");

export const guildEventScheduleDuration = Duration.fromObject({ minutes: 15 }).as("milliseconds");
