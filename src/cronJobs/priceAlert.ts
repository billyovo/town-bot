import { scheduleJob } from "node-schedule";
import { client } from "~/managers/discord/discordManager";
import { TextChannel } from "discord.js";
import { logger } from "~/logger/logger";
import { getPriceChangeEmbed } from "~/assets/embeds/priceEmbeds";
import { db } from "~/managers/database/databaseManager";
import { delayNextFetch, getPriceChange, handleScrapeResult } from "~/utils/scraper/scrapePrices";
import type { PriceAlertItem } from "~/types/priceAlert";

scheduleJob("7 10 * * *", async () => {
	logger("Running price alert check");
	const collection = db.collection("products");
	const products = collection.find({});
	const channel = await client.channels.fetch((process.env.WEATHER_CHANNEL) as string, { force: true, cache: false }) as TextChannel;

	for await (const product of products) {
		await delayNextFetch();
		const scrapeResult = await getPriceChange(product as PriceAlertItem, { skipImageFetch: true });
		handleScrapeResult(scrapeResult, {
			onPriceChange: async (product) => {
				await channel?.send({ embeds: [getPriceChangeEmbed(product)] });
			},
			onFailure: async (product) => {
				await channel?.send(`Failed to check [${product.productName}](${product.url}) from ${product.shop} ${product.failCount} times.\r\nReason: ${scrapeResult?.error ?? "Unknown Error"}`);
			},
			onTooManyFailures: async (product) => {
				await collection.deleteOne({ _id: product._id });
				await channel?.send(`Deleted [${product.productName}](${product.url}) from ${product.shop} due to too many failures.`);
			},
		});
	}
});