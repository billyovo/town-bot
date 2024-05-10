import { ChatInputCommandInteraction } from "discord.js";
import { getPriceChange, handleScrapeResult } from "~/utils/scraper/scrapePrices";
import { PriceAlertItem, PriceAlertModel } from "~/database/schemas/product";
import { PriceAlertChecked, ShopParseFunctionReturn } from "~/types/priceAlert";
import { parseShopWebsite } from "~/utils/scraper/parse/parse";
import { scrapeDelayTime } from "~/configs/scraper";
import { delay } from "~/utils/time/delay";

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

		const randomDelayTime = Math.floor(Math.random() * scrapeDelayTime);
		await delay(randomDelayTime);

		const productObject : PriceAlertItem = product.toObject();
		const newProductInfo : ShopParseFunctionReturn = await parseShopWebsite(productObject.url, { skipImageFetch: true });
		const scrapeResult : PriceAlertChecked = await getPriceChange(productObject, newProductInfo);

		await handleScrapeResult(scrapeResult);

		repliedMessage.edit({ content: `Fetching [${product.productName}](${product.url}) \r\n${generateProgressBar(count, total)}` });
	}
	repliedMessage.edit({ content: `Done! Checked ${count} products` });

}