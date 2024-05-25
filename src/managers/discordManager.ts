import { Events, GatewayIntentBits } from "discord.js";
import { DiscordClient } from "~/src/@types/discord";
import { ExtendedDiscordClient } from "../lib/discord/client";
import { interactionHandler } from "../discord/events/interaction";
import { readyHandler } from "../discord/events/ready";

export const client : DiscordClient = new ExtendedDiscordClient({
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
client.on(Events.ClientReady, readyHandler);

