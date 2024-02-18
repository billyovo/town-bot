import { ButtonStyle, ChatInputCommandInteraction, CollectedMessageInteraction, Interaction } from "discord.js";
import { db } from "~/managers/database/databaseManager";
import { PriceAlertListMode } from "~/enums/priceAlertShopOption";
import { getPriceListEmbed } from "~/assets/embeds/priceEmbeds";
import { PriceAlertItem } from "~/types/priceAlert";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { splitMessage } from "~/utils/discord/splitMessage";
import { EventEmitter } from "node:events";

enum ButtonType {
	NEXT = "next",
	PREVIOUS = "previous",
	REMOVE = "remove",
	CHECK = "check"
}
export async function execute(interaction: ChatInputCommandInteraction) {
	const mode : PriceAlertListMode = interaction.options.get("mode")?.value as PriceAlertListMode;

	const collection = db.collection("products");
	const productsCursor = collection.find({}).sort({ shop: 1 });
	const productsArray = await productsCursor.toArray();

	if (productsArray.length === 0) {
		await interaction.reply({ content: "No products found" });
		return;
	}

	if (mode === PriceAlertListMode.ALL) {
		const formattedProducts = productsArray.map((product, index) => {
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
		const embed = getPriceListEmbed(productsArray[pointer] as PriceAlertItem);
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
			await i.update({ embeds: [embed], components: [...getButtons(pointer, productsArray.length)] });
		});

		eventEmitter.on(ButtonType.PREVIOUS, async (i : CollectedMessageInteraction) => {
			if (pointer > 0) {
				pointer--;
			}
			else {
				pointer = productsArray.length - 1;
			}

			const embed = getPriceListEmbed(productsArray[pointer] as PriceAlertItem);
			await i.update({ embeds: [embed], components: [...getButtons(pointer, productsArray.length)] });
		});

		eventEmitter.on(ButtonType.REMOVE, async (i : CollectedMessageInteraction) => {
			await collection.deleteOne({ _id: productsArray[pointer]._id });
			productsArray.splice(pointer, 1);
			if (pointer > 0) {
				pointer--;
			}
			const embed = getPriceListEmbed(productsArray[pointer] as PriceAlertItem);
			await i.update({ embeds: [embed], components: [...getButtons(pointer, productsArray.length)] });
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

	const remove = new ButtonBuilder()
		.setCustomId(ButtonType.REMOVE)
		.setLabel("🗑️")
		.setStyle(ButtonStyle.Danger);

	const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(previous, currentPageButton, next);
	const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(remove);
	return [row1, row2];
}