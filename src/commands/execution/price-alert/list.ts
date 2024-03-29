import { ButtonStyle, ChatInputCommandInteraction, CollectedMessageInteraction, Interaction } from "discord.js";
import { PriceAlertListMode } from "~/enums/priceAlertShopOption";
import { getPriceListEmbed } from "~/assets/embeds/priceEmbeds";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { splitMessage } from "~/utils/discord/splitMessage";
import { EventEmitter } from "node:events";
import { PriceAlertItem, PriceAlertModel } from "~/utils/scraper/db/schema";
import { getPriceChange, handleScrapeResult } from "~/utils/scraper/scrapePrices";

enum ButtonType {
	NEXT = "next",
	PREVIOUS = "previous",
	REMOVE = "remove",
	CHECK = "check"
}
export async function execute(interaction: ChatInputCommandInteraction) {
	const mode : PriceAlertListMode = interaction.options.get("mode")?.value as PriceAlertListMode;

	const productsArray : PriceAlertItem[] = await PriceAlertModel.find({}).exec();

	if (productsArray.length === 0) {
		await interaction.reply({ content: "No products found" });
		return;
	}

	if (mode === PriceAlertListMode.ALL) {
		const formattedProducts = productsArray.map((product : PriceAlertItem, index : number) => {
			return `${index + 1}. ${product.shop} | ${product.brand} [${product.productName}](<${product.url}>)\n`;
		});

		const list : string[] = splitMessage(formattedProducts);
		await interaction.reply({ content: list[0] });
		for (let i = 1; i < list.length; i++) {
			await interaction?.channel?.send({ content: list[i] });
		}
	}

	if (mode === PriceAlertListMode.DETAILED) {
		let pointer = 0;
		const embed = getPriceListEmbed(productsArray[pointer]);
		await interaction.reply({ embeds: [embed], components: [...getButtons(pointer, productsArray.length)] });

		const eventEmitter = new EventEmitter();
		createProductDetailButtonCollector(interaction, eventEmitter);

		eventEmitter.on(ButtonType.NEXT, async (i : CollectedMessageInteraction) => {
			if (pointer < productsArray.length - 1) {
				pointer++;
			}
			else {
				pointer = 0;
			}
			const embed = getPriceListEmbed(productsArray[pointer] as PriceAlertItem);
			await i.update({ content: "", embeds: [embed], components: [...getButtons(pointer, productsArray.length)] });
		});

		eventEmitter.on(ButtonType.PREVIOUS, async (i : CollectedMessageInteraction) => {
			if (pointer > 0) {
				pointer--;
			}
			else {
				pointer = productsArray.length - 1;
			}

			const embed = getPriceListEmbed(productsArray[pointer]);
			await i.update({ content: "", embeds: [embed], components: [...getButtons(pointer, productsArray.length)] });
		});

		eventEmitter.on(ButtonType.REMOVE, async (i : CollectedMessageInteraction) => {
			await PriceAlertModel.findOneAndDelete({ url: productsArray[pointer].url });
			productsArray.splice(pointer, 1);
			if (pointer > 0) {
				pointer--;
			}
			const embed = getPriceListEmbed(productsArray[pointer]);
			await i.update({ content: "", embeds: [embed], components: [...getButtons(pointer, productsArray.length)] });
		});

		eventEmitter.on(ButtonType.CHECK, async (i : CollectedMessageInteraction) => {
			const product = productsArray[pointer];
			const result = await getPriceChange(PriceAlertModel.hydrate(product), { skipImageFetch: true });

			handleScrapeResult(result, {
				onPriceChange: async (product) => {
					productsArray[pointer] = product;
					await i.update({ content: `Price changed for ${product.productName}`, embeds: [getPriceListEmbed(product)], components: [...getButtons(pointer, productsArray.length)] });
				},
				onFailure: async (product) => {
					await i.update({ content: `Failed to check price for ${product.productName}`, embeds: [getPriceListEmbed(product)], components: [...getButtons(pointer, productsArray.length)] });
				},
				onSuccess: async (product) => {
					productsArray[pointer] = product;
					await i.update({ content: `Price has not changed for ${product.productName}`, embeds: [getPriceListEmbed(product)], components: [...getButtons(pointer, productsArray.length)] });
				},
			});
		});
	}
}

async function createProductDetailButtonCollector(interaction: ChatInputCommandInteraction, eventEmitter: EventEmitter) {
	const filter = (i: Interaction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 300000 });

	collector?.on("collect", async (i) => {
		eventEmitter.emit(i.customId, i);
	});

	collector?.on("end", async () => {
		await interaction.editReply({ components: [] });
		eventEmitter.removeAllListeners();
	});
}

function getButtons(currentPage: number, maxPage: number) : ActionRowBuilder<ButtonBuilder>[] {
	const previous = new ButtonBuilder()
		.setCustomId(ButtonType.PREVIOUS)
		.setLabel("⬅️")
		.setStyle(ButtonStyle.Primary);
	const currentPageButton = new ButtonBuilder()
		.setCustomId("currentPage")
		.setLabel(`Item ${currentPage + 1}/${maxPage}`)
		.setStyle(ButtonStyle.Secondary);
	const next = new ButtonBuilder()
		.setCustomId(ButtonType.NEXT)
		.setLabel("➡️")
		.setStyle(ButtonStyle.Primary);
	const check = new ButtonBuilder()
		.setCustomId(ButtonType.CHECK)
		.setLabel("🔎")
		.setStyle(ButtonStyle.Success);
	const remove = new ButtonBuilder()
		.setCustomId(ButtonType.REMOVE)
		.setLabel("🗑️")
		.setStyle(ButtonStyle.Danger);

	const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(previous, currentPageButton, next);
	const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(check, remove);
	return [row1, row2];
}