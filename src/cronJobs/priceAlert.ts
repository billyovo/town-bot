import { scheduleJob } from "node-schedule";
import { logger } from "../lib/logger/logger";
import { getPriceChange, handleScrapeResult } from "~/src/lib/price-alert/handlePriceAlert";
import { PriceAlertItem, PriceAlertModel } from "../lib/database/schemas/product";
import { parseShopWebsite } from "../lib/price-alert/scrape/parse";
import { scrapeDelayTime } from "~/src/configs/price-alert";
import { delay } from "../lib/utils/time/delay";
import { PriceAlertChecked, ShopParseFunctionReturn } from "~/src/@types/price-alert";

scheduleJob("15 9,18 * * *", async () => {
	logger.info("Running price alert check");

	const cursor : AsyncIterable<PriceAlertItem> = PriceAlertModel.find({ isEnabled: true }).lean().cursor();
	for await (const product of cursor) {
		const randomDelayTime = Math.floor(Math.random() * scrapeDelayTime);
		await delay(randomDelayTime);

		const newProductInfo : ShopParseFunctionReturn = await parseShopWebsite(product.url, product, { skipImageFetch: true });
		const scrapeResult : PriceAlertChecked = await getPriceChange(product, newProductInfo);

		await handleScrapeResult(scrapeResult);

	}
});