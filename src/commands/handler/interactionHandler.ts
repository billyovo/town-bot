import { BaseInteraction } from "discord.js";
import { client } from "../../managers/discord/discordManager";

export function handleInteraction(interaction: BaseInteraction) {
	if (!interaction.isChatInputCommand()) return;
	client.commands.get(interaction.commandName)?.execute(interaction);
}