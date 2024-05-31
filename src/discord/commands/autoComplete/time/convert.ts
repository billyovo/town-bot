import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import { getTimeZone } from "~/src/lib/time/timeZones";

export async function autoComplete(interaction: AutocompleteInteraction) {
	const focusedOption : AutocompleteFocusedOption = interaction.options.getFocused(true);

	const timeZones : string[] | null = await getTimeZone();
	if (!timeZones) return interaction.respond([]);

	const filteredTimeZones : string[] = timeZones.filter(zone => zone.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25);

	return interaction.respond(filteredTimeZones.map(zone => ({
		name: zone,
		value: zone,
	})));

}
