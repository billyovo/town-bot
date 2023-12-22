import { ChatInputCommandInteraction } from "discord.js";
import { db } from "@managers/database/databaseManager";
export async function execute(interaction: ChatInputCommandInteraction) {
	const collection = db.collection("products");
	const products = await collection.find({}).toArray();

	const list : string[] = [""];
	let current = 0;
	for (let i = 0; i < products.length; i++) {
		const message = `${i + 1}. ${products[i].brand} [${products[i].productName}](<${products[i].url}>)\n`;
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