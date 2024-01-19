import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { parseHktvmallPrice } from "./websites/hktvmall";
import { parseAeonPrice } from "./websites/aeon";
import type { ShopDetails, ShopParseFunctionReturn, ShopParseOptions } from "../../../@types/priceAlert";
import { parseWatsonsGroupPrice } from "./websites/watsonsGroup";
import { parseSephoraPrice } from "./websites/sephora";
import { parseManningsPrice } from "./websites/mannings";


type ParseFunctionsMap = {
    [key in PriceAlertShopOption]?: (url: string, options?: ShopParseOptions) => Promise<ShopParseFunctionReturn>
};

export function getShopFromURL(url: string) : ShopDetails {
	const urlObj = new URL(url);
	const domain: string = urlObj.hostname.split(".")[1].toUpperCase();
	const shop = PriceAlertShopOption[domain as keyof typeof PriceAlertShopOption];

	return {
		shop: shop,
		domain: domain,
	};
}

export async function parseShopWebsite(url: string, options?: ShopParseOptions) : Promise<ShopParseFunctionReturn> {
	const shop = getShopFromURL(url);

	const parseFunction = getParseWebsiteFunction(shop.shop as PriceAlertShopOption);

	if (!parseFunction) {
		return {
			data: null,
			error: "Shop not supported",
			success: false,
		};
	}

	return await parseFunction(url, options);
}

export function getParseWebsiteFunction(shop: PriceAlertShopOption) {
	const parseFunctions: ParseFunctionsMap = {
		[PriceAlertShopOption.HKTVMALL]: parseHktvmallPrice,
		[PriceAlertShopOption.AEONCITY]: parseAeonPrice,
		[PriceAlertShopOption.WATSONS]: parseWatsonsGroupPrice,
		[PriceAlertShopOption.PNS]: parseWatsonsGroupPrice,
		[PriceAlertShopOption.SEPHORA]: parseSephoraPrice,
		[PriceAlertShopOption.MANNINGS]: parseManningsPrice,
	};

	return parseFunctions[shop as keyof typeof PriceAlertShopOption] ?? null;
}

export function parsePriceToFloat(price: string) : number {
	return parseFloat(price.replace(/[^0-9.]/g, ""));
}