import { HTMLElement, parse } from "node-html-parser";
import { axiosClient } from "../client";
import { ShopParseFunction } from "../../../@types/priceAlert";
import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { parsePriceToFloat } from "./parse";
import { AttachmentBuilder } from "discord.js";
import { logger } from "../../../logger/logger";

export const parseWatsonsPrice : ShopParseFunction = async (url) => {
	const html = await axiosClient.get(url).catch(() => {
		logger(`Failed to fetch ${url}`);
		return null;
	});
	if (!html) return null;
	const root = parse(html.data);

	const productName = root.querySelector(".product-name")?.text;
	const brand = root.querySelector(".product-brand")?.firstChild?.text;
	const price = getWatsonsPrice(root);
	const productImage = root.querySelector(".largePhoto")?.querySelector("img")?.getAttribute("src");
	let productAttachment : AttachmentBuilder | null = null;

	// fetch image from src
	if (productImage) {
		const image = await axiosClient.get(productImage, { responseType: "arraybuffer" });
		productAttachment = new AttachmentBuilder(image.data, { name: "productImage.png" });
	}

	if (!price || !productName) return null;

	return {
		price: price,
		productName: productName,
		productImage: "",
		brand: brand ?? "",
		shop: PriceAlertShopOption.WATSONS,
		attachment: productAttachment,
	};
};

function getWatsonsPrice(root : HTMLElement) : number {
	let price = Infinity;
	const discountsOption = root.querySelector(".option-group")?.querySelectorAll(".option");

	for (const option of discountsOption || []) {
		const quantity = option.querySelector(".quantity > span")?.innerHTML ?? "";
		const quantityNumber = parseInt(quantity.replace(/[^0-9]/g, ""));

		if (!quantityNumber) continue;

		const priceText = option.querySelector(".price > span")?.nextSibling?.innerText ?? "";
		const priceNumber = parsePriceToFloat(priceText);
		if (!priceNumber) continue;

		const pricePerUnit = priceNumber / quantityNumber;
		price = Math.min(price, pricePerUnit);
	}

	const normalPrice = root.querySelector(".display-price-group")?.querySelector("span.price")?.innerHTML ?? "";
	const normalPriceNumber = parsePriceToFloat(normalPrice);

	price = Math.min(price, normalPriceNumber);
	return price;
}