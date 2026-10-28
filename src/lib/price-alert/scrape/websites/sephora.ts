import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { ShopParseFunction } from "~/src/@types/price-alert";
import { APIClient } from "~/src/lib/utils/fetch/client";
import { formatBrandName, parsePriceToFloat } from "~/src/lib/price-alert/utils/format";

export const parseSephoraPrice: ShopParseFunction = async (url, shopDetails) => {
	if (shopDetails.domainLong !== "sephora.hk") {
		return {
			success: false,
			error: "Only sephora.hk supported!",
			data: null,
		};
	}
	const pathParts = new URL(url).pathname.split("/").filter(Boolean);
	const productsIndex = pathParts.indexOf("products");
	const nameSlug = productsIndex === -1 ? undefined : pathParts[productsIndex + 1];
	const variantSlug = pathParts[productsIndex + 2] === "v" ? pathParts[productsIndex + 3] : undefined;

	if (!nameSlug) {
		return {
			success: false,
			error: "Invalid URL",
			data: null,
		};
	}
	const params = new URLSearchParams({
		include:
			"variants.filter_values,variants.ingredient_preference,featured_ad.virtual_bundle.bundle_elements,product_articles,filter_types",
	});
	if (variantSlug) params.set("v", variantSlug);
	const api = `https://www.sephora.hk/api/v2.6/products/${nameSlug}?${params.toString()}`;
	let productData;
	try {
		const response = await APIClient.get(api, {
			headers: {
				"Accept-Language": "zh-HK",
			},
		});
		productData = response.data;
	} catch {
		return { success: false, error: "Failed to fetch", data: null };
	}

	const attributes = productData?.data?.attributes;
	if (!attributes) return { success: false, error: "Failed to parse product data", data: null };

	const variants: SephoraVariant[] = (productData.included ?? []).filter(
		(item: SephoraVariant) => item.type === "variants",
	);
	const variant = variantSlug ? variants.find((item) => item.attributes?.["slug-url"] === variantSlug) : undefined;
	if (variantSlug && variantSlug !== "default" && variants.length > 0 && !variant) {
		return { success: false, error: `Variant not found: ${variantSlug}`, data: null };
	}

	const variantName = variant && variant.attributes.name !== "default" ? variant.attributes.name : "";
	const productName = `${attributes.name} ${attributes.heading ?? ""} ${variantName}`.replace(/\s+/g, " ").trim();
	const productPrice = variant?.attributes["display-price"] ?? attributes["display-price"];
	const productImage = variant?.attributes["image-urls"]?.[0] ?? attributes["image-urls"]?.[0] ?? null;
	const brand = attributes["brand-name"];

	if (!productPrice || !productName)
		return { success: false, error: "Failed to parse price or product name", data: null };

	const price = parsePriceToFloat(productPrice);
	if (!Number.isFinite(price)) return { success: false, error: "Failed to parse price", data: null };

	return {
		data: {
			productName: productName,
			price: price,
			productImage: productImage,
			brand: formatBrandName(brand),
			shop: PriceAlertShopOption.SEPHORA,
		},
		error: null,
		success: true,
	};
};

type SephoraVariant = {
	type: string;
	attributes: {
		name: string;
		"slug-url": string;
		"display-price"?: string;
		"image-urls"?: string[];
	};
};
