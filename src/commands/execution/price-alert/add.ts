import { getAddedToAlertEmbed } from "@assets/embeds/priceEmbeds";
import { PriceAlertItem } from "../../../@types/priceAlert";
import { addProductToAlert } from "@utils/scraper/db/db";
import { sanitizeURL } from "@utils/scraper/url/sanitizeURL";
import { getShopFromURL, parseShopWebsite } from "@utils/scraper/websites/parse";
import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

type Reply = {
	embeds: [EmbedBuilder],
	files?: [AttachmentBuilder]
}
export async function execute(interaction: ChatInputCommandInteraction) {
	const link = interaction.options.get("url")?.value as string;
	const link_sanitized = sanitizeURL(link);
	if (!link_sanitized) return await interaction.reply({ content: "Invalid URL" });

	const shop = getShopFromURL(link_sanitized);
	if (!shop.shop) return interaction.reply({ content: `Shop not supported: ${shop.domain}` });

	await interaction.deferReply();

	const output = await parseShopWebsite(link_sanitized);
	if (!output) return interaction.editReply({ content: "Failed to get price from URL" });

	const itemToBeadded : PriceAlertItem = {
		lastChecked: new Date(),
		url: link_sanitized,
		price: output.price,
		brand: output.brand,
		productName: output.productName,
		productImage: output.productImage,
		shop: output.shop,
	};
	const embed = getAddedToAlertEmbed(itemToBeadded);

	const reply : Reply = { embeds: [embed] };
	if (output.attachment) {
		reply.files = [output.attachment];
		embed.setImage(`attachment://${output.attachment.name}`);
	}

	await interaction.deleteReply();
	const response = await interaction.followUp(reply);
	const itemToBeaddedWithAttachment : PriceAlertItem = {
		...itemToBeadded,
		productImage: response.attachments.first()?.url ?? response.embeds[0].image?.url ?? "",
	};
	const result = await addProductToAlert(itemToBeaddedWithAttachment);
	if (!result.success) return interaction.followUp({ content: result.error ?? "Unknown error" });
}