import { PriceAlertShopOption, PriceAlertShopParseDetails } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import type { ShopParseFunctionReturn, ShopParseOptions } from "~/src/@types/price-alert";
import { getShopFromURL } from "../utils/getShopFromURL";


export async function parseShopWebsite(url: string, options?: ShopParseOptions) : Promise<ShopParseFunctionReturn> {
	const shop = getShopFromURL(url);

	if (!shop?.domain) {
		return {
			data: null,
			error: "No Shop Found in URL",
			success: false,
		};
	}
	if (!shop.shop) {
		return {
			data: null,
			error: `Shop not supported: ${shop.domain ?? "UNKNOWN DOMAIN"}`,
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
