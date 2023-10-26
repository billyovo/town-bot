import { DateTime } from "luxon";
import { getOccurrencFromRRuleString, isToday, isTomorrow } from "./helper";
import { EventData, EventSchedule, EventScheduleItem } from "../../@types/eventSchedule";
import { Collection } from "discord.js";

export function checkSchedule(fromDate: Date, schedule: EventData[] = []) : EventSchedule {
	const output : EventSchedule = {
		list: new Collection(),
		today: new Collection,
		tomorrow: new Collection(),
	};

	for (const event of schedule) {
		const nextOccurrence : Date = getOccurrencFromRRuleString(fromDate, event.rrule);
		const eventScheduleItem : EventScheduleItem = {
			title: event.title,
			id: event.id,
			emote: event.emote,
			nextOccurrence: nextOccurrence,
		};

		output.list.set(eventScheduleItem.id ,eventScheduleItem);

		if (isToday(new Date(), nextOccurrence)) {
			output.list.set(eventScheduleItem.id ,eventScheduleItem);
			continue;
		}

		if (isTomorrow(new Date(), nextOccurrence)) {
			output.list.set(eventScheduleItem.id ,eventScheduleItem);
		}
		console.log(`${event.title} ${event.emote}\r\n${DateTime.fromJSDate(nextOccurrence).toFormat("yyyy-MM-dd HH:mm")}\r\n\r\n`);
	}
	output.list.sort((a, b) => a.nextOccurrence.getTime() - b.nextOccurrence.getTime());
	output.today.sort((a, b) => a.nextOccurrence.getTime() - b.nextOccurrence.getTime());
	output.tomorrow.sort((a, b) => a.nextOccurrence.getTime() - b.nextOccurrence.getTime());
	return output;
}

export function isScheduleValid(schedule: EventSchedule): boolean {
	if (schedule.list.size === 0) return false;

	for(let i = 0; i < schedule.list.size; i++) {
		if ((schedule.list.at(i)?.nextOccurrence || Infinity) < new Date()) return false;
	}

	return true;
}