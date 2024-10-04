import { ShopParseFunction } from "~/src/@types/price-alert";
import { PromotionType } from "~/src/@types/enum/price-alert";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { formatBrandName, parsePriceToFloat } from "~/src/lib/price-alert/utils/format";
import { getHTML } from "../../utils/scrapeGetters";
import { logger } from "~/src/lib/logger/logger";
import { HTMLElement } from "node-html-parser";
import { classifyPromotionByKeywords } from "../../utils/classifyPromotions";

export const parseManningsPrice: ShopParseFunction = async (url, _, __) => {
	const html = await getHTML(url);
	if (!html.success) return { success: false, error: html.error, data: null };

	const root = html.data;

	const allScripts : HTMLElement[] | null = root.querySelectorAll("script[type=\"text/javascript\"]");
	if (!allScripts) return { success: false, error: "Scripts not found", data: null };

	const productDataScript = getProductScriptFromScripts(allScripts);
	if (!productDataScript) return { success: false, error: "Product data not found", data: null };

	const parsedProductData = getProductDataFromScript(productDataScript);

	if (!parsedProductData) return { success: false, error: "Product data parsing failed", data: null };

	const productName = parsedProductData?.name;
	const price = (parsedProductData?.price && parsedProductData?.metric1) ? (parsePriceToFloat(parsedProductData.price) - parsePriceToFloat(parsedProductData.metric1)) : null;
	const brand = parsedProductData?.brand;
	const productImage = root.querySelector("meta[property=\"og:image\"]")?.getAttribute("content");

	if (!price) return { success: false, error: "Price not found", data: null };
	if (!productName) return { success: false, error: "Product name not found", data: null };


	const promotions = root.querySelectorAll(".promotion-text.promotion_description_holder").map((promotion) => {
		return promotion.text.trim();
	});

	const classifiedPromotions = classifyPromotions(promotions);

	return {
		data: {
			price: price,
			productName: productName,
			productImage: productImage ?? "",
			brand: formatBrandName(brand) || "No Brand",
			shop: PriceAlertShopOption.MANNINGS,
			promotions: classifiedPromotions,
		},
		error: null,
		success: true,
	};

};

function getProductScriptFromScripts(allScripts: HTMLElement[]) {
	for (let i = 0; i < allScripts.length; i++) {
		const script = allScripts[i];
		if (script.textContent.includes("function trackProductDetail()")) {
			return script.text;
		}
	}

	return null;
}

function getProductDataFromScript(script: string) {
	/*
	   say we have a <script> tag with variables like
	   function trackProductDetail() {
	    //console.log('trackProductDetail');
        dataLayer.push({
          'event': 'productDetail',
          'ecommerce': {
            'detail': {
              'products': [

                {
                'name': 'Mannings Apple Cider Vinegar Gummies 60pcs',
                'id': '752642',
                'price': '178.0',
                'metric1': '40.0',
                'brand':  'Mannings',
                'variant': '60pcs',
                'category':'INTAKE'
                }
               ]
             }
           }
        });

	   we only know which line the productDetailPageProductData is in, and the data could have nested objects and spam multiple lines
	   we need to find the start and end of the object, and extract it

		assume it's always an valid json object
		use the classic stack method to find the start and end of the object, meet "{" stack++, meet "}" stack--, loop until stack = 0
	*/
	const productDataIndex = script.indexOf("'products'") + "'products'".length;

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

	const sanitizedData = receivedData.replaceAll("'", "\"");

	try {
		return JSON.parse(sanitizedData);
	}
	catch (error) {
		logger.error((error as Error).message);
		return null;
	}
}

function classifyPromotions(promotions: string[]) {
	const classified = promotions.map((promotion) => {
		const type : PromotionType = classifyPromotionByKeywords(promotion);
		return { type, description: promotion };
	});

	return classified;
}