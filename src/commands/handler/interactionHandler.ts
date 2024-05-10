import { BaseInteraction } from "discord.js";
import { client } from "~/managers/discord/discordManager";
import { logger } from "~/logger/logger";

export function handleInteraction(interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand()) return;
    const username = interaction.user.username;
    const commandName = interaction.commandName;
    logger(`${username} used ${commandName}`);
    const subCommand = interaction.options.getSubcommand(false);
    const commandKey = subCommand ? `${commandName}\\${subCommand}` : commandName;
    client.commands.get(commandKey)?.execute(interaction);
}