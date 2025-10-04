import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "../../utils/enums/priceAlertShopOption";
import { getHTML } from "../../utils/scrapeGetters";
import { formatBrandName } from "../../utils/format";

export const parseStylevanaPrice : ShopParseFunction = async (url) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	const yotpoNode = root.querySelector(".yotpo, .bottomLine");
	if (!yotpoNode) return { success: false, error: "Product Information not found on the site!", data: null };

	const price = yotpoNode.getAttribute("data-price");
	const productImage = yotpoNode.getAttribute("data-image-url");
	const productCombinedName = yotpoNode.getAttribute("data-name");
	const productNameInfo = productCombinedName?.split("-")?.map(part => part.trim());
	const brand = productNameInfo?.[0];
	const productName = productNameInfo?.[2] ? productNameInfo.slice(1, 3).join(" ") : productNameInfo?.[1] ?? "";

	if (!brand || !productName || !price) return { success: false, error: "Product Information not found on the site!", data: null };

	return {
		success: true,
		error: null,
		data: {
			productName: productName,
			price: parseFloat(price),
			productImage: productImage || null,
			brand: formatBrandName(brand),
			shop: PriceAlertShopOption.STYLEVANA,
		},
	};
};