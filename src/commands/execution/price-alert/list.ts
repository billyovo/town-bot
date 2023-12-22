import { ButtonStyle, ChatInputCommandInteraction, Interaction } from "discord.js";
import { db } from "@managers/database/databaseManager";
import { PriceAlertListMode } from "@enums/priceAlertShopOption";
import { getAddedToAlertEmbed } from "@assets/embeds/priceEmbeds";
import { PriceAlertItem } from "../../../@types/priceAlert";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
export async function execute(interaction: ChatInputCommandInteraction) {
	const mode : PriceAlertListMode = interaction.options.get("mode")?.value as PriceAlertListMode;

	const collection = db.collection("products");
	const productsCursor = collection.find({}).sort({ shop: 1 });
	const productsArray = await productsCursor.toArray();
	if (mode === PriceAlertListMode.ALL) {
		const list : string[] = [""];
		let current = 0;
		for (let i = 0; i < productsArray.length; i++) {
			const message = `${i + 1}. ${productsArray[i].shop} | ${productsArray[i].brand} [${productsArray[i].productName}](<${productsArray[i].url}>)\n`;
			if ((list[current].length + message.length) > 2000) {
				current++;
				list[current] = "";
			}
			list[current] += message;
		}
		await interaction.reply({ content: list[0] });
		for (let i = 1; i < list.length; i++) {
			await interaction?.channel?.send({ content: list[i] });
		}
	}

	if (mode === PriceAlertListMode.DETAILED) {
		let pointer = 0;
		const embed = getAddedToAlertEmbed(productsArray[pointer] as PriceAlertItem);
		await interaction.reply({ embeds: [embed], components: [getButtons()] });

		const filter = (i: Interaction) => i.user.id === interaction.user.id;
		const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 300000 });
		collector?.on("collect", async (i) => {
			if (i.customId === "previous") {
				pointer--;
				if (pointer < 0) pointer = productsArray.length - 1;
				const embed = getListEmbed(productsArray[pointer] as PriceAlertItem, pointer, productsArray.length);
				await i.update({ embeds: [embed] });
			}
			if (i.customId === "next") {
				pointer++;
				if (pointer >= productsArray.length) pointer = 0;
				const embed = getListEmbed(productsArray[pointer] as PriceAlertItem, pointer, productsArray.length);
				await i.update({ embeds: [embed] });
			}
		});
		collector?.on("end", async () => {
			await interaction.editReply({ components: [] });
		});
	}
}


function getButtons() : ActionRowBuilder<ButtonBuilder> {
	const previous = new ButtonBuilder()
		.setCustomId("previous")
		.setLabel("⬅️")
		.setStyle(ButtonStyle.Primary);

	const next = new ButtonBuilder()
		.setCustomId("next")
		.setLabel("➡️")
		.setStyle(ButtonStyle.Primary);

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(previous, next);
	return row;
}

function getListEmbed(product: PriceAlertItem, current: number, max: number) {
	const embed = getAddedToAlertEmbed(product);
	embed.setFooter({ text: `Item ${current + 1}/${max}` });

	return embed;
}