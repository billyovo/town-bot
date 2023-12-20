import { getAddedToAlertEmbed } from "@assets/embeds/priceEmbeds";
import { PriceAlertItem } from "../../../@types/priceAlert";
import { addProductToAlert } from "@utils/scraper/db/db";
import { sanitizeURL } from "@utils/scraper/url/sanitizeURL";
import { getShopFromURL, parseShopWebsite } from "@utils/scraper/websites/parse";
import { ChatInputCommandInteraction } from "discord.js";

export async function execute(interaction: ChatInputCommandInteraction) {
	const link = interaction.options.get("url")?.value as string;

	const link_sanitized = sanitizeURL(link);
	if (!link_sanitized) return await interaction.reply({ content: "Invalid URL" });

	const shop = getShopFromURL(link_sanitized);
	if (!shop.shop) return interaction.reply({ content: `Shop not supported: ${shop.domain}` });

	await interaction.deferReply();

	const output = await parseShopWebsite(link_sanitized);
	if (!output) return interaction.editReply({ content: "Failed to parse price" });
	const itemToBeadded : PriceAlertItem = {
		lastChecked: new Date(),
		url: link_sanitized,
		price: output.price,
		brand: output.brand,
		productName: output.productName,
		productImage: output.productImage,
		shop: output.shop,
	};
	const result = await addProductToAlert(itemToBeadded);
	if (!result.success) return interaction.editReply({ content: result.error ?? "Unknown error" });

	const embed = getAddedToAlertEmbed(itemToBeadded);

	interaction.editReply({ embeds: [embed] });
}