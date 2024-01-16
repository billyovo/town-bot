import { parseShopWebsite } from "./websites/parse";
import type { PriceAlertChecked, PriceAlertItem } from "../../@types/priceAlert";
import { PriceAlertResult } from "../../enums/priceAlertShopOption";
import { logger } from "../../logger/logger";
import { scrapeDelayTime } from "@configs/scraper";

async function waitFor(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getPriceChange(product: PriceAlertItem) : Promise<PriceAlertChecked> {
	const delay = Math.random() * scrapeDelayTime;
	logger(`Delaying for ${delay}ms`);
	await waitFor(delay);
	const updatedProduct = await parseShopWebsite(product.url);

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