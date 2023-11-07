import { BaseInteraction } from "discord.js";
import { client } from "@managers/discord/discordManager";
import { logger } from "../../logger/logger";

export function handleInteraction(interaction: BaseInteraction) {
	if (!interaction.isChatInputCommand()) return;
	logger(`${interaction.user.username} used ${interaction.commandName}`);
	client.commands.get(interaction.commandName)?.execute(interaction);
}