import { AutocompleteInteraction, BaseInteraction, ChatInputCommandInteraction } from "discord.js";
import { client } from "~/src/managers/discordManager";
import { log } from "~/src/lib/logger/logger";

function writeCommandLog(username: string, commandName: string) {
	log(`${username} used ${commandName}`);
}

function getFullCommandName(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
	const subCommand = interaction.options.getSubcommand(false);
	return subCommand ? `${interaction.commandName}\\${subCommand}` : interaction.commandName;
}

export function interactionHandler(interaction: BaseInteraction) {
	if (!interaction.isChatInputCommand()) return;
	writeCommandLog(interaction.user.username, interaction.commandName);

	const fullCommand = getFullCommandName(interaction);
	client.commands.get(fullCommand)?.execute(interaction);
}

export function autoCompleteHandler(interaction: BaseInteraction) {
	if (!interaction.isAutocomplete()) return;
	writeCommandLog(interaction.user.username, interaction.commandName);

	const fullCommand = getFullCommandName(interaction);
	client.autoCompleteCommands.get(fullCommand)?.autoComplete(interaction);
}