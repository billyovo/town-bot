import { ColorResolvable, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { PriceAlertShopParseDetails } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { PriceAlertItem } from "~/src/lib/database/schemas/product";
import { PromotionType } from "~/src/@types/enum/price-alert";

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

export function getPriceListEmbed(product: PriceAlertItem) {
	const storeImage : string = PriceAlertShopParseDetails[product.shop]?.image ?? "";

	const embed = new EmbedBuilder()
		.setAuthor({ name: product.brand })
		.setTitle(product.productName)
		.setURL(product.url)
		.addFields(
			{ name: "Price", value: `$${product.price.toFixed(1)}`, inline: true },
			{ name: "Last Checked", value: DateTime.fromJSDate(product.lastChecked).toFormat("yyyy-MM-dd HH:mm"), inline: true },
		)
		.setColor("Green");

	// is there a previous price?
	// beware price = 0 here.
	if (product.previous?.price !== undefined) {
		embed.setFooter({ text: `Previous Price: $${product.previous.price.toFixed(1)}` });
		embed.setTimestamp(product.previous.date);
	}
	if (product.productImage) embed.setImage(product.productImage);
	if (storeImage) embed.setThumbnail(storeImage);
	if (product.promotions) {
		const discountPromotions = product.promotions?.filter(promotion => promotion.type === PromotionType.DISCOUNT)
			.map((promotion, index) => `**${index + 1}.** ${promotion.description} ${promotion?.endTime ? `\r\n\r\nEnds: ${DateTime.fromJSDate(promotion.endTime).toFormat("yyyy-MM-dd HH:mm")}` : ""}`);
		if (discountPromotions.length > 0) {
			embed.addFields(discountPromotions.map((promotion, index) => (
				{ name: `Promotion ${index + 1}`, value: promotion.substring(0, 1024) }
			)));
		}
	}
	return embed;
}