import { getAddedToAlertEmbed } from "~/src/assets/embeds/priceEmbeds";
import { addProductToAlert } from "~/src/lib/price-alert/utils/db";
import { parseShopWebsite } from "~/src/lib/price-alert/scrape/parse";
import { ChatInputCommandInteraction } from "discord.js";
import { PriceAlertItem } from "~/src/lib/database/schemas/product";
import { getPromotionClassifier } from "~/src/lib/price-alert/classifier/getClassifier";

export async function execute(interaction: ChatInputCommandInteraction) {
	const link = interaction.options.get("url")!.value as string;
	const inputProductName = interaction.options.getString("name") ?? "";
	const inputProductBrand = interaction.options.getString("brand") ?? "";

	const decodedURL = decodeURI(link);

	await interaction.deferReply();
	const classifier = await getPromotionClassifier();

	const output = await parseShopWebsite(decodedURL, { classifier: classifier });

	if (!output.success) return await interaction.editReply({ content: output.error ?? "Unknown error" });

	const itemToBeadded : PriceAlertItem = {
		lastChecked: new Date(),
		url: decodedURL,
		price: output.data.price,
		brand: inputProductBrand || output.data.brand,
		productName: inputProductName || output.data.productName,
		productImage: output.data.productImage,
		shop: output.data.shop,
		promotions: output.data.promotions,
		failCount: 0,
	};

	const result = await addProductToAlert(itemToBeadded);
	if (!result.success) return await interaction.editReply({ content: result.error ?? "Unknown error" });

	const embed = getAddedToAlertEmbed(itemToBeadded);
	return await interaction.editReply({ embeds: [embed] });
}