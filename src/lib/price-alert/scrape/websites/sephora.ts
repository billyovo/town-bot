import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { ShopParseFunction } from "~/src/@types/price-alert";
import { APIClient } from "~/src/lib/utils/fetch/client";
import { formatBrandName, parsePriceToFloat } from "~/src/lib/price-alert/utils/format";

export const parseSephoraPrice : ShopParseFunction = async (url, shopDetails) => {
	if (shopDetails.domainLong !== "sephora.hk") {
		return {
			success: false,
			error: "Only sephora.hk supported!",
			data: null,
		};

	}
	const regex = /\/products\/(.*)/g;
	const regexResult = regex.exec(url);
	const slug : string = regexResult ? regexResult[1] : "";
	const slugArray = slug.split("/");

	const nameSlug = slugArray[0];
	const typeSlug = slugArray[2];

	if (!slug) {
		return {
			success: false,
			error: "Invalid URL",
			data: null,
		};
	}
	const api = `https://www.sephora.hk/api/v2.1/products/${nameSlug}?v=${typeSlug}`;
	let productData;
	try {
		const response = await APIClient.get(api, {
			headers: {
				"Accept-Language": "zh-HK",
			},
		});
		productData = response.data;
	}
	catch (e) {
		return { success: false, error: "Failed to fetch", data: null };
	}

	const productName = `${productData.data.attributes.name} ${productData.data.attributes.heading ?? ""}`.trim();
	const productPrice = productData.data.attributes["display-price"];
	const productImage = productData.data.attributes["image-urls"] ? productData.data.attributes["image-urls"][0] : null;
	const brand = productData.data.attributes["brand-name"];

	if (!productPrice || !productName) return { success: false, error: "Failed to parse price or product name", data: null };

	return {
		data: {
			productName: productName,
			price: parsePriceToFloat(productPrice),
			productImage: productImage,
			brand: formatBrandName(brand),
			shop: PriceAlertShopOption.SEPHORA,
		},
		error: null,
		success: true,
	};
};