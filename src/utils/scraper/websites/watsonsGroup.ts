import { axiosClient } from "../client";
import { Failure, ShopDetails, ShopParseFunction, Success } from "../../../@types/priceAlert";
import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { AttachmentBuilder } from "discord.js";
import { getShopFromURL } from "./parse";
import { logger } from "../../../logger/logger";
import { createAttachmentFromImageURL } from "@utils/discord/createAttachmentFromImageURL";

export const parseWatsonsGroupPrice : ShopParseFunction = async (url) => {
	const shop : ShopDetails = getShopFromURL(url);
	const shopDetail : WatsonsGroupShopDetails | null = getBaseURLAndCode(shop.shop as PriceAlertShopOption);
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

	const productDetails : Success<ProductDetail> | Failure = await fetchProductDetail(`${baseURL}/api/v2/${shopCode}/products/search?fields=FULL&query=BP_${productID}&ignoreSort=true&lang=zh_HK&curr=HKD`);
	const promotionPrice : number = await fetchPromotionPrice(`${baseURL}/api/v2/${shopCode}/products/${productID}/multiBuy?fields=FULL&lang=zh_HK&curr=HKD`);

	const productCDNImage = `${baseURL}${productDetails.data?.productImage}`;
	const productAttachment : AttachmentBuilder | null = await createAttachmentFromImageURL(productCDNImage);

	if (!productDetails.success) {
		return {
			data: null,
			error: productDetails.error,
			success: false,
		};
	}

	return {
		data:{
			brand: productDetails.data.brand,
			productName: productDetails.data.productName,
			productImage: "",
			price: Math.min(promotionPrice, productDetails.data.discountedPriceWithoutPromotion),
			attachment: productAttachment,
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
		productDetailsRes = await axiosClient.get(url, {
			headers: {
				Accept: "application/json",
			},
		});
	}
	catch (error) {
		logger(`Cannot Get ${url}: ${error}`);
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
	const discountedPriceWithoutPromotion : number = productDetail.elabMarkDownPrice?.value || productDetail.price?.value;

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
		promotionPriceRes = await axiosClient.get(url, {
			headers: {
				Accept: "application/json",
			},
		});
	}
	catch (error) {
		logger(`Cannot Get ${url}: ${error}`);
		return Infinity;
	}
	if (!promotionPriceRes.data.elabMultiBuyPromotionList?.length) return Infinity;

	const promotionPrice : number = promotionPriceRes.data.elabMultiBuyPromotionList.reduce((minPrice : number, item : PromotionPriceResponse) => {
		return (Math.min(minPrice, item.avgDiscountedPrice.value) || minPrice);
	}, Infinity);

	return promotionPrice;
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
			baseURL: "http://api.pns.hk",
			shopCode: "pnshk",
			shopOption: PriceAlertShopOption.PNS,
		};
	}
	}

	return null;
}