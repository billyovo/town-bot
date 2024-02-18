import { logger } from "~/logger/logger";
import { HTMLClient } from "../../client";
import parse from "node-html-parser";
import { ShopParseFunction } from "~/types/priceAlert";
import { PriceAlertShopOption } from "~/enums/priceAlertShopOption";

export const parseWellcomePrice : ShopParseFunction = async (url, _) => {
	const html = await HTMLClient.get(url).catch(() => {
		logger(`Failed to fetch ${url}`);
		return { data: null, success: false, error: "Failed to fetch url" };
	});

	let root;

	try {
		root = parse(html.data);
	}
	catch (e) {
		return { success: false, error: "Failed to parse html", data: null };
	}

	const productInformation = JSON.parse(root.querySelector("script[type=\"application/ld+json\"]")?.rawText ?? "{}");
	if (!productInformation) return { success: false, error: "Failed to parse product information", data: null };

	return {
		success: true,
		error: null,
		data: {
			productName: productInformation.name,
			price: productInformation.offers.price,
			productImage: productInformation.image,
			brand: productInformation.brand.name,
			shop: PriceAlertShopOption.WELLCOME,
		},
	};
};