import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { getHTML, getLDScript } from "../../utils/scrapeGetters";
import { LogisticRegressionClassifier } from "natural";
import { PromotionType } from "~/src/@types/enum/price-alert";

export const parseWellcomePrice : ShopParseFunction = async (url, _, options) => {
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
	const classifier = options?.classifier;
	const classifiedPromotions = classifyPromotions(promotions, classifier);

	return {
		success: true,
		error: null,
		data: {
			productName: productInformation.name,
			price: productInformation.offers.price,
			productImage: productInformation.image,
			brand: productInformation.brand.name,
			shop: PriceAlertShopOption.WELLCOME,
			promotions: classifiedPromotions,
		},
	};
};

function classifyPromotions(promotions: string[], classifier: LogisticRegressionClassifier | null | undefined) {
	if (!classifier) return null;
	const classified = promotions.map((promotion) => {
		const type = classifier.classify(promotion) as PromotionType;
		return { type, description: promotion };
	});

	return classified;
}