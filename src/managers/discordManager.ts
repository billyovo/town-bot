import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { getAnnoucementChannel } from "../utils/discord/getAnnoucementChannel";
import config from "../configs/config.json";
export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
export let annoucementChannel : TextChannel | null = null;

client.login(process.env.DISCORD_TOKEN);
client.on("ready", async () => {
	annoucementChannel = await getAnnoucementChannel(client, config.annoucementChannelID);
	if (!annoucementChannel) {
		console.error("Annoucement channel not found! Aborting...");
		process.exit(1);
	}

	console.log(`Logged in as ${client.user?.displayName}`);
	console.log(`Found Annoucement Channel: ${annoucementChannel.name}`);
});