import { parse } from "node-html-parser";
import { ShopParseFunction } from "~/types/priceAlert";
import { logger } from "~/logger/logger";
import { HTMLClient } from "../../client";
import { PriceAlertShopOption } from "~/enums/priceAlertShopOption";
import { parsePriceToFloat } from "../parse";


export const parseManningsPrice : ShopParseFunction = async (url, _) => {
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

	// DO YOU HAVE YUU?
	// const YUUofferpriceTxt = root.querySelector('.promotion_description_holder')?.rawText;
	// const YUUofferpriceMatch = YUUofferpriceTxt?.match(/\$(\d+(\.\d+)?)/);
	// const YUUofferprice = YUUofferpriceMatch ? YUUofferpriceMatch[1] : null;

	const price = root.querySelector("input[name=\"discPrice\"]")?.getAttribute("value") || root.querySelector("input[name=\"productPostPrice\"]")?.getAttribute("value");

	const productName = root.querySelector("input[name=\"productNamePost\"]")?.getAttribute("value");

	const productImage = root.querySelector("input[name=\"productImg\"]")?.getAttribute("value");

	const brand = root.querySelector("input[name=\"brand\"]")?.getAttribute("value");

	if (!price || !productName) return { success: false, error: "Failed to parse price or product name", data: null };


	return {
		data: {
			price: parsePriceToFloat(price),
			productName: productName,
			productImage: productImage ?? "",
			brand: brand ?? "",
			shop: PriceAlertShopOption.MANNINGS,
		},
		error: null,
		success: true,
	};

};