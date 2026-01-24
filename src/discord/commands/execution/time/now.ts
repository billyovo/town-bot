import { ChatInputCommandInteraction, TextDisplayBuilder, SeparatorBuilder, MessageFlags } from "discord.js";
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

	const displays : (TextDisplayBuilder | SeparatorBuilder)[] = zones.flatMap((zone) => {
		const dt = DateTime.now().setZone(zone);
		const title = `${zone} (${dt.toFormat("ZZ")}) ${dt.isInDST ? "🌞" : ""}`;
		const time = dt.toFormat("MM/dd HH:mm");
		return [new TextDisplayBuilder().setContent(`**${title}**\n${time}`), new SeparatorBuilder()];
	});

	displays.pop();
	await interaction.reply({
		components: [...displays],
		flags: MessageFlags.IsComponentsV2,
	});
}