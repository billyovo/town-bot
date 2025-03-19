import { PriceAlertListMode } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";
import { ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
	.setName("price-alert")
	.setDescription("price alert")
	.setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
	.setContexts([InteractionContextType.Guild])
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
					.setDescription("product brand, overrides the brand in the url")
					.setRequired(false)
					.setAutocomplete(true),
			)
			.addStringOption(option =>
				option
					.setName("name")
					.setDescription("product name, overrides the name in the url")
					.setRequired(false)
					.setAutocomplete(true),
			)
			.addNumberOption(option =>
				option
					.setName("quantity")
					.setDescription("quantity")
					.setRequired(false),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName("remove")
			.setDescription("remove price alert: either by url or by shop, brand, and name")
			.addStringOption(option =>
				option
					.setName("shop")
					.setDescription("shop")
					.setRequired(false)
					.setAutocomplete(true),
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
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName("edit")
			.setDescription("edit price alert")
			.addStringOption(option =>
				option
					.setName("shop")
					.setDescription("shop")
					.setRequired(false)
					.setAutocomplete(true),
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
	);
