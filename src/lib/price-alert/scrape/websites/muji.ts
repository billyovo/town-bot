import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "../../utils/enums/priceAlertShopOption";
import { getHTML, getLDScript } from "../../utils/scrapeGetters";

export const parseMujiPrice : ShopParseFunction = async (url, _) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	const productInformation = await getLDScript(root);
	if (!productInformation) return { success: false, error: "Failed to parse product information", data: null };

	if (!productInformation?.offers?.price) return { success: false, error: "Failed to parse product price", data: null };
	if (!productInformation?.name) return { success: false, error: "Failed to parse product name", data: null };
	if (!productInformation?.image) return { success: false, error: "Failed to parse product image", data: null };


	return {
		success: true,
		error: null,
		data: {
			productName: productInformation.name,
			price: productInformation.offers.price,
			productImage: productInformation.image[0],
			brand: PriceAlertShopOption.MUJI,
			shop: PriceAlertShopOption.MUJI,
		},
	};
};