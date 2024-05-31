import axios from "axios";
import { TimeAPICurrentTimeData } from "~/src/@types/timeapi";
import { log } from "~/src/lib/logger/logger";

export async function timeNow(timezone: string): Promise<TimeAPICurrentTimeData | null> {
	try {
		const response = await axios.get("https://timeapi.io/api/Time/current/zone", {
			params: {
				timeZone: timezone,
			},
		});
		return response.data;
	}
	catch (error) {
		log(`failed to get data from time api ${error}`);
		return null;
	}
}
