import { timeStringToMills, timeToHuman } from "~/constants/timeStringToMills";
import { Failure, Success } from "~/types/utils";

export function parseDurationStringToMills(duration: string) : Success<number> | Failure {
	const regex = /\d*\.?\d+[a-z]+/gi;
	const matches = duration.match(regex);
	if (!matches) {
		return {
			data: null,
			error: "Invalid duration",
			success: false,
		};
	}

	let totalTime = 0;
	for (const match of matches) {
		const num = parseFloat(match);
		const unit = match.replace(num.toString(), "");

		if (!timeStringToMills[unit]) {
			return {
				data: null,
				error: `Invalid unit ${unit}`,
				success: false,
			};
		}

		totalTime += num * timeStringToMills[unit];
	}

	return {
		data: totalTime,
		success: true,
	};
}

export function parseMillsToHuman(duration: number) {
	// take the largest unit from mills, and continue until "seconds"

	const units = Object.keys(timeToHuman).reverse();
	let remaining = duration;
	let result = "";
	for (const unit of units) {
		const unitInMills = timeToHuman[unit];
		const unitCount = Math.floor(remaining / unitInMills);
		if (unitCount > 0) {
			result += `${unitCount} ${unit}${unitCount > 1 ? "s" : ""} `;
			remaining -= unitCount * unitInMills;
		}
	}

	return result;
}