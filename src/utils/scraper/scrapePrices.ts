import { parseShopWebsite } from "./websites/parse";
import type { PriceAlertChecked, PriceAlertItem } from "../../@types/priceAlert";
import { PriceAlertResult } from "../../enums/priceAlertShopOption";
import { logger } from "../../logger/logger";

async function waitFor(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getPriceChange(product: PriceAlertItem) : Promise<PriceAlertChecked | null> {
	const delay = Math.random() * 300000;
	logger(`Delaying for ${delay}ms`);
	await waitFor(delay);
	const updatedProduct = await parseShopWebsite(product.url);
	logger(`Checked Product: ${updatedProduct?.productName}`);

	if (!updatedProduct) {
		return {
			data: {
				brand: product.brand,
				productName: product.productName,
				productImage: product.productImage,
				shop: product.shop,
				url: product.url,
				lastChecked: new Date(),
				price: product.price,
				failCount: product.failCount ? (product.failCount + 1) : 1,
			},
			result: PriceAlertResult.FAIL,
		};
	}
	if (updatedProduct.price !== product.price) {
		return {
			data: {
				brand: product.brand,
				productName: product.productName,
				productImage: product.productImage,
				shop: product.shop,
				url: product.url,
				lastChecked: new Date(),
				price: updatedProduct.price,
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
				brand: product.brand,
				productName: product.productName,
				productImage: product.productImage,
				shop: product.shop,
				url: product.url,
				lastChecked: new Date(),
				price: updatedProduct.price,
				failCount: 0,
			},
			result: PriceAlertResult.SUCCESS,
		};
	}


}