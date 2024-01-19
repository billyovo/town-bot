import { getAddedToAlertEmbed } from "@assets/embeds/priceEmbeds";
import { PriceAlertItem } from "../../../@types/priceAlert";
import { addProductToAlert } from "@utils/scraper/db/db";
import { sanitizeURL } from "@utils/scraper/url/sanitizeURL";
import { getShopFromURL, parseShopWebsite } from "@utils/scraper/parse/parse";
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
	if (!output.success) return await interaction.editReply({ content: output.error ?? "Unknown error" });

	const itemToBeadded : PriceAlertItem = {
		lastChecked: new Date(),
		url: link_sanitized,
		price: output.data.price,
		brand: output.data.brand,
		productName: output.data.productName,
		productImage: output.data.productImage,
		shop: output.data.shop,
	};
	const embed = getAddedToAlertEmbed(itemToBeadded);

	const reply : Reply = { embeds: [embed] };
	if (output.data.attachment) {
		reply.files = [output.data.attachment];
		embed.setImage(`attachment://${output.data.attachment.name}`);
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