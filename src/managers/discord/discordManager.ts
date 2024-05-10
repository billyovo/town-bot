import { ActivityType, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { DiscordClient } from "~/types/discord";
import { ExtendedDiscordClient } from "./client";
import { loadSlashCommands } from "~/utils/discord/startup/loadCommands";
import { handleInteraction } from "~/commands/handler/interactionHandler";
import { logger } from "~/logger/logger";
import { getCatFact } from "~/utils/catFact";
import { ReminderModel } from "~/database/schemas/reminders";
import { scheduleJob } from "node-schedule";

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

client.on(Events.InteractionCreate, handleInteraction);

client.on(Events.ClientReady, async () => {
	client.commands = await loadSlashCommands();
	logger(`Logged in as ${client.user?.displayName}`);

	const catFact = await getCatFact();
	client.user!.setActivity({ name: catFact, type: ActivityType.Custom });

	const reminders = ReminderModel.find().cursor();

	for await (const reminder of reminders) {
		if (reminder.sendTime.getTime() < Date.now()) {
			ReminderModel.deleteOne({ _id: reminder._id }).exec();
			continue;
		}
		scheduleJob(reminder.sendTime, () => {
			logger(`Found reminder for ${reminder.owner} at ${reminder.sendTime}!`);
			if (reminder.isDM) {
				client.users.fetch(reminder.owner).then(user => user.send({ content: reminder.message }))
					.catch(err => logger(`Failed to send reminder to ${reminder.owner}! ${err.message}`));
			}
			else {
				client.channels.fetch(reminder.channel).then(channel => (channel as TextChannel).send({ content: reminder.message }))
					.catch(err => logger(`Failed to send reminder to ${reminder.owner}! ${err.message}`));
			}
			ReminderModel.deleteOne({ _id: reminder._id }).exec();
		});
	}


});

