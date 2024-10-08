import { ShopParseFunction } from "~/src/@types/price-alert";
import { formatBrandName, parsePriceToFloat } from "~/src/lib/price-alert/utils/format";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { getHTML } from "../../utils/scrapeGetters";

export const parseAeonPrice : ShopParseFunction = async (url, _) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	// try to get member price first, m_price
	// if no, try to get normal price, price
	const price = root.querySelector(".m_price")?.text || Array.from(root.querySelectorAll(".price"))?.pop()?.text;

	const productName = root.querySelector(".base")?.text;
	const productImage = root.querySelector(".product")?.querySelector("img")?.getAttribute("src");
	if (!price) return { success: false, error: "Failed to parse price", data: null };
	if (!productName) return { success: false, error: "Failed to parse product name", data: null };

	return {
		data: {
			price: parsePriceToFloat(price),
			productName: productName,
			productImage: productImage ?? "",
			brand: formatBrandName(PriceAlertShopOption.AEONCITY),
			shop: PriceAlertShopOption.AEONCITY,
		},
		error: null,
		success: true,
	};
};