import axios from "axios";
import { DateTime } from "luxon";
import { TimeAPIData } from "~/src/@types/timeapi";

export async function timeConvert(time: DateTime, from_TimeZone: string, to_TimeZone: string): Promise<TimeAPIData | null> {
	const data = {
		"fromTimeZone": from_TimeZone,
		"dateTime": time.toFormat("yyyy-MM-dd HH:mm:ss"),
		"toTimeZone": to_TimeZone,
		"dstAmbiguity": "",
	};

	try {
		const response = await axios.post("https://timeapi.io/api/Conversion/ConvertTimeZone", data);
		return response.data;
	}
	catch (error) {
		return null;
	}
}
