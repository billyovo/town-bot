import { EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { PriceAlertShopParseDetails, PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { PriceAlertItem } from "~/src/lib/database/schemas/product";

export function getPriceChangeEmbed(product : PriceAlertItem) {
	const storeImage : string = PriceAlertShopParseDetails[product.shop as PriceAlertShopOption]?.image ?? "";

	const previousPrice = product.previous?.price ?? 1;
	const discountPercentage : string = (((previousPrice - product.price) / previousPrice) * 100).toFixed(2);
	const embedColor = (product.price > (previousPrice) ? "Red" : "Green");

	const embed = new EmbedBuilder()
		.setTitle("Price Changed!")
		.setURL(product.url)
		.addFields(
			{ name: "Product", value: product.productName },
			{ name: "Brand", value: `${product.brand}`, inline: true },
			{ name: "Price", value: `~~$${previousPrice.toFixed(1)}~~  $${product.price.toFixed(1)}`, inline: true },
			{ name: "Discount", value: `${discountPercentage}%`, inline: true },
		)
		.setColor(embedColor);
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
	return embed;
}