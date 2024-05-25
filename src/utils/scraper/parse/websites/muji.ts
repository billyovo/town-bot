import { logger } from "~/logger/logger";
import { HTMLClient } from "../../client";
import parse from "node-html-parser";
import { ShopParseFunction } from "~/types/priceAlert";
import { PriceAlertShopOption } from "~/enums/priceAlertShopOption";

export const parseMujiPrice : ShopParseFunction = async (url, _) => {
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

	const productInformationString = root.querySelector("script[type=\"application/ld+json\"]")?.text;
	if (!productInformationString) return { success: false, error: "Failed to parse product information", data: null };

	const productInformation = JSON.parse(productInformationString);

	if (!productInformation?.offers?.price) return { success: false, error: "Failed to parse product price", data: null };
	if (!productInformation?.name) return { success: false, error: "Failed to parse product name", data: null };
	if (!productInformation?.image) return { success: false, error: "Failed to parse product image", data: null };


	return {
		success: true,
		error: null,
		data: {
			productName: productInformation.name,
			price: productInformation.offers.price,
			productImage: productInformation.image[0],
			brand: PriceAlertShopOption.MUJI,
			shop: PriceAlertShopOption.MUJI,
		},
	};
};