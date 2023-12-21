import { parse } from "node-html-parser";
import { axiosClient } from "../client";
import { ShopParseFunctionReturn } from "../../../@types/priceAlert";
import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { parsePriceToFloat } from "./parse";

export async function parseHktvmallPrice(url : string) : ShopParseFunctionReturn {
	const html = await axiosClient.get(url);
	const root = parse(html.data);

	const price = root.querySelector(".price > span")?.innerText;
	const productBrandAndName = root.querySelector(".productBrandAndName")?.querySelectorAll("span");
	const img = root.querySelector("#prod_img_container")?.querySelector("img")?.getAttribute("src");
	const img_sanitized = img && (img.startsWith("http") ? img : `https:${img}`);

	if (!productBrandAndName) return null;

	const brand = productBrandAndName[0]?.innerText;
	const productName = productBrandAndName[1]?.innerText;

	if (!price || !brand || !productName) return null;
	return {
		price: parsePriceToFloat(price),
		productName: productName,
		brand: brand,
		productImage: img_sanitized ?? "",
		shop: PriceAlertShopOption.HKTVMALL,
	};
}