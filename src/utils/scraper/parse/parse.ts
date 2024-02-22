import { PriceAlertShopOption, PriceAlertShopParseDetails } from "~/enums/priceAlertShopOption";
import type { ShopParseFunctionReturn, ShopParseOptions } from "~/types/priceAlert";
import { getShopFromURL } from "../url/getShopFromURL";


export async function parseShopWebsite(url: string, options?: ShopParseOptions) : Promise<ShopParseFunctionReturn> {
	const shop = getShopFromURL(url);

	if (!shop?.shop) {
		return {
			data: null,
			error: "No Shop Found in URL",
			success: false,
		};
	}

	const parseFunction = getParseWebsiteFunction(shop.shop);

	if (!parseFunction) {
		return {
			data: null,
			error: `Shop not supported: ${shop.domain ?? "UNKNOWN DOMAIN"}`,
			success: false,
		};
	}

	return await parseFunction(url, shop, options);
}

export function getParseWebsiteFunction(shop: PriceAlertShopOption) {

	return PriceAlertShopParseDetails[shop]?.parseFunction ?? null;
}

export function parsePriceToFloat(price: string) : number {
	return parseFloat(price.replace(/[^0-9.]/g, ""));
}