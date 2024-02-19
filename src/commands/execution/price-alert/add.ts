import { getAddedToAlertEmbed } from "~/assets/embeds/priceEmbeds";
import { addProductToAlert } from "~/utils/scraper/db/db";
import { parseShopWebsite } from "~/utils/scraper/parse/parse";
import { ChatInputCommandInteraction } from "discord.js";
import { PriceAlertItem } from "~/utils/scraper/db/schema";

export async function execute(interaction: ChatInputCommandInteraction) {
	const link = interaction.options.get("url")?.value as string;

	await interaction.deferReply();

	const output = await parseShopWebsite(link);
	if (!output.success) return await interaction.editReply({ content: output.error ?? "Unknown error" });

	const itemToBeadded : PriceAlertItem = {
		lastChecked: new Date(),
		url: link,
		price: output.data.price,
		brand: output.data.brand,
		productName: output.data.productName,
		productImage: output.data.productImage,
		shop: output.data.shop,
		failCount: 0,
	};

	const result = await addProductToAlert(itemToBeadded);
	if (!result.success) return await interaction.editReply({ content: result.error ?? "Unknown error" });

	const embed = getAddedToAlertEmbed(itemToBeadded);
	return await interaction.editReply({ embeds: [embed] });
}