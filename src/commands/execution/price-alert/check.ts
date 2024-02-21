import { getPriceChangeEmbed } from "~/assets/embeds/priceEmbeds";
import { ChatInputCommandInteraction } from "discord.js";
import { delayNextFetch, getPriceChange, handleScrapeResult } from "~/utils/scraper/scrapePrices";
import { PriceAlertModel } from "~/utils/scraper/db/schema";
import { PriceAlertChecked } from "~/types/priceAlert";

function generateProgressBar(checkedProduct: number, total: number) {
	const filled = "█";
	const unfilled = "░";
	const maxLength = 40;

	const progress = Math.ceil((checkedProduct / total) * maxLength);

	return `[${filled.repeat(progress)}${unfilled.repeat(maxLength - progress)}] (${checkedProduct}/${total})`;

}
export async function execute(interaction: ChatInputCommandInteraction) {
	const repliedMessage = await interaction.reply({ content: "Fetching..." });

	const total = await PriceAlertModel.countDocuments();
	const products = PriceAlertModel.find({}).cursor();

	let count = 0;
	for await (const product of products) {
		count++;
		await delayNextFetch();

		const scrapeResult : PriceAlertChecked = await getPriceChange(product, { skipImageFetch: true });

		handleScrapeResult(scrapeResult, {
			onPriceChange: async (product) => {
				await interaction.channel!.send({ embeds: [getPriceChangeEmbed(product)] });
			},
			onFailure: async (product) => {
				await interaction.channel!.send(`Failed to check [${product.productName}](${product.url}) from ${product.shop} ${product.failCount} times.\r\nReason: ${scrapeResult?.error ?? "Unknown Error"}`);
			},
			onTooManyFailures: async (product) => {
				await PriceAlertModel.findOneAndDelete({ url: product.url });
				await interaction.channel?.send(`Deleted [${product.productName}](${product.url}) from ${product.shop} due to too many failures.`);
			},
		});

		console.log(generateProgressBar(count, total));

		repliedMessage.edit({ content: `Fetching \r\n${generateProgressBar(count, total)}` });
	}
	repliedMessage.edit({ content: `Done! Checked ${count} products` });

}