import { scheduleJob } from "node-schedule";
import { client } from "~/managers/discord/discordManager";
import { ChannelType } from "discord.js";
import { logger } from "~/logger/logger";
import { getPriceChangeEmbed } from "~/assets/embeds/priceEmbeds";
import { delayNextFetch, getPriceChange, handleScrapeResult } from "~/utils/scraper/scrapePrices";
import { PriceAlertModel } from "~/utils/scraper/db/schema";

scheduleJob("7 10 * * *", async () => {
	logger("Running price alert check");

	const channel = await client.channels.fetch((process.env.WEATHER_CHANNEL) as string, { force: true, cache: false });
	if (channel?.type !== ChannelType.GuildText) {
		logger("Failed to fetch channel or channel is not a text channel.");
		return;
	}

	const cursor = PriceAlertModel.find({}).cursor();

	for await (const product of cursor) {
		await delayNextFetch();
		const scrapeResult = await getPriceChange(product, { skipImageFetch: true });

		handleScrapeResult(scrapeResult, {
			onPriceChange: async (updatedProduct) => {
				await channel?.send({ embeds: [getPriceChangeEmbed(updatedProduct)] });
			},
			onFailure: async (updatedProduct) => {
				await channel?.send(`Failed to check [${updatedProduct.productName}](${updatedProduct.url}) from ${updatedProduct.shop} ${updatedProduct.failCount} times.\r\nReason: ${scrapeResult?.error ?? "Unknown Error"}`);
			},
			onTooManyFailures: async (updatedProduct) => {
				await PriceAlertModel.findOneAndDelete({ url: updatedProduct.url });
				await channel?.send(`Deleted [${updatedProduct.productName}](${updatedProduct.url}) from ${updatedProduct.shop} due to too many failures.`);
			},
		});

	}
});