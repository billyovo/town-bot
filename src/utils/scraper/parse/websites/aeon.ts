import { ShopParseFunction } from "../../../../@types/priceAlert";
import { HTMLClient } from "../../client";
import { parse } from "node-html-parser";
import { parsePriceToFloat } from "../parse";
import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { logger } from "../../../../logger/logger";

export const parseAeonPrice : ShopParseFunction = async (url) => {
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

	// try to get member price first, m_price
	// if no, try to get normal price, price
	const price = root.querySelector(".m_price")?.text || Array.from(root.querySelectorAll(".price"))?.pop()?.text;

	const productName = root.querySelector(".base")?.text;
	const productImage = root.querySelector(".product")?.querySelector("img")?.getAttribute("src");
	if (!price || !productName) return { success: false, error: "Failed to parse price or product name", data: null };

	return {
		data: {
			price: parsePriceToFloat(price),
			productName: productName,
			productImage: productImage ?? "",
			brand: PriceAlertShopOption.AEONCITY,
			shop: PriceAlertShopOption.AEONCITY,
		},
		error: null,
		success: true,
	};
};