import { scheduleJob } from "node-schedule";
import { updateDatabaseFromScrapeResult } from "@utils/scraper/db/db";
import { client } from "@managers/discord/discordManager";
import { TextChannel } from "discord.js";
import { logger } from "../logger/logger";
import { getPriceChangeEmbed } from "@assets/embeds/priceEmbeds";
import { db } from "@managers/database/databaseManager";
import { getPriceChange } from "@utils/scraper/scrapePrices";
import { PriceAlertItem, PriceAlertResult } from "../@types/priceAlert.d";

scheduleJob("7 10 * * *", async () => {
	logger("Running price alert check");
	const collection = db.collection("products");
	const products = collection.find({});
	const channel = await client.channels.fetch((process.env.WEATHER_CHANNEL) as string, { force: true, cache: false }) as TextChannel;

	for await (const product of products) {
		const scrapeResult = await getPriceChange(product as PriceAlertItem);
		if (!scrapeResult?.data) continue;

		switch (scrapeResult.result) {
		case PriceAlertResult.PRICE_CHANGE:
			await channel?.send({ embeds: [getPriceChangeEmbed(scrapeResult.data)] });
			break;
		case PriceAlertResult.FAIL:
			await channel?.send(`Failed to check [${scrapeResult.data.productName}](${scrapeResult.data.url}) from ${scrapeResult.data.shop} ${scrapeResult.data.failCount} times.`);
			break;
		}
		await updateDatabaseFromScrapeResult(scrapeResult);
	}
});