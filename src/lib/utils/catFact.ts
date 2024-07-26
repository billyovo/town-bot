import axios from "axios";
import { logger } from "~/src/lib/logger/logger";

export async function getCatFact() : Promise<string> {
	try {
		const res = await axios.get("https://catfact.ninja/fact");
		return res.data.fact;
	}
	catch (err) {
		if (err instanceof Error) {
			logger.error(err.message);
		}
		return "";
	}
}