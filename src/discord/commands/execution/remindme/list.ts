import { ChatInputCommandInteraction, MessageFlags, orderedList, time, TimestampStyles } from "discord.js";
import { HydratedDocument } from "mongoose";
import { Reminder, ReminderModel } from "~/src/lib/database/schemas/reminders";
export async function execute(interaction: ChatInputCommandInteraction) {
	const userID = interaction.user.id;

	const allUserReminder : HydratedDocument<Reminder>[] = await ReminderModel.find({ owner: userID }).sort({ sendTime: 1 }).exec();

	if (allUserReminder.length === 0) {
		await interaction.reply({
			content: "You do not have any reminder set",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const formattedMessage : string[] = allUserReminder.map((reminder : HydratedDocument<Reminder>) => {
		const ellipsedMessage = reminder.message.length > 50 ? `${reminder.message.substring(0, 50)}...` : reminder.message;
		return `${time(reminder.sendTime, TimestampStyles.RelativeTime)} ${ellipsedMessage}`;
	});

	await interaction.reply({
		content: orderedList(formattedMessage),
		allowedMentions: {
			parse: [],
		},
	});
}