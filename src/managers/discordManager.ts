import { Events, GatewayIntentBits } from "discord.js";
import { ExtendedDiscordClient } from "../lib/discord/client";
import { autoCompleteHandler, interactionHandler } from "../discord/events/interaction";
import { readyHandler } from "../discord/events/ready";

export const client : ExtendedDiscordClient = new ExtendedDiscordClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
	],
});

export async function connectDiscord(token : string) {
	await client.login(token);
}

client.on(Events.InteractionCreate, interactionHandler);
client.on(Events.InteractionCreate, autoCompleteHandler);
client.on(Events.ClientReady, readyHandler);

