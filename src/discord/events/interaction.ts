import { AutocompleteInteraction, BaseInteraction, ChatInputCommandInteraction } from "discord.js";
import { client } from "~/src/managers/discordManager";
import { logger } from "~/src/lib/logger/logger";

function getFullCommandName(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
	const subCommand = interaction.options.getSubcommand(false);
	return subCommand ? `${interaction.commandName}\\${subCommand}` : interaction.commandName;
}

export function interactionHandler(interaction: BaseInteraction) {
	if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
		const fullCommand = interaction.isContextMenuCommand() ? interaction.commandName : getFullCommandName(interaction);
		client.commands.get(fullCommand)?.execute(interaction);
		logger.info(`${interaction.user.username} used ${fullCommand}`);
	}
}

export function autoCompleteHandler(interaction: BaseInteraction) {
	if (!interaction.isAutocomplete()) return;

	const fullCommand = getFullCommandName(interaction);
	logger.info(`${interaction.user.username} autocompletion ${fullCommand}`);
	client.autoCompleteCommands.get(fullCommand)?.autoComplete(interaction);
}