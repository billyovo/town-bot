import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";

export async function autoComplete(interaction: AutocompleteInteraction) {
	const focusedOption : AutocompleteFocusedOption = interaction.options.getFocused(true);

	const availableZones : string[] | null = Intl.supportedValuesOf("timeZone");
	if (!availableZones || availableZones.length === 0) return;


	const filteredZones = availableZones.filter((zone) => zone.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25);

	await interaction.respond(
		filteredZones.map((zone) => ({
			name: zone,
			value: zone,
		})),
	);
}
