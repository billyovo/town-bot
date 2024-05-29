import { AutocompleteInteraction } from "discord.js";
import { PriceAlertModel } from "~/src/lib/database/schemas/product";

type AutoCompleteGroupQuery = {
    productName?: "$productName",
    brand?: "$brand"
}

export async function autoComplete(interaction : AutocompleteInteraction) {
	const focusedOption = interaction.options.getFocused(true);

	const productName = interaction.options.getString("name") ?? "";
	const brand = interaction.options.getString("brand") ?? "";

	const productNameQuery = productName ? { $regex: productName, $options: "i" } : { $exists: true };
	const brandQuery = brand ? { $regex: brand, $options: "i" } : { $exists: true };
	const groupQuery : AutoCompleteGroupQuery = {};

	if (focusedOption.name === "name") {
		groupQuery["productName"] = "$productName";
	}

	if (focusedOption.name === "brand") {
		groupQuery["brand"] = "$brand";
	}

	const products = await PriceAlertModel.aggregate([
		{ $match: { productName: productNameQuery, brand: brandQuery } },
		{ $group: { _id: groupQuery } },
		{ $limit: 15 },
	]).exec();

	if (focusedOption.name === "name") {
		return await interaction.respond(
			products.map(product => ({
				name: product._id.productName,
				value: product._id.productName,
			}),
			));
	}

	if (focusedOption.name === "brand") {
		return await interaction.respond(
			products.map(product => ({
				name: product._id.brand,
				value: product._id.brand,
			}),
			));
	}

	return await interaction.respond([]);
}