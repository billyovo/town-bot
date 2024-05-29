import { AutocompleteInteraction } from "discord.js";
import * as add from "./add";

export function autoComplete(interaction: AutocompleteInteraction) {
	return add.autoComplete(interaction);
}