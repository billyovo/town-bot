import { AutocompleteInteraction } from "discord.js";
import { PriceAlertModel } from "~/src/lib/database/schemas/product";

export async function autoComplete(interaction : AutocompleteInteraction) {
	const focusedOption = interaction.options.getFocused(true);

	const productName = interaction.options.getString("name") ?? "";
	const brand = interaction.options.getString("brand") ?? "";
	const shop = interaction.options.getString("shop") ?? "";

	const productNameQuery = productName ? { productName: productName } : {};
	const brandQuery = brand ? { brand: brand } : { };
	const shopQuery = shop ? { shop: shop } : { };

	const groupQuery : {
        [key: string]: string;
    } = {};

	// whichever option is focused, we want to use that as the key in the group query
	if (focusedOption.name === "name") {
		groupQuery.productName = "$productName";
	}

	if (focusedOption.name === "brand") {
		groupQuery.brand = "$brand";
	}

	if (focusedOption.name === "shop") {
		groupQuery.shop = "$shop";
	}

	const products = await PriceAlertModel.aggregate([
		{ $match: { isEnabled: false, ...productNameQuery, ...brandQuery, ...shopQuery } },
		{ $group: { _id: groupQuery } },
		{ $limit: 15 },
	]).exec();

	if (focusedOption.name === "name") {
		return interaction.respond(products.map(product => ({
			name: product._id.productName,
			value: product._id.productName,
		})));
	}

	if (focusedOption.name === "brand") {
		return interaction.respond(products.map(product => ({
			name: product._id.brand,
			value: product._id.brand,
		})),
		);
	}

	if (focusedOption.name === "shop") {
		return interaction.respond(products.map(product => ({
			name: product._id.shop,
			value: product._id.shop,
		})),
		);
	}

}