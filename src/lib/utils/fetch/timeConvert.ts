import axios from "axios";
import { DateTime } from "luxon";
import { TimeAPIConversionData } from "~/src/@types/timeapi";
import { log } from "../../logger/logger";

export async function timeConvert(time: DateTime, from_timeZone: string, to_timeZone: string): Promise<TimeAPIConversionData | null> {
	const data = {
		"fromTimeZone": from_timeZone,
		"dateTime": time.toFormat("yyyy-MM-dd HH:mm:ss"),
		"toTimeZone": to_timeZone,
		"dstAmbiguity": "",
	};

	try {
		const response = await axios.post("https://timeapi.io/api/Conversion/ConvertTimeZone", data);
		return response.data;
	}
	catch (error) {
		log(`failed to get data from time api ${error}`);
		return null;
	}
}
