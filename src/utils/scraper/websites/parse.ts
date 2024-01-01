import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { parseHktvmallPrice } from "./hktvmall";
import { parseAeonPrice } from "./aeon";
import type { ShopParseFunctionReturn } from "../../../@types/priceAlert";
import { parseWatsonsGroupPrice } from "./watsonsGroup";
import { parseSephoraPrice } from "./sephora";


type ParseFunctionsMap = {
    [key in PriceAlertShopOption]?: (url: string) => Promise<ShopParseFunctionReturn>
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

export async function parseShopWebsite(url: string) : Promise<ShopParseFunctionReturn> {
	const shop = getShopFromURL(url);

	const parseFunction = getParseWebsiteFunction(shop.shop as PriceAlertShopOption);

	if (!parseFunction) {
		return {
			data: null,
			error: "Shop not supported",
			success: false,
		};
	}

	return await parseFunction(url);
}

export function getParseWebsiteFunction(shop: PriceAlertShopOption) {
	const parseFunctions: ParseFunctionsMap = {
		[PriceAlertShopOption.HKTVMALL]: parseHktvmallPrice,
		[PriceAlertShopOption.AEONCITY]: parseAeonPrice,
		[PriceAlertShopOption.WATSONS]: parseWatsonsGroupPrice,
		[PriceAlertShopOption.PNS]: parseWatsonsGroupPrice,
		[PriceAlertShopOption.SEPHORA]: parseSephoraPrice,
	};

	return parseFunctions[shop as keyof typeof PriceAlertShopOption] ?? null;
}

export function parsePriceToFloat(price: string) : number {
	return parseFloat(price.replace(/[^0-9.]/g, ""));
}