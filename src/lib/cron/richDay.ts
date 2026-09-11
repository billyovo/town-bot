import { DateTime } from "luxon";

type Day = {
	day: number;
	month: number;
	year: number;
}
export function returnDiff(now : DateTime, targetDay: Day) {
	const arrival_date = DateTime.now().setZone("Asia/Taipei").startOf("day").set(targetDay);

	if (now.ordinal === arrival_date.ordinal) {
		const diff = now.diff(arrival_date, "years").toObject();
		return Math.round(diff.years as number) + "周年";
	}
	else {
		const diff = now.diff(arrival_date, "days").toObject();
		return "第" + Math.round(diff.days as number) + "天";
	}
}