import { RRule } from "rrule";
import { DateTime } from "luxon";

export function getOccurrencFromRRuleString(fromDate: Date, rrule: string) : Date {
	const rule = RRule.fromString(rrule);
	const nextOccurrence = rule.after(fromDate, true) as Date;

	// by pass the timezone bug in rrule by substracting, very smart.
	return DateTime.fromJSDate(nextOccurrence).minus({ hours: 8 }).toJSDate();
}

export function isToday(date1: Date, date2: Date) : boolean {
	const date1Luxon = DateTime.fromJSDate(date1);
	const date2Luxon = DateTime.fromJSDate(date2);

	return date1Luxon.hasSame(date2Luxon, "day");
}

export function isTomorrow(date1: Date, date2: Date) : boolean {
	const date1Luxon = DateTime.fromJSDate(date1);
	const date2Luxon = DateTime.fromJSDate(date2);

	return date1Luxon.plus({ days: 1 }).hasSame(date2Luxon, "day");
}