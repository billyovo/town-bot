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

	const price = root.querySelector(".price > span")?.innerText;
	const productBrandAndName = root.querySelector(".productBrandAndName")?.querySelectorAll("span");
	const img = root.querySelector("#prod_img_container")?.querySelector("img")?.getAttribute("src");
	const img_sanitized = img && (img.startsWith("http") ? img : `https:${img}`);

	if (!productBrandAndName) return { success: false, error: "Failed to parse product brand and name", data: null };

	const brand = productBrandAndName[0]?.innerText;
	const productName = productBrandAndName[1]?.innerText;

	if (!price || !brand || !productName) return { success: false, error: "Failed to parse price, brand or product name", data: null };
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