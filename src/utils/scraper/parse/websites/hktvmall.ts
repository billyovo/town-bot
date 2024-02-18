import { parse } from "node-html-parser";
import { HTMLClient } from "../../client";
import { ShopParseFunction } from "~/types/priceAlert";
import { PriceAlertShopOption } from "~/enums/priceAlertShopOption";
import { parsePriceToFloat } from "../parse";
import { logger } from "~/logger/logger";

export const parseHktvmallPrice : ShopParseFunction = async (url : string, _) => {
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

	const data = root.querySelector("[data-price]");

	const price = data?.getAttribute("data-price");
	const productName = data?.getAttribute("data-productname");
	const brand = data?.getAttribute("data-productbrand");

	if (!price || !productName || !brand) {
		return {
			data: null,
			error: "Failed to parse product information",
			success: false,
		};
	}

	const img = root.querySelector("#prod_img_container")?.querySelector("img")?.getAttribute("src");
	const img_sanitized = img && (img.startsWith("http") ? img : `https:${img}`);


	return {
		data: {
			price: parsePriceToFloat(price),
			productName: productName,
			brand: brand,
			productImage: img_sanitized ?? "",
			shop: PriceAlertShopOption.HKTVMALL,
		},
		error: null,
		success: true,
	};
};