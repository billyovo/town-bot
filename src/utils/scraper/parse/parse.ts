import { PriceAlertShopOption } from "~/enums/priceAlertShopOption";
import { parseHktvmallPrice } from "./websites/hktvmall";
import { parseAeonPrice } from "./websites/aeon";
import type { ShopParseFunction, ShopParseFunctionReturn, ShopParseOptions } from "~/types/priceAlert";
import { parseWatsonsGroupPrice } from "./websites/watsonsGroup";
import { parseSephoraPrice } from "./websites/sephora";
import { parseManningsPrice } from "./websites/mannings";
import { getShopFromURL } from "../url/getShopFromURL";
import { parseMujiPrice } from "./websites/muji";
import { parseWellcomePrice } from "./websites/wellcome";

type ParseFunctionsMap = {
    [key in PriceAlertShopOption]?: ShopParseFunction
};

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
	const parseFunctions: ParseFunctionsMap = {
		[PriceAlertShopOption.HKTVMALL]: parseHktvmallPrice,
		[PriceAlertShopOption.AEONCITY]: parseAeonPrice,
		[PriceAlertShopOption.WATSONS]: parseWatsonsGroupPrice,
		[PriceAlertShopOption.PNS]: parseWatsonsGroupPrice,
		[PriceAlertShopOption.SEPHORA]: parseSephoraPrice,
		[PriceAlertShopOption.MANNINGS]: parseManningsPrice,
		[PriceAlertShopOption.MUJI]: parseMujiPrice,
		[PriceAlertShopOption.WELLCOME]: parseWellcomePrice,
	};

	return parseFunctions[shop] ?? null;
}

export function parsePriceToFloat(price: string) : number {
	return parseFloat(price.replace(/[^0-9.]/g, ""));
}