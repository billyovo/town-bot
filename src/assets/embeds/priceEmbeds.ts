import { EmbedBuilder } from "discord.js";
import { PriceAlertShopOptionImage } from "~/enums/priceAlertShopOption";
import { DateTime } from "luxon";
import { PriceAlertItem } from "~/utils/scraper/db/schema";

export function getPriceChangeEmbed(product : PriceAlertItem) {
	const storeImage : string = PriceAlertShopOptionImage[product.shop];

	const previousPrice = product.previous?.price ?? 1;
	const discountPercentage : string = (((previousPrice - product.price) / previousPrice) * 100).toFixed(2);
	const embedColor = (product.price > (previousPrice) ? "Red" : "Green");

	const embed = new EmbedBuilder()
		.setTitle("Price Changed!")
		.setURL(product.url)
		.addFields(
			{ name: "Product", value: product.productName },
			{ name: "Brand", value: `${product.brand}`, inline: true },
			{ name: "Price", value: `~~$${previousPrice}~~  $${product.price.toString()}`, inline: true },
			{ name: "Discount", value: `${discountPercentage}%`, inline: true },
		)
		.setColor(embedColor);
	if (product.productImage) embed.setImage(product.productImage);
	if (storeImage) embed.setThumbnail(storeImage);

	return embed;
}

export function getAddedToAlertEmbed(product: PriceAlertItem) {
	const storeImage : string = PriceAlertShopOptionImage[product.shop];

	const embed = new EmbedBuilder()
		.setTitle(product.productName)
		.setURL(product.url)
		.addFields(
			{ name: "Brand", value: product.brand, inline: true },
			{ name: "Price", value: `$${product.price.toString()}`, inline: true },
		)
		.setFooter({ text: "Added to price alert" })
		.setColor("Green");
	if (product.productImage) embed.setImage(product.productImage);
	if (storeImage) embed.setThumbnail(storeImage);

	return embed;
}

export function getPriceListEmbed(product: PriceAlertItem) {
	const storeImage : string = PriceAlertShopOptionImage[product.shop];
	const embed = new EmbedBuilder()
		.setAuthor({ name: product.brand })
		.setTitle(product.productName)
		.setURL(product.url)
		.addFields(
			{ name: "Price", value: `$${product.price.toString()}`, inline: true },
			{ name: "Last Checked", value: DateTime.fromJSDate(product.lastChecked).toFormat("yyyy-MM-dd hh:mm"), inline: true },
		)
		.setColor("Green");
	if (product.previous) {
		embed.setFooter({ text: `Previous Price: $${product.previous.price}` });
		embed.setTimestamp(product.previous.date);
	}
	if (product.productImage) embed.setImage(product.productImage);
	if (storeImage) embed.setThumbnail(storeImage);
	return embed;
}