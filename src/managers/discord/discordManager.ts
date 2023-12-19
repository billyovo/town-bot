import { Events, GatewayIntentBits, TextChannel } from "discord.js";
import { DiscordClient } from "../../@types/discord";
import { ExtendedDiscordClient } from "./client";
import { loadSlashCommands } from "@utils/discord/startup/loadCommands";
import { handleInteraction } from "@commands/handler/interactionHandler";
import { logger } from "../../logger/logger";

export const client : DiscordClient = new ExtendedDiscordClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
export const annoucementChannel : TextChannel | null = null;

export async function connectDiscord(token : string) {
	await client.login(token);
}

client.on(Events.InteractionCreate, handleInteraction);

client.on(Events.ClientReady, async () => {
	client.commands = await loadSlashCommands();
	logger(`Logged in as ${client.user?.displayName}`);
});

