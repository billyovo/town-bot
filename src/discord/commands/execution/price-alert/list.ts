import { ButtonStyle, ChatInputCommandInteraction, CollectedMessageInteraction, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, TextChannel, unorderedList } from "discord.js";
import { PriceAlertListMode, PriceAlertShopParseDetails } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { getPriceListEmbed } from "~/src/assets/embeds/priceEmbeds";
import { EventEmitter } from "node:events";
import { PriceAlertGrouped, PriceAlertModel, ShopPriceItem } from "~/src/lib/database/schemas/product";
import { groupProductByNameAndBrand } from "~/src/lib/database/aggregations/product";

enum ButtonType {
	NEXT = "next",
	PREVIOUS = "previous",
	CURRENT = "currentPage",
}

export async function execute(interaction: ChatInputCommandInteraction) {
	const mode : PriceAlertListMode = interaction.options.getString("mode") as PriceAlertListMode;

	const productsArray : PriceAlertGrouped[] = await PriceAlertModel.aggregate(groupProductByNameAndBrand);

	if (productsArray.length === 0) {
		await interaction.reply({ content: "No products found" });
		return;
	}

	if (mode === PriceAlertListMode.ALL) {
		const formatted : Array<string | Array<string>> = [];
		productsArray.forEach((productGroup : PriceAlertGrouped) => {
			formatted.push(`${productGroup.brand} ${productGroup.productName}`);
			formatted.push(productGroup.shops.map((item : ShopPriceItem) => {
				const numberOfPromotion = item.promotions?.length ?? 0;
				return `${PriceAlertShopParseDetails[item.shop].emote} $${item.price} / ${item.quantity}} (${`${numberOfPromotion} promotion${numberOfPromotion ? "s" : ""}`})`;
			}));
		});

		const formattedList = unorderedList(formatted);

		await interaction.reply({ content: formattedList });
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
			const embed = getPriceListEmbed(productsArray[pointer]);
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

		eventEmitter.on(ButtonType.CURRENT, async (i : CollectedMessageInteraction) => {
			await i.showModal(getInputModal());
			const filter = (i: Interaction) => i.user.id === interaction.user.id;
			const receivedPageNumberInteraction = await interaction.awaitModalSubmit({ filter, time: 30000 });

			const receivedPageNumber = parseInt(receivedPageNumberInteraction.fields.getTextInputValue("pageNumberInput"));
			if (!Number.isInteger(receivedPageNumber) || (receivedPageNumber < 1) || (receivedPageNumber > productsArray.length)) {
				await receivedPageNumberInteraction.reply({ content: "Invalid page number", ephemeral: true });
				return;
			}
			pointer = receivedPageNumber - 1;
			const embed = getPriceListEmbed(productsArray[pointer]);

			// we already replied to the interaction with i.showModal, so we can just edit the message, blame @discord
			// and we need to reply to the modal interaction to prevent error as well, thanks @discord
			await i.message.edit({ content: "", embeds: [embed], components: [...getButtons(pointer, productsArray.length)] });
			await receivedPageNumberInteraction.reply({ content: `Jumped to page ${receivedPageNumber}`, ephemeral: true });

		});
	}
}

async function createProductDetailButtonCollector(interaction: ChatInputCommandInteraction, eventEmitter: EventEmitter) {
	const filter = (i: Interaction) => i.user.id === interaction.user.id;
	const collector = interaction?.channel instanceof TextChannel ? interaction.channel.createMessageComponentCollector({ filter, time: 300000 }) : null;

	if (!collector) return;

	collector?.on("collect", async (i) => {
		eventEmitter.emit(i.customId, i);
	});

	collector?.on("end", async () => {
		await interaction.editReply({ components: [] });
		eventEmitter.removeAllListeners();
	});
}

function getInputModal() : ModalBuilder {
	const pageNumberModal = new ModalBuilder()
		.setCustomId("pageNumberModal")
		.setTitle("Enter page number");

	const pageNumberInput = new TextInputBuilder()
		.setCustomId("pageNumberInput")
		.setPlaceholder("Enter page number...")
		.setLabel("Page Number")
		.setMaxLength(3)
		.setMinLength(1)
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const row = new ActionRowBuilder<TextInputBuilder>().addComponents(pageNumberInput);
	pageNumberModal.addComponents(row);

	return pageNumberModal;
}
function getButtons(currentPage: number, maxPage: number) : ActionRowBuilder<ButtonBuilder>[] {
	const previous = new ButtonBuilder()
		.setCustomId(ButtonType.PREVIOUS)
		.setLabel("⬅️")
		.setStyle(ButtonStyle.Primary);
	const currentPageButton = new ButtonBuilder()
		.setCustomId(ButtonType.CURRENT)
		.setLabel(`Item ${currentPage + 1}/${maxPage}`)
		.setStyle(ButtonStyle.Secondary);
	const next = new ButtonBuilder()
		.setCustomId(ButtonType.NEXT)
		.setLabel("➡️")
		.setStyle(ButtonStyle.Primary);

	const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(previous, currentPageButton, next);
	return [row1];
}