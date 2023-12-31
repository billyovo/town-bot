import { getPriceChangeEmbed } from "@assets/embeds/priceEmbeds";
import { updateDatabaseFromScrapeResult } from "@utils/scraper/db/db";
import { ChatInputCommandInteraction } from "discord.js";
import { db } from "@managers/database/databaseManager";
import { getPriceChange } from "@utils/scraper/scrapePrices";
import type { PriceAlertItem } from "../../../@types/priceAlert";
import { PriceAlertResult } from "@enums/priceAlertShopOption";

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.reply({ content: "Fetching..." });

	const collection = db.collection("products");
	const products = collection.find({});

	let count = 0;
	for await (const product of products) {
		count++;
		const scrapeResult = await getPriceChange(product as PriceAlertItem);

		switch (scrapeResult.result) {
		case PriceAlertResult.PRICE_CHANGE:
			await interaction.channel?.send({ embeds: [getPriceChangeEmbed(scrapeResult.data)] });
			break;
		case PriceAlertResult.FAIL:
			await interaction.channel?.send(`Failed to check [${scrapeResult.data.productName}](${scrapeResult.data.url}) from ${scrapeResult.data.shop} ${scrapeResult.data.failCount} times.\r\nReason: ${scrapeResult?.error ?? "Unknown Error"}`);
			break;
		}

		await updateDatabaseFromScrapeResult(scrapeResult);
	}
	interaction.channel?.send(`Success! Checked ${count} products.`);

}