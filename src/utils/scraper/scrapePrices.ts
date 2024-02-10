import { parseShopWebsite } from "./parse/parse";
import type { PriceAlertChecked, PriceAlertItem, ShopParseOptions } from "~/types/priceAlert";
import { PriceAlertResult } from "~/enums/priceAlertShopOption";
import { logger } from "~/logger/logger";
import { updateDatabaseFromScrapeResult } from "./db/db";
import { maximumFailureCount, scrapeDelayTime } from "~/configs/scraper";

export async function delayNextFetch() {
	const delay = Math.random() * scrapeDelayTime;
	logger(`Delaying for ${Math.round(delay)}ms`);
	return new Promise(resolve => setTimeout(resolve, delay));
}

export async function getPriceChange(product: PriceAlertItem, options?: ShopParseOptions) : Promise<PriceAlertChecked> {
	const updatedProduct = await parseShopWebsite(product.url, options);

	if (!updatedProduct.success) {
		return {
			data: {
				...product,
				lastChecked: new Date(),
				failCount: product.failCount ? (product.failCount + 1) : 1,
			},
			result: PriceAlertResult.FAIL,
			error: updatedProduct.error,
		};
	}
	logger(`Checked Product: ${updatedProduct.data.productName}`);

	if (updatedProduct.data.price !== product.price) {
		return {
			data: {
				...product,
				lastChecked: new Date(),
				price: updatedProduct.data.price,
				previous: {
					price: product.price,
					date: product.lastChecked,
				},
				failCount: 0,
			},
			result: PriceAlertResult.PRICE_CHANGE,
		};
	}
	else {
		return {
			data:{
				...product,
				lastChecked: new Date(),
				failCount: 0,
			},
			result: PriceAlertResult.SUCCESS,
		};
	}
}

type ScrapeResultActions = {
	onPriceChange: (product: PriceAlertItem) =>void,
	onFailure: (product: PriceAlertItem) => void,
	onTooManyFailures: (product: PriceAlertItem) => void,
}

export const handleScrapeResult = async (scrapeResult : PriceAlertChecked, actions : ScrapeResultActions) => {
	switch (scrapeResult.result) {
	case PriceAlertResult.PRICE_CHANGE:
		actions.onPriceChange(scrapeResult.data);
		break;
	case PriceAlertResult.FAIL:{
		actions.onFailure(scrapeResult.data);
		if (scrapeResult.data.failCount && scrapeResult.data.failCount > maximumFailureCount) {
			actions.onTooManyFailures(scrapeResult.data);
		}
	}

	}
	await updateDatabaseFromScrapeResult(scrapeResult);
};