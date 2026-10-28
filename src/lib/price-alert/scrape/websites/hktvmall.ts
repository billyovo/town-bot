import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { getHTML } from "../../utils/scrapeGetters";
import { formatBrandName, parsePriceToFloat } from "../../utils/format";
import { logger } from "~/src/lib/logger/logger";
import { HTMLElement } from "node-html-parser";
import { PromotionType } from "~/src/@types/enum/price-alert";
import { classifyPromotionByKeywords } from "../../utils/classifyPromotions";

type HKTVMALLProductData = {
	currencyIso: string;
	value: string;
	priceType: string;
	formattedValue: string;
	membershipLevel: string;
};

export const parseHktvmallPrice: ShopParseFunction = async (url: string) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	const allScripts = root.querySelectorAll("script");
	if (!allScripts || allScripts.length === 0) {
		logger.error(root.toString());
		return { success: false, error: "No script tags found", data: null };
	}
	const productDataScript = getProductScriptFromScripts(allScripts);
	if (!productDataScript) return { success: false, error: "Product data not found", data: null };

	const parsedProductData = getProductDataFromScript(productDataScript);

	if (!parsedProductData) return { success: false, error: "Product data parsing failed", data: null };

	const priceList: HKTVMALLProductData[] = parsedProductData?.priceList ?? [];
	const normalPrices = priceList.filter((item) => !item.membershipLevel || item.membershipLevel === "NORMAL");
	const prices = (normalPrices.length > 0 ? normalPrices : priceList)
		.map((item) => parseFloat(item.value ?? "") || parsePriceToFloat(item.formattedValue ?? ""))
		.filter((value) => Number.isFinite(value) && value > 0);
	const price = prices.length > 0 ? Math.min(...prices) : null;

	const availablePromotion =
		parsedProductData?.thresholdPromotionList ??
		(parsedProductData?.thresholdPromotion ? [parsedProductData.thresholdPromotion] : null);

	const parsedPromotions = availablePromotion
		? availablePromotion.map(
				(promotion: { label: string; description: string; startTime: string; endTime: string; name: string }) => {
					const promotionDescription: string =
						promotion?.description ?? `${promotion?.label ?? ""} | ${promotion?.name ?? ""}`;
					const promotionType: PromotionType = classifyPromotionByKeywords(promotionDescription);
					const startTime: Date | null = promotion?.startTime ? new Date(parseInt(promotion.startTime)) : null;
					const endTime: Date | null = promotion?.endTime ? new Date(parseInt(promotion.endTime)) : null;

					return {
						type: promotionType,
						description: promotionDescription,
						startTime: startTime,
						endTime: endTime,
					};
				},
			)
		: [];

	const productName = parsedProductData?.name;
	const brand = parsedProductData?.brandName;

	const image = parsedProductData?.images?.[0]?.url;
	const img_sanitized = image && (image.startsWith("http") ? image : `https:${image}`);

	if (!price) return { success: false, error: "Price not found", data: null };
	if (!productName) return { success: false, error: "Product name not found", data: null };
	if (!brand) return { success: false, error: "Brand not found", data: null };

	return {
		data: {
			price: price,
			productName: productName,
			brand: formatBrandName(brand),
			productImage: img_sanitized ?? "",
			shop: PriceAlertShopOption.HKTVMALL,
			promotions: parsedPromotions,
		},
		error: null,
		success: true,
	};
};

function getProductScriptFromScripts(allScripts: HTMLElement[]) {
	for (let i = 0; i < allScripts.length; i++) {
		const script = allScripts[i];
		if (script.textContent.includes(PRODUCT_DATA_MARKER)) {
			return script.text;
		}
	}

	return null;
}
const PRODUCT_DATA_MARKER = "var productDetailPageProductData =";

function getProductDataFromScript(script: string) {
	/*
	   say we have a <script> tag with variables like
	   var ...
	   var productDetailPageProductData = {
	   ...
	   ...
	   }
	   var ...

	   we only know which line the productDetailPageProductData is in, and the data could have nested objects and spam multiple lines
	   we need to find the start and end of the object, and extract it

		use the classic stack method to find the start and end of the object, meet "{" stack++, meet "}" stack--, loop until stack = 0
		braces inside strings are skipped
	*/
	const markerIndex = script.indexOf(PRODUCT_DATA_MARKER);
	if (markerIndex === -1) return null;

	const start = script.indexOf("{", markerIndex + PRODUCT_DATA_MARKER.length);
	if (start === -1) return null;

	let stack = 0;
	let inString = false;
	let end = -1;
	for (let i = start; i < script.length; i++) {
		const char = script[i];
		if (inString) {
			if (char === "\\") i++;
			else if (char === '"') inString = false;
			continue;
		}
		if (char === '"') inString = true;
		else if (char === "{") stack++;
		else if (char === "}") {
			stack--;
			if (stack === 0) {
				end = i;
				break;
			}
		}
	}
	if (end === -1) return null;

	const receivedData = script.slice(start, end + 1);
	try {
		return JSON.parse(receivedData);
	} catch {
		try {
			return JSON.parse(receivedData.replace(/\\(?!\/|u)/g, ""));
		} catch (error) {
			logger.error((error as Error).message);
			return null;
		}
	}
}
