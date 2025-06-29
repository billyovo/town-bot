import { PromotionType } from "~/src/@types/enum/price-alert";
import { PromotionClassified, ShopParseFunction } from "~/src/@types/price-alert";
import { Failure, Success } from "~/src/@types/utils";
import { logger } from "~/src/lib/logger/logger";
import { APIClient } from "~/src/lib/utils/fetch/client";
import { PriceAlertShopOption } from "../../utils/enums/priceAlertShopOption";

export const parseManningsPrice: ShopParseFunction = async (url) => {
	const match = url.match(/\/p\/(\d+)(\/|$|\?)/);

	if (!match || match.length < 2) {
		return {
			data: null,
			error: "Invalid URL format",
			success: false,
		};
	}


	const skuID = match[1];

	const productDetails = await fetchProductDetail(skuID);
	if (!productDetails.success) {
		return {
			data: null,
			error: productDetails.error ?? "Failed to fetch product details",
			success: false,
		};
	}

	console.log("Product Details:", productDetails.data);

	const productImage = getProductImage(productDetails.data.media_gallery_entries);
	const promotions : PromotionClassified[] = productDetails.data.offers?.map((offer : Offer) => {
		if (offer.free_gift.is_freegift) {
			return {
				type: PromotionType.FREEBIE,
				description: offer.content[0].description,
			};
		}
		return {
			type: PromotionType.DISCOUNT,
			description: offer.content[0].description,
		};
	},
	);

	const data = {
		brand: productDetails.data.brand_information.name,
		productName: productDetails.data.name,
		productImage: productImage,
		price: productDetails.data.price_range.maximum_price.final_price.value,
		shop: PriceAlertShopOption.MANNINGS,
		promotions: promotions,
	};

	return {
		data,
		error: null,
		success: true,
	};
};


function getProductImage(media: MediaEntry[]): string | null {
	const BASEIMAGEURL = "https://www.mannings.com.hk/media/catalog/product";

	if (media.length === 0) {
		return null;
	}

	for (const entry of media) {
		if (entry.media_type === "image" && !entry.disabled) {
			return `${BASEIMAGEURL}/${entry.file}`;
		}
	}
	return null;
}


async function fetchProductDetail(skuID: string): Promise<Success<ProductItem> | Failure> {
	const BASEURL = "https://www.mannings.com.hk/graphql";
	const query = `
		query getProductDetailForProductPage($sku: String!) {
		productsV2(filter: { sku: { eq: $sku } }) {
			items {
			name
			sku
			price_range {
				maximum_price {
				final_price {
					currency
					value
				}
				}
			}
			offers {
				free_gift {
				is_freegift
				available
				}
				content {
				message
				description
				}
				is_yuu_promotion
				__typename
			}
			brand_information {
				name
			}
			media_gallery_entries {
				position
				disabled
				file
				media_type
			}
			}
		}
		}
  `;

	const params = new URLSearchParams({
		query,
		variables: JSON.stringify({ sku: skuID }),
		operationName: "getProductDetailForProductPage",
	});

	let productDetailsRes;
	const url = `${BASEURL}?${params.toString()}`;
	try {
		productDetailsRes = await APIClient.get(url, {
			headers: {
				"store": "zh_HK",
			},
		});
	}
	catch (error) {
		logger.error(`Cannot Get ${url}: ${error}`);
		return {
			data: null,
			error: "Product not found",
			success: false,
		};
	}
	return {
		data: productDetailsRes.data.data.productsV2.items[0],
		error: null,
		success: true,
	};
}

type ProductItem = {
	name: string;
	sku: string;
	price_range: {
		maximum_price: {
			final_price: {
				currency: string;
				value: number;
			};
		};
	};
	offers: Offer[];
	brand_information: {
		name: string;
	};
	media_gallery_entries: MediaEntry[];
}

type Offer = {
	free_gift: {
		is_freegift: boolean;
		available: boolean;
	};
	content: {
		message: string;
		description: string;
	}[];
	is_yuu_promotion: boolean;
	__typename: string;
}

type MediaEntry = {
	position: number;
	disabled: boolean;
	file: string;
	media_type: string;
}