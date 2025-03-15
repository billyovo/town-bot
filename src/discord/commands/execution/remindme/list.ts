import { ChatInputCommandInteraction, time, TimestampStyles } from "discord.js";
import { HydratedDocument } from "mongoose";
import { Reminder, ReminderModel } from "~/src/lib/database/schemas/reminders";
import { splitMessage } from "~/src/lib/utils/discord/splitMessage";

export async function execute(interaction: ChatInputCommandInteraction) {
	const userID = interaction.user.id;

	const allUserReminder : HydratedDocument<Reminder>[] = await ReminderModel.find({ owner: userID }).sort({ sendTime: 1 }).exec();

	if (allUserReminder.length === 0) {
		await interaction.reply("You do not have any reminder set");
	}

	const formattedMessage : string[] = allUserReminder.map((reminder : HydratedDocument<Reminder>, index : number) => {
		const ellipsedMessage = reminder.message.length > 50 ? `${reminder.message.substring(0, 50)}...` : reminder.message;
		return `${index + 1 }: ${time(reminder.sendTime, TimestampStyles.RelativeTime)} ${ellipsedMessage}\r\n`;
	});


	const list : string[] = splitMessage(formattedMessage);

	await interaction.reply({ content: list[0], allowedMentions: { parse: [] } });
	for (let i = 1; i < list.length; i++) {
		if (interaction.channel?.isSendable()) {
			await interaction.channel.send({ content: list[0], allowedMentions: { parse: [] } });
		}
	}
}