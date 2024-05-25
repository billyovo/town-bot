import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { parsePriceToFloat } from "~/src/lib/price-alert/utils/format";
import { getHTML, getLDScript } from "../../utils/scrapeGetters";

export const parseLookfantasticPrice : ShopParseFunction = async (url, _) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	const productInformation = await getLDScript(root);
	if (!productInformation) return { success: false, error: "Failed to parse product information", data: null };

	if (!productInformation?.offers?.[0]?.price) return { success: false, error: "Failed to parse product price", data: null };
	if (!productInformation?.name) return { success: false, error: "Failed to parse product name", data: null };
	if (!productInformation?.image) return { success: false, error: "Failed to parse product image", data: null };

	return {
		success: true,
		error: null,
		data: {
			productName: productInformation.name,
			price: parsePriceToFloat(productInformation.offers[0].price),
			productImage: productInformation.image,
			brand: productInformation.brand.name,
			shop: PriceAlertShopOption.LOOKFANTASTIC,
		},
	};
};