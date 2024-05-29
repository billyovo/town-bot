import { AutocompleteInteraction, BaseInteraction, ChatInputCommandInteraction } from "discord.js";
import { client } from "~/src/managers/discordManager";
import { log } from "~/src/lib/logger/logger";

function getFullCommandName(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
	const subCommand = interaction.options.getSubcommand(false);
	return subCommand ? `${interaction.commandName}\\${subCommand}` : interaction.commandName;
}

export function interactionHandler(interaction: BaseInteraction) {
	if (!interaction.isChatInputCommand()) return;

	const fullCommand = getFullCommandName(interaction);
	log(`${interaction.user.username} used ${fullCommand}`);
	client.commands.get(fullCommand)?.execute(interaction);
}

export function autoCompleteHandler(interaction: BaseInteraction) {
	if (!interaction.isAutocomplete()) return;

	const fullCommand = getFullCommandName(interaction);
	log(`${interaction.user.username} autocompletion ${fullCommand}`);
	client.autoCompleteCommands.get(fullCommand)?.autoComplete(interaction);
}