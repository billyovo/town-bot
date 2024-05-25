import { PriceAlertShopOption } from "./enums/priceAlertShopOption";
import { ShopDetails } from "~/src/@types/price-alert";
import tldts from "tldts";

export function getShopFromURL(url: string) : ShopDetails {
	const parsedURL = tldts.parse(url);
	const domain = parsedURL.domainWithoutSuffix?.toUpperCase();
	return {
		domain: domain ?? null,
		domainLong: parsedURL.domain,
		shop: PriceAlertShopOption[domain as keyof typeof PriceAlertShopOption],
		hostname: parsedURL.hostname ?? "UNKNOWN HOSTNAME",
	};

}
