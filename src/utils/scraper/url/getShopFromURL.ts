import { PriceAlertShopOption } from "~/enums/priceAlertShopOption";
import { ShopDetails } from "~/types/priceAlert";
import tldts from "tldts";

export function getShopFromURL(url: string) : ShopDetails {
	const parsedURL = tldts.parse(url);
	const domain = parsedURL.domainWithoutSuffix?.toUpperCase();
	return {
		domain: domain ?? parsedURL.hostname ?? "UNKNOWN DOMAIN",
		shop: PriceAlertShopOption[domain as keyof typeof PriceAlertShopOption],
	};

}
