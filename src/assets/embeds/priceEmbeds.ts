import { EmbedBuilder } from "discord.js";
import { PriceAlertItem } from "../../@types/priceAlert";
import { PriceAlertShopOptionImage } from "@enums/priceAlertShopOption";

export function getPriceChangeEmbed(product : PriceAlertItem) {
	const storeImage : string = PriceAlertShopOptionImage[product.shop];
	const embed = new EmbedBuilder()
		.setTitle("Price Changed!")
		.setURL(product.url)
		.addFields(
			{ name: "Product", value: product.productName },
			{ name: "Price", value: `$~~${product.previous?.price}~~ ${product.price.toString()}`, inline: true },
			{ name: "Discount", value: `${((((product.previous?.price ?? 1) - product.price) / (product.previous?.price ?? 1)) * 100).toFixed(2)}%`, inline: true },
		)
		.setColor((product.price > (product?.previous?.price ?? Infinity) ? "Red" : "Green"));
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