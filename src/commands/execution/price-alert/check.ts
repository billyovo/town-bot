import { getPriceChangeEmbed } from "~/assets/embeds/priceEmbeds";
import { ChatInputCommandInteraction } from "discord.js";
import { db } from "~/managers/database/databaseManager";
import { delayNextFetch, getPriceChange, handleScrapeResult } from "~/utils/scraper/scrapePrices";
import type { PriceAlertItem } from "~/types/priceAlert";

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.reply({ content: "Fetching..." });

	const collection = db.collection("products");
	const products = collection.find({});

	let count = 0;
	for await (const product of products) {
		count++;
		await delayNextFetch();
		const scrapeResult = await getPriceChange(product as PriceAlertItem, { skipImageFetch: true });
		handleScrapeResult(scrapeResult, {
			onPriceChange: async (product) => {
				await interaction.channel?.send({ embeds: [getPriceChangeEmbed(product)] });
			},
			onFailure: async (product) => {
				await interaction.channel?.send(`Failed to check [${product.productName}](${product.url}) from ${product.shop} ${product.failCount} times.\r\nReason: ${scrapeResult?.error ?? "Unknown Error"}`);
			},
			onTooManyFailures: async (product) => {
				await collection.deleteOne({ _id: product._id });
				await interaction.channel?.send(`Deleted [${product.productName}](${product.url}) from ${product.shop} due to too many failures.`);
			},
		});
	}
	interaction.channel?.send(`Success! Checked ${count} products.`);

}