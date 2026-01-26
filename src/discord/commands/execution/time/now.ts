import { ChatInputCommandInteraction, TextDisplayBuilder, SeparatorBuilder, MessageFlags, ContainerBuilder, SeparatorSpacingSize, bold } from "discord.js";
import { DateTime } from "luxon";

export async function execute(interaction: ChatInputCommandInteraction) {
	const inputZone = interaction.options.getString("timezone") ?? "";
	const isInputZoneValid = DateTime.now().setZone(inputZone).isValid;
	if (inputZone && !isInputZoneValid) return interaction.reply({ content: "Invalid timezone", flags: MessageFlags.Ephemeral });

	const zones: string[] = [];
	if (inputZone) {
		zones.push(inputZone);
	}
	else {
		zones.push("Asia/Taipei");
		zones.push("Canada/Pacific");
		zones.push("Australia/Queensland");
	}
	const container = new ContainerBuilder();
	zones.forEach((zone) => {
		const dt = DateTime.now().setZone(zone);
		const title = bold(`${zone} (${dt.toFormat("ZZ")}) ${dt.isInDST ? "🌞" : ""}`);
		const time = dt.toFormat("MM/dd HH:mm");
		const text = new TextDisplayBuilder().setContent(`**${title}**\n${time}`);
		container.addTextDisplayComponents(text);
		container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Small }));
	});

	container.components.pop();

	await interaction.reply({
		components: [container],
		flags: MessageFlags.IsComponentsV2,
	});
}