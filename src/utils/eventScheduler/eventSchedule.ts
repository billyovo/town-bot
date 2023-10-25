import { DateTime } from "luxon";
import { getOccurrencFromRRuleString, isToday, isTomorrow } from "./helper";
import { EventData, EventSchedule, EventScheduleItem } from "../../@types/eventSchedule";

export function checkSchedule(fromDate: Date, schedule: EventData[] = []) : EventSchedule {
	const output : EventSchedule = {
		list: [],
		today: [],
		tomorrow: [],
	};

	for (const event of schedule) {
		const nextOccurrence : Date = getOccurrencFromRRuleString(fromDate, event.rrule);
		const eventScheduleItem : EventScheduleItem = {
			title: event.title,
			id: event.id,
			emote: event.emote,
			nextOccurrence: nextOccurrence,
		};

		output.list.push(eventScheduleItem);

		if (isToday(new Date(), nextOccurrence)) {
			output.today.push(eventScheduleItem);
			continue;
		}

		if (isTomorrow(new Date(), nextOccurrence)) {
			output.tomorrow.push(eventScheduleItem);
		}
		console.log(`${event.title} ${event.emote}\r\n${DateTime.fromJSDate(nextOccurrence).toFormat("yyyy-MM-dd HH:mm")}\r\n`);
	}
	output.list.sort((a, b) => a.nextOccurrence.getTime() - b.nextOccurrence.getTime());
	output.today.sort((a, b) => a.nextOccurrence.getTime() - b.nextOccurrence.getTime());
	output.tomorrow.sort((a, b) => a.nextOccurrence.getTime() - b.nextOccurrence.getTime());
	return output;
}

export function isScheduleValid(schedule: EventSchedule): boolean {
	if (schedule.list.length === 0) return false;

	for (const event of schedule.list) {
		if (event.nextOccurrence < new Date()) return false;
	}

	return true;
}