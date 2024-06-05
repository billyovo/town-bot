import { Events, GatewayIntentBits } from "discord.js";
import { ExtendedDiscordClient } from "../lib/discord/client";
import { autoCompleteHandler, interactionHandler } from "../discord/events/interaction";
import { readyHandler } from "../discord/events/ready";
import { twitterMessageCreateHandler, twitterMessageReactHandler } from "../discord/events/messages/fxtwitterMessage";

export const client: ExtendedDiscordClient = new ExtendedDiscordClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessageReactions,
	],
});

export async function connectDiscord(token: string) {
	await client.login(token);
}

client.on(Events.InteractionCreate, interactionHandler);
client.on(Events.InteractionCreate, autoCompleteHandler);
client.on(Events.ClientReady, readyHandler);
client.on(Events.MessageCreate, twitterMessageCreateHandler);
client.on(Events.MessageReactionAdd, twitterMessageReactHandler);
