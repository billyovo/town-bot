import { BaseInteraction } from "discord.js";
import { client } from "~/managers/discord/discordManager";
import { logger } from "~/logger/logger";

export function handleInteraction(interaction: BaseInteraction) {
	if (!interaction.isChatInputCommand()) return;
	logger(`${interaction.user.username} used ${interaction.commandName}`);
	const subCommand = interaction.options.getSubcommand(false);
	client.commands.get(`${interaction.commandName}${subCommand ? `\\${subCommand}` : ""}`)?.execute(interaction);
}