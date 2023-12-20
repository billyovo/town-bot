import { ChatInputCommandInteraction } from "discord.js";
import { db } from "@managers/database/databaseManager";
export async function execute(interaction: ChatInputCommandInteraction) {
	const collection = db.collection("products");
	const products = await collection.find({}).toArray();

	let list = "";
	for (let i = 0; i < products.length; i++) {
		list += `${i + 1} ${products[i].brand} [${products[i].productName}](${products[i].url})\n`;
	}
	await interaction.reply({ content: list });
}