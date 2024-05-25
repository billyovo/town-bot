import { parse } from "node-html-parser";
import { ShopParseFunction } from "~/src/@types/price-alert";
import { log } from "~/src/lib/logger/logger";
import { HTMLClient } from "~/src/lib/utils/fetch/client";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { parsePriceToFloat } from "~/src/lib/price-alert/utils/format";


export const parseManningsPrice : ShopParseFunction = async (url, _) => {
	const html = await HTMLClient.get(url).catch(() => {
		log(`Failed to fetch ${url}`);
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

	if (!price) return { success: false, error: "Failed to parse price", data: null };
	if (!productName) return { success: false, error: "Failed to parse product name", data: null };


	return {
		data: {
			price: parsePriceToFloat(price),
			productName: productName,
			productImage: productImage ?? "",
			brand: brand ?? "No Brand",
			shop: PriceAlertShopOption.MANNINGS,
		},
		error: null,
		success: true,
	};

};