import { BaseInteraction } from "discord.js";
import { client } from "~/src/managers/discordManager";
import { log } from "~/src/lib/logger/logger";

export function interactionHandler(interaction: BaseInteraction) {
	if (!interaction.isChatInputCommand()) return;
	const username = interaction.user.username;
	const commandName = interaction.commandName;
	log(`${username} used ${commandName}`);
	const subCommand = interaction.options.getSubcommand(false);
	const commandKey = subCommand ? `${commandName}\\${subCommand}` : commandName;
	client.commands.get(commandKey)?.execute(interaction);
}