import { ChatInputCommandInteraction } from "discord.js";
import { PriceAlertItem, PriceAlertModel } from "~/src/lib/database/schemas/product";

export async function execute(interaction: ChatInputCommandInteraction) {
	const url = interaction.options.get("url")!.value as string;
	const decodedUrl = decodeURI(url);

	const product : PriceAlertItem | null = await PriceAlertModel.findOne({ url: decodedUrl });
	if (!product) return interaction.reply({ content: "Product not found" });

	await PriceAlertModel.deleteOne({ url: product.url });

	interaction.reply({ content: `Deleted [${product.productName}](${product.url}) from ${product.shop} successfully` });
}