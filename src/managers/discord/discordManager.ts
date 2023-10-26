import { Events, GatewayIntentBits, TextChannel } from "discord.js";
import { getAnnoucementChannel } from "../../utils/discord/startup/getAnnoucementChannel";
import config from "../../configs/config.json";
import { DiscordClient } from "../../@types/discord";
import { ExtendedDiscordClient } from "./client";
import { loadSlashCommands } from "../../utils/discord/startup/loadCommands";
import { handleInteraction } from "../../commands/handler/interactionHandler";
import { updateStatus } from "../../utils/discord/updateStatus";
import { eventSchedule } from "../eventScheduleManager";
import { planTodayScheduleMessage, planTomorrowScheduleMessage } from "../../utils/discord/scheduledEvents/planScheduledEvent";

export let client : DiscordClient = new ExtendedDiscordClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
export let annoucementChannel : TextChannel | null = null;

client.login(process.env.DISCORD_TOKEN);

client.on(Events.InteractionCreate, handleInteraction);
client.on(Events.ClientReady, async () => {
	annoucementChannel = await getAnnoucementChannel(client, config.annoucementChannelID);
	client.commands = await loadSlashCommands();
	if (!annoucementChannel) {
		console.error("Annoucement channel not found! Aborting...");
		process.exit(1);
	}
	
	planTomorrowScheduleMessage({
		annoucementChannel,
		avatarURL: client.user?.avatarURL() ?? '',
	})

	planTodayScheduleMessage({
		annoucementChannel,
	})

	updateStatus(client, eventSchedule.today);
	console.log(`Logged in as ${client.user?.displayName}`);
	console.log(`Found Annoucement Channel: ${annoucementChannel.name}`);
});

