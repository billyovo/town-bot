import { ShopParseFunction } from "~/src/@types/price-alert";
import { PriceAlertShopOption } from "../../utils/enums/priceAlertShopOption";
import { logger } from "~/src/lib/logger/logger";
import { getImageBase64FromLink, createImgurURLFromBase64 } from "~/src/lib/images/transformImages";
import { APIClient } from "~/src/lib/utils/fetch/client";
import type { Failure, Success } from "~/src/@types/utils";
import { Base64String } from "discord.js";

export const parseWatsonsGroupPrice : ShopParseFunction = async (url, shopDetails, options) => {
	if (!shopDetails.shop) {
		return {
			data: null,
			error: "No Shop Found in URL",
			success: false,
		};
	}

	const shopDetail : WatsonsGroupShopDetails | null = getBaseURLAndCode(shopDetails.shop);
	if (!shopDetail) {
		return {
			data: null,
			error: "Shop not supported",
			success: false,
		};
	}
	const { baseURL, shopCode, shopOption } = shopDetail;


	const regex = /BP_.*/g;
	const productID : string | undefined = regex.exec(url)?.[0]?.replace("BP_", "");

	if (!productID) {
		return {
			data: null,
			error: "Invalid URL",
			success: false,
		};
	}

	const productDetails : Success<ProductDetail> | Failure = await fetchProductDetail(`${baseURL}/api/v2/${shopCode}/products/search?fields=FULL&query=BP_${productID}&lang=zh_HK&curr=HKD`);
	const promotionPrice : number = await fetchPromotionPrice(`${baseURL}/api/v2/${shopCode}/products/${productID}/multiBuy?fields=FULL&lang=zh_HK&curr=HKD`);

	if (!productDetails.success) {
		return {
			data: null,
			error: productDetails.error,
			success: false,
		};
	}
	const productImage : string | null = options?.skipImageFetch ? null : await processProductImage(productDetails.data.productImage, baseURL);
	return {
		data:{
			brand: productDetails.data.brand,
			productName: productDetails.data.productName,
			productImage: productImage,
			price: Math.min(promotionPrice, productDetails.data.discountedPriceWithoutPromotion),
			shop: shopOption,
		},
		success: true,
	};

};

type ProductDetail = {
	brand: string,
	productName: string,
	productImage: string,
	discountedPriceWithoutPromotion: number,
}

async function fetchProductDetail(url : string) : Promise<Success<ProductDetail> | Failure> {
	let productDetailsRes;
	try {
		productDetailsRes = await APIClient.get(url, {});
	}
	catch (error) {
		logger.error(`Cannot Get ${url}: ${error}`);
		return {
			data: null,
			error: "Product not found",
			success: false,
		};
	}
	const productDetail = productDetailsRes.data?.products?.[0];
	if (!productDetail) {
		return {
			data: null,
			error: "Product not found",
			success: false,
		};
	}

	const brand : string = productDetail.masterBrand.name;
	const productName :string = productDetail.elabProductName;
	const productImage : string = productDetail.images[0].url;
	const discountedPriceWithoutPromotion : number = productDetail.elabMarkDownMemPrice?.value || productDetail.elabMarkDownPrice?.value || productDetail.price?.value;

	return {
		data:{
			brand,
			productName,
			productImage,
			discountedPriceWithoutPromotion,
		},
		success: true,
	};
}


type PromotionPriceResponse = {
	avgDiscountedPrice: {
		value: number
	}
}

async function fetchPromotionPrice(url : string) : Promise<number> {
	let promotionPriceRes;
	try {
		promotionPriceRes = await APIClient.get(url);
	}
	catch (error) {
		logger.error(`Cannot Get ${url}: ${error}`);
		return Infinity;
	}
	const memberPrice = promotionPriceRes.data.elabmarkdownMemPrice?.value ?? Infinity;
	if (!promotionPriceRes.data.elabMultiBuyPromotionList?.length && (memberPrice === Infinity)) return Infinity;

	const promotionPrice : number = promotionPriceRes.data.elabMultiBuyPromotionList.reduce((minPrice : number, item : PromotionPriceResponse) => {
		return (Math.min(minPrice, item.avgDiscountedPrice.value) || minPrice);
	}, Infinity);

	return Math.min(promotionPrice, memberPrice);
}

type WatsonsGroupShopDetails = {
	baseURL: string,
	shopCode: string,
	shopOption: PriceAlertShopOption,
};

function getBaseURLAndCode(shop: PriceAlertShopOption) : WatsonsGroupShopDetails | null {
	switch (shop) {
		case PriceAlertShopOption.WATSONS:{
			return {
				baseURL: "https://api.watsons.com.hk",
				shopCode: "wtchk",
				shopOption: PriceAlertShopOption.WATSONS,
			};
		}
		case PriceAlertShopOption.PNS:{
			return {
				baseURL: "https://api.pns.hk",
				shopCode: "pnshk",
				shopOption: PriceAlertShopOption.PNS,
			};
		}
	}

	return null;
}

async function processProductImage(url : string | null, baseURL: string) {
	if (!url) return null;

	const productCDNImage : string = url.startsWith("/") ? `${baseURL}${url}` : url;

	const productImageBase64 : Base64String | null = await getImageBase64FromLink(productCDNImage);
	if (!productImageBase64) {
		logger.error(`Cannot get image from ${productCDNImage}`);
		return null;
	}

	const imgurURL : string | null = await createImgurURLFromBase64(productImageBase64);
	if (!imgurURL) {
		logger.error(`Cannot create imgur URL from ${productCDNImage}`);
		return null;
	}

	return imgurURL;
}