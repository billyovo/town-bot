import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { parsePriceToFloat } from "~/src/lib/price-alert/utils/format";
import { getHTML } from "../../utils/scrapeGetters";

export const parseHktvmallPrice : ShopParseFunction = async (url : string, _) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	const data = root.querySelector("[data-price]");

	const price = data?.getAttribute("data-price");
	const productName = data?.getAttribute("data-productname");
	const brand = data?.getAttribute("data-productbrand");

	if (!price) return { success: false, error: "Failed to parse price", data: null };
	if (!productName) return { success: false, error: "Failed to parse product name", data: null };
	if (!brand) return { success: false, error: "Failed to parse brand", data: null };

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