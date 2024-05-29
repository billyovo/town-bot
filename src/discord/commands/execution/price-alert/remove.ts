import { ChatInputCommandInteraction } from "discord.js";
import { PriceAlertItem, PriceAlertModel } from "~/src/lib/database/schemas/product";

export async function execute(interaction: ChatInputCommandInteraction) {
	const url = interaction.options.getString("url") ?? "";
	const shop = interaction.options.getString("shop") ?? "";
	const brand = interaction.options.getString("brand") ?? "";
	const productName = interaction.options.getString("name") ?? "";

	if (!(url || (brand && productName && shop))) {
		return interaction.reply({ content: "Please provide a URL or both a brand and a product name" });
	}

	let query = {};

	if (url) {
		query = { url: decodeURI(url) };
	}
	else {
		query = { productName: productName, brand: brand, shop: shop };
	}

	const product : PriceAlertItem | null = await PriceAlertModel.findOne(query).exec();
	if (!product) return interaction.reply({ content: "Product not found" });

	await PriceAlertModel.deleteOne({ url: product.url });

	interaction.reply({ content: `Deleted [${product.productName}](${product.url}) from ${product.shop} successfully` });
}