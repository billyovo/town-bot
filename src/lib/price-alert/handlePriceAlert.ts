import type { PriceAlertChecked, ShopParseFunctionReturn } from "~/src/@types/price-alert";
import { PriceAlertResult } from "./utils/enums/priceAlertShopOption";
import { log } from "../logger/logger";
import { maximumFailureCount } from "~/src/configs/price-alert";
import { PriceAlertItem, PriceAlertModel } from "../database/schemas/product";
import { getPriceChangeEmbed } from "~/src/assets/embeds/priceEmbeds";
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
	log(`Checked Product: ${newProductInfo.data.productName}`);

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
	onPriceChange: (updatedProduct) => {
		axios.post(process.env.PRICE_WEBHOOK as string, {
			embeds: [getPriceChangeEmbed(updatedProduct).toJSON()],
		}).catch((error) => {
			log(`Failed to send price change webhook: ${error}`);
		});
	},
	onFailure: (updatedProduct, error) => {
		axios.post(process.env.PRICE_WEBHOOK as string, {
			content: `Failed to check [${updatedProduct.productName}](${updatedProduct.url}) from ${updatedProduct.shop} ${updatedProduct.failCount} times.\r\nReason: ${error ?? "Unknown Error"}`,
		});
	},
	onTooManyFailures: (updatedProduct) => {
		PriceAlertModel.findOneAndDelete({ url: updatedProduct.url });
		axios.post(process.env.PRICE_WEBHOOK as string, {
			content: `Deleted [${updatedProduct.productName}](${updatedProduct.url}) from ${updatedProduct.shop} due to too many failures.`,
		}).catch((error) => {
			log(`Failed to send too many failures webhook: ${error}`);
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
