import { ChatInputCommandInteraction } from "discord.js";
import { delayNextFetch, getPriceChange, handleScrapeResult } from "~/utils/scraper/scrapePrices";
import { PriceAlertModel } from "~/database/schemas/product";
import { PriceAlertChecked } from "~/types/priceAlert";

function generateProgressBar(checkedProduct: number, total: number) {
	const filled = "█";
	const unfilled = "░";
	const maxLength = 30;

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

		await handleScrapeResult(scrapeResult);

		repliedMessage.edit({ content: `Fetching [${product.productName}](${product.url}) \r\n${generateProgressBar(count, total)}` });
	}
	repliedMessage.edit({ content: `Done! Checked ${count} products` });

}