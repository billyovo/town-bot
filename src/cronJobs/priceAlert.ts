import { scheduleJob } from "node-schedule";
import { logger } from "~/logger/logger";
import { delayNextFetch, getPriceChange, handleScrapeResult } from "~/utils/scraper/scrapePrices";
import { PriceAlertModel } from "~/utils/scraper/db/schema";

scheduleJob("7 10 * * *", async () => {
	logger("Running price alert check");

	const cursor = PriceAlertModel.find({}).cursor();

	for await (const product of cursor) {
		await delayNextFetch();
		const scrapeResult = await getPriceChange(product, { skipImageFetch: true });

		await handleScrapeResult(scrapeResult);

	}
});