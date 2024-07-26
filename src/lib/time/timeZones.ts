import { TimeZoneData } from "~/src/@types/timeZone";
import { logger } from "~/src/lib/logger/logger";
import { promises as fs } from "fs";
import { join } from "path";
import axios from "axios";

const filePath = join(__dirname, "../../assets/timeZone.json");

export async function getTimeZone(): Promise<Array<string> | null> {

	const timeZoneData = await getTimeZoneFile();
	if (timeZoneData) {
		const lastFetch = new Date(timeZoneData.lastFetch);
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
		if (lastFetch > oneMonthAgo) {
			return timeZoneData.data;
		}
	}

	let response;
	try {
		response = await axios.get("https://timeapi.io/api/TimeZone/AvailableTimeZones");
	}
	catch (error) {
		logger.error("failed to get timezones from time api");
		return null;
	}

	const newTimeZoneData: TimeZoneData = {
		"lastFetch": new Date().toISOString(),
		"data": response.data,
	};

	saveTimeZoneFile(newTimeZoneData);

	return response.data;
}

async function getTimeZoneFile(): Promise<TimeZoneData | null> {
	try {
		const data = await fs.readFile(filePath, "utf-8");
		return JSON.parse(data);
	}
	catch (error) {
		return null;
	}
}

async function saveTimeZoneFile(data: TimeZoneData) {
	try {
		await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
	}
	catch (error) {
		logger.error("failed to save TimeZoneFile");
	}
}
