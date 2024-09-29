import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { PriceAlertItem, PriceAlertModel } from "~/src/lib/database/schemas/product";

enum ProductEditFields {
	NAME = "name",
	BRAND = "brand",
	IMAGE = "image",
	MODAL = "edit_product"
}

export async function execute(interaction: ChatInputCommandInteraction) {
	const url = interaction.options.getString("url") ?? "";
	const shop = interaction.options.getString("shop") ?? "";
	const brand = interaction.options.getString("brand") ?? "";
	const productName = interaction.options.getString("name") ?? "";

	if (!(url || (brand && productName && shop))) {
		return interaction.reply({ content: "Please provide a URL or both a brand and a product name" });
	}

	const product = await getProductFromInputDetails(url, shop, brand, productName);
	if (!product) return interaction.reply({ content: "Product not found" });

	const productEditModal : ModalBuilder = getProductEditModal(product);
	await interaction.showModal(productEditModal);

	const filter = (interaction : ModalSubmitInteraction) => interaction.customId === ProductEditFields.MODAL;
	const response : ModalSubmitInteraction = await interaction.awaitModalSubmit({ filter, time: 180000 });

	const newProductName : string = response.fields.getTextInputValue(ProductEditFields.NAME);
	const newBrand : string = response.fields.getTextInputValue(ProductEditFields.BRAND);
	const newImage : string = response.fields.getTextInputValue(ProductEditFields.IMAGE) || "";

	await PriceAlertModel.updateOne({ url: product.url }, { productName: newProductName, brand: newBrand, productImage: newImage });

	await response.reply({ content: `Updated [${newProductName}](${product.url}) from ${product.shop} successfully` });
}

function getProductEditModal(product : PriceAlertItem) : ModalBuilder {
	const productEditModal = new ModalBuilder()
		.setCustomId(ProductEditFields.MODAL)
		.setTitle("Edit Product");

	const productNameField = new TextInputBuilder()
		.setCustomId(ProductEditFields.NAME)
		.setPlaceholder("Product Name")
		.setValue(product.productName)
		.setLabel("Product Name")
		.setRequired(true)
		.setStyle(TextInputStyle.Short)
		.setMinLength(1);

	const brandField = new TextInputBuilder()
		.setCustomId(ProductEditFields.BRAND)
		.setPlaceholder("Brand")
		.setValue(product.brand)
		.setLabel("Brand")
		.setRequired(true)
		.setStyle(TextInputStyle.Short)
		.setMinLength(1);

	const imageField = new TextInputBuilder()
		.setCustomId(ProductEditFields.IMAGE)
		.setPlaceholder("Image URL")
		.setLabel("Image URL")
		.setValue(product.productImage ?? "")
		.setStyle(TextInputStyle.Short)
		.setRequired(false);

	const firstRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents([productNameField]);
	const secondRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents([brandField]);
	const thirdRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents([imageField]);

	productEditModal.addComponents([firstRow, secondRow, thirdRow]);

	return productEditModal;
}

async function getProductFromInputDetails(url : string, shop : string, brand : string, productName : string) : Promise<PriceAlertItem | null> {
	let query = {};

	if (url) {
		query = { url: decodeURI(url) };
	}
	else {
		query = { productName: productName, brand: brand, shop: shop };
	}

	const product : PriceAlertItem | null = await PriceAlertModel.findOne(query).exec();
	return product;
}