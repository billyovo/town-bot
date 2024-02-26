import { ChatInputCommandInteraction } from "discord.js";
import { PriceAlertShopOption } from "~/enums/priceAlertShopOption";

export async function execute(interaction: ChatInputCommandInteraction) {
	const supportedShops = Object.values(PriceAlertShopOption).join(", ");

	interaction.reply({ content: `${supportedShops.length} supported shops: ${supportedShops}` });
}