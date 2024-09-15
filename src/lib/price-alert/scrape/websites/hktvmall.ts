import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { getHTML } from "../../utils/scrapeGetters";
import { parsePriceToFloat } from "../../utils/format";
import { logger } from "~/src/lib/logger/logger";
import { HTMLElement } from "node-html-parser";
import { LogisticRegressionClassifier } from "natural";
import { PromotionType } from "~/src/@types/enum/price-alert";

type HKTVMALLProductData = {
	currencyIso: string,
	value: number,
	priceType: string,
	formattedValue: string,
	membershipLevel: string
}

export const parseHktvmallPrice : ShopParseFunction = async (url : string, _, options) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	const allScripts = root.querySelectorAll("script");
	const productDataScript = getProductScriptFromScripts(allScripts);
	if (!productDataScript) return { success: false, error: "Product data not found", data: null };

	const parsedProductData = getProductDataFromScript(productDataScript);

	if (!parsedProductData) return { success: false, error: "Product data parsing failed", data: null };


	const price = parsedProductData?.priceList?.reduce((acc : number, curr: HKTVMALLProductData) => {
		const currentValue = parsePriceToFloat(curr.formattedValue);
		if (acc < currentValue) return acc;
		return currentValue;
	}, Infinity) ?? null;

	const availablePromotion = parsedProductData?.thresholdPromotionList ?? (parsedProductData?.thresholdPromotion ? [parsedProductData.thresholdPromotion] : null);

	const classifier : LogisticRegressionClassifier | null | undefined = options?.classifier;
	const parsedPromotions = availablePromotion ? availablePromotion.map((promotion: { description: string; startTime: string; endTime: string; name: string; }) => {
		const promotionDescription : string = promotion?.description ?? promotion?.name;
		const promotionType : PromotionType = classifier?.classify(promotionDescription) as PromotionType;
		const startTime : Date | null = promotion?.startTime ? new Date(parseInt(promotion.startTime)) : null;
		const endTime : Date | null = promotion?.endTime ? new Date(parseInt(promotion.endTime)) : null;

		return {
			type: promotionType,
			description: promotionDescription,
			startTime: startTime,
			endTime: endTime,
		};
	}) : [];

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
			brand: brand,
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
		if (script.textContent.includes("var productDetailPageProductData =")) {
			return script.text;
		}
	}

	return null;
}
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

		assume it's always an valid json object
		use the classic stack method to find the start and end of the object, meet "{" stack++, meet "}" stack--, loop until stack = 0
	*/
	const productDataIndex = script.indexOf("var productData =") + "var productData =".length;

	let start : number = 0;
	let stack : number = 1;

	while (script[productDataIndex + start - 1] !== "{") {
		start++;
	}

	let receivedData = "{";

	// don't use falsey here, empty string is falsey
	while ((stack > 0) && script[productDataIndex + start] !== undefined) {
		const char = script[productDataIndex + start];
		if (char === "{") stack++;
		if (char === "}") stack--;
		receivedData += char;
		start++;
	}

	// fix the wrong escaped backslashes
	receivedData = receivedData.replace(/\\(?!\/|u)/g, "");
	try {
		return JSON.parse(receivedData);
	}
	catch (error) {
		logger.error((error as Error).message);
		return null;
	}
}