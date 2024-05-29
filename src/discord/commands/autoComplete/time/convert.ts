import { AutocompleteInteraction } from "discord.js";
import { getTimeZone } from "~/src/lib/utils/fetch/timeZones";

export async function autoComplete(interaction: AutocompleteInteraction) {
	const focusedOption = interaction.options.getFocused(true);

	if (focusedOption.name === "time") {
		return;
	}

	let timeZones = await getTimeZone();
	if (timeZones === null) {
		timeZones = ["Australia/Queensland", "Asia/Hong_Kong", "America/Vancouver"];
	}

	const filteredTimeZones = timeZones.filter(zone => zone.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25);

	return interaction.respond(filteredTimeZones.map(zone => ({
		name: zone,
		value: zone,
	})));

}
