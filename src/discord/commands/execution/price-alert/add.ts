import { getAddedToAlertEmbed } from "~/src/assets/embeds/priceEmbeds";
import { addProductToAlert } from "~/src/lib/price-alert/utils/db";
import { parseShopWebsite } from "~/src/lib/price-alert/scrape/parse";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from "discord.js";
import { PriceAlertItem, PriceAlertModel } from "~/src/lib/database/schemas/product";
import { randomUUID } from "crypto";

export async function execute(interaction: ChatInputCommandInteraction) {
	const link = interaction.options.getString("url");
	const inputProductName = interaction.options.getString("name") ?? "";
	const inputProductBrand = interaction.options.getString("brand") ?? "";
	const quantity = interaction.options.getInteger("quantity") ?? 1;

	if (!link) {
		return interaction.reply({ content: "No URL received." });
	}

	const decodedURL = decodeURI(link);

	await interaction.deferReply();

	const output = await parseShopWebsite(decodedURL, null);

	if (!output.success) return await interaction.editReply({ content: output.error ?? "Unknown error" });

	const itemToBeadded : PriceAlertItem = {
		lastChecked: new Date(),
		url: decodedURL,
		price: output.data.price,
		brand: inputProductBrand || output.data.brand,
		productName: inputProductName || output.data.productName,
		productImage: output.data.productImage,
		shop: output.data.shop,
		promotions: output.data.promotions,
		quantity: quantity,
		failCount: 0,
		isEnabled: true,
	};

	const result = await addProductToAlert(itemToBeadded);
	if (!result.success) return await interaction.editReply({ content: result.error ?? "Unknown error" });

	const embed = getAddedToAlertEmbed(itemToBeadded);

	const similarProducts : PriceAlertItem[] = await PriceAlertModel.aggregate(
		[
			{
				$search: {
					autocomplete: {
						query: itemToBeadded.productName,
						path: "productName",
						fuzzy: {},
					},
				},
			},
		],
	).limit(1).exec();

	if (!similarProducts.length) {
		return await interaction.editReply({ embeds: [embed], content: "Added to price alert" });
	}

	const similarProduct : PriceAlertItem = similarProducts[0];
	const row = new ActionRowBuilder<ButtonBuilder>();
	const randomID : string = randomUUID();
	row.addComponents(
		new ButtonBuilder()
			.setLabel("Merge")
			.setStyle(ButtonStyle.Success)
			.setCustomId(`priceAlert-merge-yes-${randomID}`),
	);

	await interaction.editReply({ embeds: [embed], components: [row], content: `Found a similar product:\n**${similarProduct.brand} ${similarProduct.productName}**\n\nDo you want to merge these two products infos?` });

	const collector = interaction.channel?.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id && (i.customId === `priceAlert-merge-yes-${randomID}` || i.customId === `priceAlert-merge-no-${randomID}`), time: 20000, max: 1 });
	collector?.on("collect", async (i) => {
		if (i.customId === `priceAlert-merge-yes-${randomID}`) {
			await PriceAlertModel.updateOne({ url: itemToBeadded.url }, { productName: similarProduct.productName, brand: similarProduct.brand }).exec();
			const newEmbed = getAddedToAlertEmbed({ ...itemToBeadded, productName: similarProduct.productName, brand: similarProduct.brand });
			await interaction.editReply({ content: `Merged ${itemToBeadded.productName} into ${similarProduct.productName}`, embeds: [newEmbed] });
		}
	});
	collector?.on("end", async () => {
		await interaction.editReply({ components: [], content: "" });
	});
}