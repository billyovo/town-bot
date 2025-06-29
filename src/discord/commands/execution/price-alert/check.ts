import { ChatInputCommandInteraction } from "discord.js";
import { getPriceChange, handleScrapeResult } from "~/src/lib/price-alert/handlePriceAlert";
import { PriceAlertItem, PriceAlertModel } from "~/src/lib/database/schemas/product";
import { PriceAlertChecked, ShopParseFunctionReturn } from "~/src/@types/price-alert";
import { parseShopWebsite } from "~/src/lib/price-alert/scrape/parse";
import { scrapeDelayTime } from "~/src/configs/price-alert";
import { delay } from "~/src/lib/utils/time/delay";

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
	const products : AsyncIterable<PriceAlertItem> = PriceAlertModel.find({ isEnabled: true }).lean().cursor();

	let count = 0;
	for await (const product of products) {
		count++;

		const randomDelayTime = Math.floor(Math.random() * scrapeDelayTime);
		await delay(randomDelayTime);

		const newProductInfo : ShopParseFunctionReturn = await parseShopWebsite(product.url, product, { skipImageFetch: true });
		const scrapeResult : PriceAlertChecked = await getPriceChange(product, newProductInfo);

		await handleScrapeResult(scrapeResult);

		repliedMessage.edit({ content: `Fetching [${product.productName}](${product.url}) \r\n${generateProgressBar(count, total)}` });
	}
	repliedMessage.edit({ content: `Done! Checked ${count} products` });

}