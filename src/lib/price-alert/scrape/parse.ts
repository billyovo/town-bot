import { PriceAlertShopOption, PriceAlertShopParseDetails } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import type { ShopDetails, ShopParseFunctionReturn, ShopParseOptions } from "~/src/@types/price-alert";
import { getShopFromURL } from "../utils/getShopFromURL";
import { PriceAlertItem } from "../../database/schemas/product";
import { getHTML } from "../utils/scrapeGetters";


export async function parseShopWebsite(url: string, existingProduct : PriceAlertItem | null, options?: ShopParseOptions) : Promise<ShopParseFunctionReturn> {
	const shop : ShopDetails = getShopFromURL(url);

	shop.shop = shop.shop ?? existingProduct?.shop;

	if (!shop?.domain) {
		return {
			data: null,
			error: "No Shop Found in URL",
			success: false,
		};
	}

	const parseFunction = await getParseWebsiteFunction(shop);

	if (!parseFunction) {
		return {
			data: null,
			error: `Shop not supported: ${shop.domain ?? "UNKNOWN DOMAIN"}`,
			success: false,
		};
	}

	return await parseFunction(url, shop, options);
}

async function getMiscShop(shop: ShopDetails) : Promise<PriceAlertShopOption | null> {
	const html = await getHTML(shop.url);
	if (!html.success) return null;

	const root = html.data;
	const links = root.getElementsByTagName("link");

	const shopLinks = links.filter(link => link.getAttribute("href")?.includes("https://cdn.shoplineapp.com"));
	if (shopLinks.length === 0) return null;
	return PriceAlertShopOption.SHOPLINE;
}

export async function getParseWebsiteFunction(shop: ShopDetails) {
	if (!(shop?.shop in PriceAlertShopOption)) {
		const detectedShop : PriceAlertShopOption | null = await getMiscShop(shop);
		if (!detectedShop) return null;
		return PriceAlertShopParseDetails[detectedShop].parseFunction;
	}
	else {
		return PriceAlertShopParseDetails[shop.shop as PriceAlertShopOption].parseFunction;
	}
}
