import { DateTime } from "luxon";

export function returnDiff(now : DateTime) {
	const arrival_date = DateTime.now().setZone("Asia/Taipei").startOf("day").set({ day: 24, month: 4, year: 2022 });

	if (now.ordinal === arrival_date.ordinal) {
		const diff = now.diff(arrival_date, "years").toObject();
		return Math.round(diff.years as number) + "周年";
	}
	else {
		const diff = now.diff(arrival_date, "days").toObject();
		return "第" + Math.round(diff.days as number) + "天";
	}
}