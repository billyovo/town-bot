import { ButtonStyle, ChatInputCommandInteraction, Interaction } from "discord.js";
import { db } from "@managers/database/databaseManager";
import { PriceAlertListMode } from "@enums/priceAlertShopOption";
import { getPriceListEmbed } from "@assets/embeds/priceEmbeds";
import { PriceAlertItem } from "../../../@types/priceAlert";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { splitMessage } from "@utils/discord/splitMessage";

export async function execute(interaction: ChatInputCommandInteraction) {
	const mode : PriceAlertListMode = interaction.options.get("mode")?.value as PriceAlertListMode;

	const collection = db.collection("products");
	const productsCursor = collection.find({}).sort({ shop: 1 });
	const productsArray = await productsCursor.toArray();

	if (productsArray.length === 0) return interaction.reply({ content: "No products found" });

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
		const pointer = 0;
		const embed = getPriceListEmbed(productsArray[pointer] as PriceAlertItem);
		createProductDetailButtonCollector(interaction, productsArray as PriceAlertItem[]);
		await interaction.reply({ embeds: [embed], components: [getButtons(pointer, productsArray.length)] });
	}
}

async function createProductDetailButtonCollector(interaction: ChatInputCommandInteraction, productsArray: PriceAlertItem[]) {
	let pointer = 0;
	const filter = (i: Interaction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 300000 });

	collector?.on("collect", async (i) => {
		let updateMessage = "";

		if (i.customId === "remove") {
			const collection = db.collection("products");
			const rul = productsArray[pointer].url;
			const result = await collection.deleteOne({ url: rul });
			if (result.deletedCount === 0) {
				await i.update({ content: "Failed to delete product" });
				return;
			}
			productsArray.splice(pointer, 1);
			if (pointer === productsArray.length - 1) pointer-- || pointer++;
			if (productsArray.length === 0) {
				await i.update({ embeds: [], content: "No products found", components: [] });
				return;
			}
			updateMessage = "Deleted product Sucessfully";
		}
		if (i.customId === "previous") {
			pointer--;
			if (pointer < 0) pointer = productsArray.length - 1;
		}
		if (i.customId === "next") {
			pointer++;
			if (pointer >= productsArray.length) pointer = 0;
		}

		const embed = getPriceListEmbed(productsArray[pointer] as PriceAlertItem);
		await i.update({ embeds: [embed], components: [getButtons(pointer, productsArray.length)], content: updateMessage });
	});

	collector?.on("end", async () => {
		await interaction.editReply({ components: [] });
	});
}

function getButtons(currentPage: number, maxPage: number) : ActionRowBuilder<ButtonBuilder> {
	const previous = new ButtonBuilder()
		.setCustomId("previous")
		.setLabel("⬅️")
		.setStyle(ButtonStyle.Primary);
	const currentPageButton = new ButtonBuilder()
		.setCustomId("currentPage")
		.setLabel(`Item ${currentPage + 1}/${maxPage}`)
		.setStyle(ButtonStyle.Secondary);
	const next = new ButtonBuilder()
		.setCustomId("next")
		.setLabel("➡️")
		.setStyle(ButtonStyle.Primary);
	const remove = new ButtonBuilder()
		.setCustomId("remove")
		.setLabel("🗑️")
		.setStyle(ButtonStyle.Danger);
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(previous, currentPageButton, next, remove);
	return row;
}