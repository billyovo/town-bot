import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { PriceAlertItem, PriceAlertModel } from "~/src/lib/database/schemas/product";
import { randomUUID } from "crypto";

enum ProductEditFields {
	NAME = "name",
	BRAND = "brand",
	IMAGE = "image",
	MODAL = "edit_product",
	QUANTITY = "quantity"
}

export async function execute(interaction: ChatInputCommandInteraction) {
	const url = interaction.options.getString("url") ?? "";
	const shop = interaction.options.getString("shop") ?? "";
	const brand = interaction.options.getString("brand") ?? "";
	const productName = interaction.options.getString("name") ?? "";

	const randomID : string = randomUUID();

	if (!(url || (brand && productName && shop))) {
		return interaction.reply({ content: "Please provide a URL or both a brand and a product name" });
	}

	const product = await getProductFromInputDetails(url, shop, brand, productName);
	if (!product) return interaction.reply({ content: "Product not found" });

	const productEditModal : ModalBuilder = getProductEditModal(product, randomID);
	await interaction.showModal(productEditModal);

	const filter = (interaction : ModalSubmitInteraction) => interaction.customId === `${ProductEditFields.MODAL}-${randomID}`;
	const response : ModalSubmitInteraction = await interaction.awaitModalSubmit({ filter, time: 180000 });

	const newProductName : string = response.fields.getTextInputValue(`${ProductEditFields.NAME}-${randomID}`);
	const newBrand : string = response.fields.getTextInputValue(`${ProductEditFields.BRAND}-${randomID}`) || "";
	const newImage : string = response.fields.getTextInputValue(`${ProductEditFields.IMAGE}-${randomID}`) || "";
	const newQuantity : number = parseInt(response.fields.getTextInputValue(`${ProductEditFields.QUANTITY}-${randomID}`)) || 1;

	await PriceAlertModel.updateOne({ url: product.url }, { productName: newProductName, brand: newBrand, productImage: newImage, quantity: newQuantity });

	await response.reply({ content: `Updated ${product.productName} of ${product.brand} to [${newProductName}](${product.url}) of ${newBrand}` });
}

function getProductEditModal(product : PriceAlertItem, UUID: string) : ModalBuilder {
	const productEditModal = new ModalBuilder()
		.setCustomId(`${ProductEditFields.MODAL}-${UUID}`)
		.setTitle("Edit Product");

	const productNameField = new TextInputBuilder()
		.setCustomId(`${ProductEditFields.NAME}-${UUID}`)
		.setPlaceholder("Product Name")
		.setValue(product.productName)
		.setLabel("Product Name")
		.setRequired(true)
		.setStyle(TextInputStyle.Short)
		.setMinLength(1);

	const brandField = new TextInputBuilder()
		.setCustomId(`${ProductEditFields.BRAND}-${UUID}`)
		.setPlaceholder("Brand")
		.setValue(product.brand)
		.setLabel("Brand")
		.setRequired(true)
		.setStyle(TextInputStyle.Short)
		.setMinLength(1);

	const quantityField = new TextInputBuilder()
		.setCustomId(`${ProductEditFields.QUANTITY}-${UUID}`)
		.setPlaceholder("Quantity")
		.setValue(product.quantity.toString())
		.setLabel("Quantity")
		.setRequired(true)
		.setStyle(TextInputStyle.Short)
		.setMinLength(1);

	const imageField = new TextInputBuilder()
		.setCustomId(`${ProductEditFields.IMAGE}-${UUID}`)
		.setPlaceholder("Image URL")
		.setLabel("Image URL")
		.setValue(product.productImage ?? "")
		.setStyle(TextInputStyle.Short)
		.setRequired(false);


	const firstRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents([productNameField]);
	const secondRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents([brandField]);
	const thirdRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents([quantityField]);
	const forthRow : ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents([imageField]);

	productEditModal.addComponents([firstRow, secondRow, thirdRow, forthRow]);

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