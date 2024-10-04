import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { getHTML, getLDScript } from "../../utils/scrapeGetters";
import { PromotionType } from "~/src/@types/enum/price-alert";
import { formatBrandName } from "../../utils/format";
import { classifyPromotionByKeywords } from "../../utils/classifyPromotions";

export const parseWellcomePrice : ShopParseFunction = async (url, _, __) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	const productInformation = await getLDScript(root);
	if (!productInformation) return { success: false, error: "Failed to parse product information", data: null };

	if (!productInformation?.offers?.price) return { success: false, error: "Failed to parse product price", data: null };
	if (!productInformation?.name) return { success: false, error: "Failed to parse product name", data: null };
	if (!productInformation?.image) return { success: false, error: "Failed to parse product image", data: null };
	if (!productInformation?.brand?.name) return { success: false, error: "Failed to parse product brand", data: null };

	const promotions = root.querySelectorAll(".info-content > .info").map((promotion) => {
		return promotion.text.trim();
	});

	const classifiedPromotions = classifyPromotions(promotions);

	return {
		success: true,
		error: null,
		data: {
			productName: productInformation.name,
			price: productInformation.offers.price,
			productImage: productInformation.image,
			brand: formatBrandName(productInformation.brand.name),
			shop: PriceAlertShopOption.WELLCOME,
			promotions: classifiedPromotions,
		},
	};
};

function classifyPromotions(promotions: string[]) {
	const classified = promotions.map((promotion) => {
		const type : PromotionType = classifyPromotionByKeywords(promotion);
		return { type, description: promotion };
	});

	return classified;
}