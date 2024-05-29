import { AutocompleteInteraction } from "discord.js";
import { PriceAlertModel } from "~/src/lib/database/schemas/product";

export async function autoComplete(interaction : AutocompleteInteraction) {
	const focusedOption = interaction.options.getFocused(true);

	const productName = interaction.options.getString("name") ?? "";
	const brand = interaction.options.getString("brand") ?? "";
	const shop = interaction.options.getString("shop") ?? "";

	const productNameQuery = productName ? { $regex: productName, $options: "i" } : { $exists: true };
	const brandQuery = brand ? { $regex: brand, $options: "i" } : { $exists: true };
	const shopQuery = shop ? { $regex: shop, $options: "i" } : { $exists: true };

	const groupQuery : {
        [key: string]: string;
    } = {};

	// whichever option is focused, we want to use that as the key in the group query
	groupQuery[focusedOption.name] = `$${focusedOption.name}`;

	const products = await PriceAlertModel.aggregate([
		{ $match: { productName: productNameQuery, brand: brandQuery, shop: shopQuery } },
		{ $group: { _id: groupQuery } },
		{ $limit: 15 },
	]).exec();

	return await interaction.respond(
		products.map(product => ({
			name: product._id[focusedOption.name],
			value: product._id[focusedOption.name],
		}),
		));
}