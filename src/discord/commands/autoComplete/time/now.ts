import { AutocompleteInteraction } from "discord.js";
import * as convert from "./convert";

export async function autoComplete(interaction: AutocompleteInteraction) {
	return await convert.autoComplete(interaction);
}