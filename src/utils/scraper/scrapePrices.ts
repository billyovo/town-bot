import type { PriceAlertChecked, ShopParseFunctionReturn, } from "~/types/priceAlert";
import { PriceAlertResult } from "~/enums/priceAlertShopOption";
import { logger } from "~/logger/logger";
import { maximumFailureCount } from "~/configs/scraper";
import { PriceAlertItem, PriceAlertModel } from "~/database/schemas/product";
import { getPriceChangeEmbed } from "~/assets/embeds/priceEmbeds";
import axios from "axios";

export async function getPriceChange(oldProductInfo: PriceAlertItem, newProductInfo: ShopParseFunctionReturn) : Promise<PriceAlertChecked> {

	if (!newProductInfo.success) {
		return {
			data: {
				...oldProductInfo,
				lastChecked: new Date(),
				failCount: oldProductInfo.failCount + 1,
			},
			result: PriceAlertResult.FAIL,
			error: newProductInfo.error,
		};
	}
	logger(`Checked Product: ${newProductInfo.data.productName}`);

	if (newProductInfo.data.price.toFixed(1) !== oldProductInfo.price.toFixed(1)) {
		return {
			data: {
				...oldProductInfo,
				lastChecked: new Date(),
				price: newProductInfo.data.price,
				previous: {
					price: oldProductInfo.price,
					date: oldProductInfo.lastChecked,
				},
				failCount: 0,
			},
			result: PriceAlertResult.PRICE_CHANGE,
		};
	}
	else {
		return {
			data:{
				...oldProductInfo,
				lastChecked: new Date(),
				failCount: 0,
			},
			result: PriceAlertResult.SUCCESS,
		};
	}
}

type ScrapeResultActions = {
	onPriceChange: (product: PriceAlertItem) => void,
	onFailure: (product: PriceAlertItem, error?: string) => void,
	onTooManyFailures?: (product: PriceAlertItem) => void,
	onSuccess?: (product: PriceAlertItem) => void,
}

const defaultActions : ScrapeResultActions = {
	onPriceChange: async (updatedProduct) => {
		await axios.post(process.env.PRICE_WEBHOOK as string, {
			embeds: [getPriceChangeEmbed(updatedProduct).toJSON()],
		});
	},
	onFailure: async (updatedProduct, error) => {
		await axios.post(process.env.PRICE_WEBHOOK as string, {
			content: `Failed to check [${updatedProduct.productName}](${updatedProduct.url}) from ${updatedProduct.shop} ${updatedProduct.failCount} times.\r\nReason: ${error ?? "Unknown Error"}`,
		});
	},
	onTooManyFailures: async (updatedProduct) => {
		await PriceAlertModel.findOneAndDelete({ url: updatedProduct.url });
		await axios.post(process.env.PRICE_WEBHOOK as string, {
			content: `Deleted [${updatedProduct.productName}](${updatedProduct.url}) from ${updatedProduct.shop} due to too many failures.`,
		});
	},
};

export const handleScrapeResult = async (scrapeResult : PriceAlertChecked, actions = defaultActions) => {
	switch (scrapeResult.result) {
		case PriceAlertResult.PRICE_CHANGE:
			actions.onPriceChange(scrapeResult.data);
			break;
		case PriceAlertResult.SUCCESS:
			actions.onSuccess?.(scrapeResult.data);
			break;
		case PriceAlertResult.FAIL:{
			actions.onFailure(scrapeResult.data, scrapeResult.error);
			if (scrapeResult.data.failCount && scrapeResult.data.failCount >= maximumFailureCount) {
				if (actions.onTooManyFailures) {
					actions.onTooManyFailures(scrapeResult.data);
				}
			}
		}
	}
	await PriceAlertModel.updateOne({ url: scrapeResult.data.url }, scrapeResult.data);
};
