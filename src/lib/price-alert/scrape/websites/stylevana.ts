import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "../../utils/enums/priceAlertShopOption";
import { getHTML } from "../../utils/scrapeGetters";
import { formatBrandName } from "../../utils/format";

export const parseStylevanaPrice: ShopParseFunction = async (url) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	const yotpoNode = root.querySelector(".yotpo, .bottomLine");
	if (!yotpoNode) return { success: false, error: "Product Information not found on the site!", data: null };

	const scrapedPrice = yotpoNode.getAttribute("data-price");
	const price = scrapedPrice ? parseFloat(scrapedPrice) : NaN;
	const productImage = yotpoNode.getAttribute("data-image-url");
	const productCombinedName = yotpoNode.getAttribute("data-name");

	const separatorIndex = productCombinedName?.indexOf(" - ") ?? -1;
	const brand = separatorIndex === -1 ? undefined : productCombinedName?.slice(0, separatorIndex).trim();
	const productName =
		separatorIndex === -1
			? (productCombinedName?.trim() ?? "")
			: (productCombinedName
					?.slice(separatorIndex + 3)
					.replace(/\s+-\s+/g, " ")
					.trim() ?? "");

	if (!brand || !productName || !Number.isFinite(price))
		return { success: false, error: "Product Information not found on the site!", data: null };

	return {
		success: true,
		error: null,
		data: {
			productName: productName,
			price: price,
			productImage: productImage || null,
			brand: formatBrandName(brand),
			shop: PriceAlertShopOption.STYLEVANA,
		},
	};
};
