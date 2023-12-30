import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { ShopParseFunction } from "../../../@types/priceAlert";
import { axiosClient } from "../client";
import { parsePriceToFloat } from "./parse";

export const parseSephoraPrice : ShopParseFunction = async (url) => {
	const regex = /\/products\/(.*)/g;
	const regexResult = regex.exec(url);
	const slug : string = regexResult ? regexResult[1] : "";
	const slugArray = slug.split("/");

	const nameSlug = slugArray[0];
	const typeSlug = slugArray[2];

	if (!slug) return null;
	const api = `https://www.sephora.hk/api/v2.1/products/${nameSlug}?v=${typeSlug}`;
	let productData;
	try {
		const response = await axiosClient.get(api, {
			headers: {
				"Accept-Language": "zh-HK",
			},
		});
		productData = response.data;
	}
	catch (e) {
		return null;
	}

	const productName = `${productData.data.attributes.name} ${productData.data.attributes.heading ?? ""}`.trim();
	const productPrice = productData.data.attributes["display-price"];
	const productImage = productData.data.attributes["image-urls"] ? productData.data.attributes["image-urls"][0] : null;
	const brand = productData.data.attributes["brand-name"];

	if (!productPrice || !productName) return null;

	return {
		productName: productName,
		price: parsePriceToFloat(productPrice),
		productImage: productImage,
		brand: brand,
		shop: PriceAlertShopOption.SEPHORA,
	};
};