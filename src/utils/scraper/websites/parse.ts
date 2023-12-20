import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { parseHktvmallPrice } from "./hktvmall";
import type { PriceOutput } from "../../../@types/priceAlert";

type ParseFunctions = {
    [key in PriceAlertShopOption]?: (shop: PriceAlertShopOption) => Promise<PriceOutput | null>
};

export function getShopFromURL(url: string) : { shop: PriceAlertShopOption | null, domain: string } {
	const urlObj = new URL(url);
	const domain: string = urlObj.hostname.split(".")[1].toUpperCase();
	const shop = PriceAlertShopOption[domain as keyof typeof PriceAlertShopOption];

	return {
		shop: shop,
		domain: domain,
	};
}

export function parseShopWebsite(url: string) {
	const shop = getShopFromURL(url);

	const parseFunction = getParseWebsiteFunction(shop.shop as PriceAlertShopOption);

	if (!parseFunction) return null;

	return parseFunction(shop.shop as PriceAlertShopOption);
}

export function getParseWebsiteFunction(shop: PriceAlertShopOption) {
	const parseFunctions: ParseFunctions = {
		[PriceAlertShopOption.HKTVMALL]: parseHktvmallPrice,
	};

	const parseFunction = parseFunctions[PriceAlertShopOption[shop as keyof typeof PriceAlertShopOption]];
	if (!parseFunction) return null;
	return parseFunction;
}