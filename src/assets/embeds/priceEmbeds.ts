import { ColorResolvable, EmbedBuilder, EmbedField, unorderedList } from "discord.js";
import { DateTime } from "luxon";
import { PriceAlertShopParseDetails } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { PriceAlertGrouped, PriceAlertItem, ShopPriceItem } from "~/src/lib/database/schemas/product";
import { PromotionType } from "~/src/@types/enum/price-alert";
import { PromotionClassified } from "~/src/@types/price-alert";

export function getPriceChangeEmbed(product : PriceAlertItem) {
	const storeImage : string = PriceAlertShopParseDetails[product.shop]?.image ?? "";

	const previousPrice = product.previous?.price ?? 1;
	const discountPercentage : string = (((previousPrice - product.price) / previousPrice) * 100).toFixed(2);
	let embedColor : ColorResolvable = "NotQuiteBlack";
	if (previousPrice > product.price) embedColor = "Green";
	if (previousPrice < product.price) embedColor = "Red";

	const price = (previousPrice.toFixed(1) === product.price.toFixed(1)) ? `$${product.price.toFixed(1)}` : `~~$${previousPrice.toFixed(1)}~~  $${product.price.toFixed(1)}`;
	const embed = new EmbedBuilder()
		.setTitle("Price Changed!")
		.setURL(product.url)
		.addFields(
			{ name: "Product", value: product.productName },
			{ name: "Brand", value: `${product.brand}`, inline: true },
			{ name: "Price", value: price, inline: true },
			{ name: "Discount", value: `${discountPercentage}%`, inline: true },
		)
		.setColor(embedColor);

	if (product.promotions) {
		const discountPromotions = product.promotions?.filter(promotion => promotion.type === PromotionType.DISCOUNT)
			.map((promotion) => `${promotion.description} ${promotion?.endTime ? `\r\n\r\nEnds: ${DateTime.fromJSDate(promotion.endTime).toFormat("yyyy-MM-dd HH:mm")}` : ""}`);
		if (discountPromotions.length > 0) {
			embed.addFields(discountPromotions.map((promotion, index) => (
				{ name: `Promotion ${index + 1}`, value: promotion.substring(0, 1024) }
			)));
		}
	}

	if (product.productImage) embed.setImage(product.productImage);
	if (storeImage) embed.setThumbnail(storeImage);

	return embed;
}

export function getAddedToAlertEmbed(product: PriceAlertItem) {
	const storeImage : string = PriceAlertShopParseDetails[product.shop]?.image ?? "";

	const embed = new EmbedBuilder()
		.setTitle(product.productName)
		.setURL(product.url)
		.addFields(
			{ name: "Brand", value: product.brand, inline: true },
			{ name: "Price", value: `$${product.price.toFixed(1)}`, inline: true },
		)
		.setFooter({ text: "Added to price alert" })
		.setColor("Green");
	if (product.productImage) embed.setImage(product.productImage);
	if (storeImage) embed.setThumbnail(storeImage);
	if (product.promotions) {
		const discountPromotions = product.promotions?.filter(promotion => promotion.type === PromotionType.DISCOUNT)
			.map((promotion) => `${promotion.description} ${promotion?.endTime ? `\r\n\r\nEnds: ${DateTime.fromJSDate(promotion.endTime).toFormat("yyyy-MM-dd HH:mm")}` : ""}`);
		if (discountPromotions.length > 0) {
			embed.addFields(discountPromotions.map((promotion, index) => (
				{ name: `Promotion ${index + 1}`, value: promotion.substring(0, 1024) }
			)));
		}
	}
	return embed;
}

function getProductImage(shopsItems : ShopPriceItem[]) : string {
	for (let i = 0; i < shopsItems.length; i++) {
		if (!shopsItems[i].productImage) continue;

		// @ts-expect-error typescript y u can't recognize non-null check?
		return shopsItems[i].productImage;
	}
	return "";
}

export function getPriceListEmbed(productGroup: PriceAlertGrouped) {
	const productImage : string = getProductImage(productGroup.shops);

	const fields : EmbedField[] = [];

	productGroup.shops.forEach((shopItem : ShopPriceItem) => {
		fields.push({
			name: "Price",
			value: `${PriceAlertShopParseDetails[shopItem.shop].emote} $${shopItem.price}`,
			inline: true,
		});
		const promotionsList : string[] = shopItem.promotions?.map((promotion : PromotionClassified) => {
			let promotionString = promotion.description;
			if (promotion.endTime) {
				promotionString += `\r\nEnd Time: ${DateTime.fromJSDate(promotion.endTime).toFormat("yyyy-MM-dd HH:mm")}`;
			}

			return promotionString;
		}) ?? [];

		fields.push({
			name: "Promotions",
			value: promotionsList.length ? unorderedList(promotionsList) : "-",
			inline: true,
		});
	});

	const embed = new EmbedBuilder()
		.setAuthor({ name: productGroup.brand })
		.setTitle(productGroup.productName)
		.setColor("Green")
		.addFields(fields);
	if (productImage) {
		embed.setImage(productImage);
	}
	return embed;
}