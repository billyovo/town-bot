import { PromotionType } from "~/src/@types/enum/price-alert";
import type { ShopParseFunctionReturn, PriceAlertChecked, PromotionClassified } from "~/src/@types/price-alert";
import { PriceAlertResult } from "./utils/enums/priceAlertShopOption";
import { logger } from "~/src/lib/logger/logger";
import { maximumFailureCount } from "~/src/configs/price-alert";
import { PriceAlertItem, PriceAlertModel } from "../database/schemas/product";
import { getPriceChangeEmbed } from "~/src/assets/embeds/priceEmbeds";
import axios from "axios";

function hasNewPromotion(oldPromotions: PromotionClassified[] | undefined, newPromotions: PromotionClassified[] | undefined) : boolean {
	if (!oldPromotions || oldPromotions.length === 0) return false;
	if (!newPromotions || newPromotions.length === 0) return false;

	for (const newPromotion of newPromotions) {
		const match = oldPromotions.find(oldPromotion => oldPromotion.description === newPromotion.description);
		if (!match) {
			return true;
		}
	}
	return false;
}

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
	logger.info(`Checked Product: ${newProductInfo.data.productName}`);
	const oldPromotions : PromotionClassified[] | undefined = oldProductInfo.promotions?.filter((promotion) => promotion.type === PromotionType.DISCOUNT);
	const newPromotions : PromotionClassified[] | undefined = newProductInfo.data.promotions?.filter((promotion) => promotion.type === PromotionType.DISCOUNT);
	const isNewPromotionAdded = hasNewPromotion(oldPromotions, newPromotions);
	const isPriceReduced = newProductInfo.data.price < oldProductInfo.price;
	const isPriceIncreased = newProductInfo.data.price > oldProductInfo.price;

	if (isNewPromotionAdded || isPriceReduced) {
		return {
			data: {
				...oldProductInfo,
				lastChecked: new Date(),
				price: newProductInfo.data.price,
				promotions: newProductInfo.data.promotions,
				previous: {
					price: isPriceReduced ? oldProductInfo.price : (oldProductInfo?.previous?.price ?? oldProductInfo.price),
					date: isPriceReduced ? oldProductInfo.lastChecked : (oldProductInfo?.previous?.date ?? oldProductInfo.lastChecked),
				},
				failCount: 0,
			},
			result: PriceAlertResult.PRICE_DECREASE,
		};
	}

	if (isPriceIncreased) {
		return {
			data: {
				...oldProductInfo,
				lastChecked: new Date(),
				price: newProductInfo.data.price,
				promotions: newProductInfo.data.promotions,
				previous: {
					price: oldProductInfo.price,
					date: oldProductInfo.lastChecked,
				},
				failCount: 0,
			},
			result: PriceAlertResult.PRICE_INCREASE,
		};
	}

	return {
		data:{
			...oldProductInfo,
			lastChecked: new Date(),
			failCount: 0,
		},
		result: PriceAlertResult.SUCCESS,
	};

}

type ScrapeResultActions = {
	onPriceIncrease: (product: PriceAlertItem) => void,
	onPriceDecrease: (product: PriceAlertItem) => void,
	onFailure: (product: PriceAlertItem, error?: string) => void,
	onTooManyFailures?: (product: PriceAlertItem) => void,
	onSuccess?: (product: PriceAlertItem) => void,
}

const defaultActions : ScrapeResultActions = {
	onPriceDecrease: (updatedProduct) => {
		axios.post(process.env.PRICE_WEBHOOK as string, {
			embeds: [getPriceChangeEmbed(updatedProduct).toJSON()],
		}).catch((error) => {
			logger.error(`Failed to send price change webhook: ${error}`);
		});
	},
	onPriceIncrease: () => {
		// Do nothing!
	},
	onFailure: (updatedProduct, error) => {
		axios.post(process.env.PRICE_WEBHOOK as string, {
			content: `Failed to check [${updatedProduct.productName}](${updatedProduct.url}) from ${updatedProduct.shop} ${updatedProduct.failCount} times.\r\nReason: ${error ?? "Unknown Error"}`,
		});
	},
	onTooManyFailures: async (updatedProduct) => {
		await PriceAlertModel.updateOne({ url: updatedProduct.url }, { isEnabled: false });
		axios.post(process.env.PRICE_WEBHOOK as string, {
			content: `Disabled [${updatedProduct.productName}](${updatedProduct.url}) from ${updatedProduct.shop} due to too many failures.`,
		}).catch((error) => {
			logger.error(`Failed to send too many failures webhook: ${error}`);
		});
	},
};

export const handleScrapeResult = async (scrapeResult : PriceAlertChecked, actions = defaultActions) => {
	switch (scrapeResult.result) {
	case PriceAlertResult.PRICE_DECREASE:
		actions.onPriceDecrease(scrapeResult.data);
		break;
	case PriceAlertResult.PRICE_INCREASE:
		actions.onPriceIncrease(scrapeResult.data);
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
