import { log } from "~/src/lib/logger/logger";
import { HTMLClient } from "~/src/lib/utils/fetch/client";
import parse from "node-html-parser";
import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { parsePriceToFloat } from "~/src/lib/price-alert/utils/format";

export const parseLookfantasticPrice : ShopParseFunction = async (url, _) => {
	const html = await HTMLClient.get(url).catch(() => {
		log(`Failed to fetch ${url}`);
		return { data: null, success: false, error: "Failed to fetch url" };
	});

	let root;

	try {
		root = parse(html.data);
	}
	catch (e) {
		return { success: false, error: "Failed to parse html", data: null };
	}

	const productInformationString = root.querySelector("script[type=\"application/ld+json\"]")?.text;
	if (!productInformationString) return { success: false, error: "Failed to parse product information", data: null };

	const productInformation = JSON.parse(productInformationString);
	if (!productInformation?.offers?.[0]?.price) return { success: false, error: "Failed to parse product price", data: null };
	if (!productInformation?.name) return { success: false, error: "Failed to parse product name", data: null };
	if (!productInformation?.image) return { success: false, error: "Failed to parse product image", data: null };

	return {
		success: true,
		error: null,
		data: {
			productName: productInformation.name,
			price: parsePriceToFloat(productInformation.offers[0].price),
			productImage: productInformation.image,
			brand: productInformation.brand.name,
			shop: PriceAlertShopOption.LOOKFANTASTIC,
		},
	};
};