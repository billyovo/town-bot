import { axiosClient } from "../client";
import { ShopParseFunction } from "../../../@types/priceAlert";
import { PriceAlertShopOption } from "@enums/priceAlertShopOption";
import { AttachmentBuilder } from "discord.js";

export const parseWatsonsPrice : ShopParseFunction = async (url) => {
	const regex = /BP_.*/g;
	const productID = regex.exec(url)?.[0]?.replace("BP_", "");

	if (!productID) {
		return {
			data: null,
			error: "Invalid URL",
			success: false,
		};
	}

	const API_URL = "https://api.watsons.com.hk";
	const productDetails = await fetchProductDetail(`${API_URL}/api/v2/wtchk/products/search?fields=FULL&query=BP_${productID}&ignoreSort=true&lang=zh_HK&curr=HKD`);
	const promotionPrice = await fetchPromotionPrice(`${API_URL}/api/v2/wtchk/products/${productID}/multiBuy?fields=FULL&lang=zh_HK&curr=HKD`);

	const productCDNImage = `${API_URL}${productDetails.data?.productImage}`;

	let productAttachment : AttachmentBuilder | null = null;
	if (productCDNImage) {
		const image = await axiosClient.get(productCDNImage, { responseType: "arraybuffer" });
		productAttachment = new AttachmentBuilder(image.data, { name: "productImage.png" });
	}

	if (!productDetails.data || !productDetails.success) {
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
			shop: PriceAlertShopOption.WATSONS,
		},
		success: true,
	};

};

async function fetchProductDetail(url : string) {
	const productDetailsRes = await axiosClient.get(url, {
		headers: {
			Accept: "application/json",
		},
	})
		.catch(() => {
			return {
				success: false,
				data: null,
				error: "Cannot fetch product details",
			};
		});
	const productDetail = productDetailsRes.data?.products?.[0];
	if (!productDetail) {
		return {
			data: null,
			error: "Product not found",
			success: false,
		};
	}

	const brand = productDetail.masterBrand.name;
	const productName = productDetail.elabProductName;
	const productImage = productDetail.images[0].url;
	const discountedPriceWithoutPromotion = productDetail.elabMarkDownPrice?.value || productDetail.price?.value;

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
async function fetchPromotionPrice(url : string) {
	const promotionPriceRes = await axiosClient.get(url, {
		headers: {
			Accept: "application/json",
		},
	})
		.catch(() => {
			return null;
		});

	if (!promotionPriceRes) {
		return null;
	}
	const promotionPrice = promotionPriceRes.data.elabMultiBuyPromotionList.reduce((minPrice : number, item : PromotionPriceResponse) => {
		return (Math.min(minPrice, item.avgDiscountedPrice.value) || minPrice);
	}, Infinity);

	return promotionPrice;
}