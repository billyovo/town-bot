import { PriceAlertListMode } from "../../enums/priceAlertShopOption";
import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("price-alert")
	.setDescription("price alert")
	.addSubcommand(subcommand =>
		subcommand
			.setName("check")
			.setDescription("check price alerts"),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName("add")
			.setDescription("add price alert")
			.addStringOption(option =>
				option
					.setName("url")
					.setDescription("url")
					.setRequired(true),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName("remove")
			.setDescription("remove price alert")
			.addStringOption(option =>
				option
					.setName("url")
					.setDescription("url")
					.setRequired(true),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName("list")
			.setDescription("list price alerts")
			.addStringOption(option =>
				option.setName("mode")
					.setDescription("mode")
					.setRequired(true)
					.addChoices(
						{
							name: "all",
							value: PriceAlertListMode.ALL,
						},
						{
							name: "detailed",
							value: PriceAlertListMode.DETAILED,
						},
					),
			),
	);
