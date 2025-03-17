import { ChatInputCommandInteraction, MessageFlags, time, TimestampStyles } from "discord.js";
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

	const formattedMessage : string[] = allUserReminder.map((reminder : HydratedDocument<Reminder>, index : number) => {
		const ellipsedMessage = reminder.message.length > 50 ? `${reminder.message.substring(0, 50)}...` : reminder.message;
		return `${index + 1 }: ${time(reminder.sendTime, TimestampStyles.RelativeTime)} ${ellipsedMessage}\r\n`;
	});

	await interaction.reply({
		content: formattedMessage.join("\r\n"),
		allowedMentions: {
			parse: [],
		},
	});
}