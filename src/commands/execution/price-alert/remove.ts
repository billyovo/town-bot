import { ChatInputCommandInteraction } from "discord.js";
import { db } from "@managers/database/databaseManager";

export async function execute(interaction: ChatInputCommandInteraction) {
	const url = interaction.options.get("url")?.value as string;

	const collection = db.collection("products");
	const result = await collection.deleteOne({ url: url });
	if (result.deletedCount === 0) return interaction.reply({ content: "Failed to delete product" });
	interaction.reply({ content: "Deleted product Sucessfully" });

}