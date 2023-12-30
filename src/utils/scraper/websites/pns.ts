import parse from "node-html-parser";
import { ShopParseFunction } from "../../../@types/priceAlert";
import { logger } from "../../../logger/logger";
import { axiosClient } from "../client";
import { AttachmentBuilder } from "discord.js";
import { parsePriceToFloat } from "./parse";
import { PriceAlertShopOption } from "@enums/priceAlertShopOption";

export const parsePNSPrice : ShopParseFunction = async (url) => {
	const html = await axiosClient.get(url).catch(() => {
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

	// buy X get Y offer price
	// then normal price
	const price = root.querySelector(".offer-price")?.text ?? root.querySelector(".currentPrice")?.text;
	const productName = root.querySelector(".product-name")?.text;
	const brand = root.querySelector(".product-brand")?.firstChild?.text?.trim();
	const productImage = root.querySelector(".largePhoto")?.querySelector("img")?.getAttribute("src");
	let productAttachment : AttachmentBuilder | null = null;

	// fetch image from src
	if (productImage) {
		const image = await axiosClient.get(productImage, { responseType: "arraybuffer" });
		productAttachment = new AttachmentBuilder(image.data, { name: "productImage.png" });
	}

	if (!price || !productName) return { success: false, error: "Failed to parse price or product name", data: null };

	return {
		data: {
			price: parsePriceToFloat(price),
			productName: productName,
			productImage: "",
			brand: brand ?? "",
			shop: PriceAlertShopOption.PNS,
			attachment: productAttachment,
		},
		error: null,
		success: true,
	};
};