import { scheduleJob } from "node-schedule";
import { logger } from "~/logger/logger";
import { getPriceChange, handleScrapeResult } from "~/utils/scraper/scrapePrices";
import { PriceAlertItem, PriceAlertModel } from "~/database/schemas/product";
import { parseShopWebsite } from "~/utils/scraper/parse/parse";
import { scrapeDelayTime } from "~/configs/scraper";
import { delay } from "~/utils/time/delay";
import { PriceAlertChecked, ShopParseFunctionReturn } from "~/types/priceAlert";

scheduleJob("15 9,18 * * *", async () => {
	logger("Running price alert check");

	const cursor = PriceAlertModel.find({}).cursor();

	for await (const product of cursor) {
		const randomDelayTime = Math.floor(Math.random() * scrapeDelayTime);
		await delay(randomDelayTime);

		const productObject : PriceAlertItem = product.toObject();
		const newProductInfo : ShopParseFunctionReturn = await parseShopWebsite(productObject.url, { skipImageFetch: true });
		const scrapeResult : PriceAlertChecked = await getPriceChange(productObject, newProductInfo);

		await handleScrapeResult(scrapeResult);

	}
});