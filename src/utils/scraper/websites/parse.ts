import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { parseHktvmallPrice } from "./hktvmall";
import type { ShopParseFunctionReturn } from "../../../@types/priceAlert";
import { parseAmazonPrice } from "./amazon";
import { parseAeonPrice } from "./aeon";

type ParseFunctions = {
    [key in PriceAlertShopOption]?: (url: string) => ShopParseFunctionReturn
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

export async function parseShopWebsite(url: string) : Promise<ShopParseFunctionReturn | null> {
	const shop = getShopFromURL(url);

	const parseFunction = getParseWebsiteFunction(shop.shop as PriceAlertShopOption);

	if (!parseFunction) return null;

	return await parseFunction(url);
}

export function getParseWebsiteFunction(shop: PriceAlertShopOption) {
	const parseFunctions: ParseFunctions = {
		[PriceAlertShopOption.HKTVMALL]: parseHktvmallPrice,
		[PriceAlertShopOption.AMAZON]: parseAmazonPrice,
		[PriceAlertShopOption.AEONCITY]: parseAeonPrice,
	};

	return parseFunctions[shop as keyof typeof PriceAlertShopOption] ?? null;
}

export function parsePriceToFloat(price: string) : number {
	return parseFloat(price.replace(/[$¥,]/g, ""));
}