import { ActivityType, TextChannel } from "discord.js";
import { loadAutoCompleteCommands, loadSlashCommands } from "~/src/lib/discord/loadCommands";
import { log } from "~/src/lib/logger/logger";
import { getCatFact } from "~/src/lib/utils/catFact";
import { ReminderModel } from "~/src/lib/database/schemas/reminders";
import { scheduleJob } from "node-schedule";
import { client } from "~/src/managers/discordManager";

export async function readyHandler() {
	client.commands = await loadSlashCommands();
	client.autoCompleteCommands = await loadAutoCompleteCommands();

	log(`Logged in as ${client.user?.displayName}`);

	const catFact = await getCatFact();
	client.user!.setActivity({ name: catFact, type: ActivityType.Custom });

	const reminders = ReminderModel.find().lean().cursor();

	for await (const reminder of reminders) {
		if (reminder.sendTime.getTime() < Date.now()) {
			ReminderModel.deleteOne({ _id: reminder._id }).exec();
			continue;
		}
		scheduleJob(reminder.sendTime, () => {
			log(`Found reminder for ${reminder.owner} at ${reminder.sendTime}!`);
			if (reminder.isDM) {
				client.users.fetch(reminder.owner).then(user => user.send({ content: reminder.message }))
					.catch(err => log(`Failed to send reminder to ${reminder.owner}! ${err.message}`));
			}
			else {
				client.channels.fetch(reminder.channel).then(channel => (channel as TextChannel).send({ content: reminder.message }))
					.catch(err => log(`Failed to send reminder to ${reminder.owner}! ${err.message}`));
			}
			ReminderModel.deleteOne({ _id: reminder._id }).exec();
		});
	}

}