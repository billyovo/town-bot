import { ShopParseFunctionReturn } from "../../../@types/priceAlert";
import { axiosClient } from "../client";
import { parse } from "node-html-parser";
import { parsePriceToFloat } from "./parse";
import { PriceAlertShopOption } from "@enums/priceAlertShopOption";

export async function parseAeonPrice(url : string) : ShopParseFunctionReturn {
	const html = await axiosClient.get(url);
	const root = parse(html.data);

	// try to get member price first, m_price
	// if no, try to get normal price, price
	const price = root.querySelector(".m_price")?.text || Array.from(root.querySelectorAll(".price"))?.pop()?.text;

	const productName = root.querySelector(".base")?.text;
	const productImage = root.querySelector(".product")?.querySelector("img")?.getAttribute("src");
	console.log(root.querySelector(".product")?.querySelector("img"));
	if (!price || !productName) return null;

	return {
		price: parsePriceToFloat(price),
		productName: productName,
		productImage: productImage ?? "",
		brand: PriceAlertShopOption.AEONCITY,
		shop: PriceAlertShopOption.AEONCITY,
	};
}