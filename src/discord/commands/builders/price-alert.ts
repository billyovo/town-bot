import { PriceAlertListMode } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
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
			)
			.addStringOption(option =>
				option
					.setName("brand")
					.setDescription("brand")
					.setRequired(false)
					.setAutocomplete(true),
			)
			.addStringOption(option =>
				option
					.setName("name")
					.setDescription("product name")
					.setRequired(false)
					.setAutocomplete(true),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName("remove")
			.setDescription("remove price alert")
			.addStringOption(option =>
				option
					.setName("shop")
					.setDescription("shop")
					.setRequired(false),
			)
			.addStringOption(option =>
				option
					.setName("brand")
					.setDescription("brand")
					.setRequired(false)
					.setAutocomplete(true),
			)
			.addStringOption(option =>
				option
					.setName("name")
					.setDescription("product name")
					.setRequired(false)
					.setAutocomplete(true),
			)
			.addStringOption(option =>
				option
					.setName("url")
					.setDescription("product url")
					.setRequired(false),
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
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName("supported")
			.setDescription("check supported shops"),
	);
