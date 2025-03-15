import { AutocompleteInteraction } from "discord.js";
import { Reminder, ReminderModel } from "~/src/lib/database/schemas/reminders";
import { HydratedDocument } from "mongoose";

export async function autoComplete(interaction: AutocompleteInteraction) {

	const userID = interaction.user.id;

	const allUserReminder : HydratedDocument<Reminder>[] = await ReminderModel.find({ owner: userID }).exec();

	return interaction.respond(allUserReminder.map(reminder => ({
		name: reminder.message.length > 50 ? `${reminder.message.substring(0, 50)}...` : reminder.message,
		value: reminder._id.toString(),
	})));
}
