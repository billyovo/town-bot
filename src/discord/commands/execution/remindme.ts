import { ChatInputCommandInteraction } from "discord.js";
import { parseDurationStringToMills, parseMillsToHuman } from "~/src/lib/utils/time/duration";
import { DateTime, Duration } from "luxon";
import { scheduleJob } from "node-schedule";
import { ReminderModel } from "~/src/lib/database/schemas/reminders";
import { logger } from "~/src/lib/logger/logger";

export async function execute(interaction: ChatInputCommandInteraction) {
	const duration = interaction.options.getString("time", true).replace(/\s/g, "");
	const message = interaction.options.getString("message", true);
	const dm = interaction.options.getBoolean("dm", false);

	if (!dm && !interaction.channel?.isSendable()) {
		return interaction.reply({ content: "No Permission to send message in this channel!", ephemeral: true });
	}
	const parseDurationStringResult = parseDurationStringToMills(duration);

	if (!parseDurationStringResult.success) {
		return interaction.reply({ content: parseDurationStringResult.error, ephemeral: true });
	}

	const reminderTime = DateTime.now().plus(parseDurationStringResult.data);
	const reminderDuration = Duration.fromMillis(parseDurationStringResult.data);

	if (reminderDuration.as("milliseconds") < 0) {
		return interaction.reply({ content: "You can't set a reminder in the past!", ephemeral: true });
	}

	const reminderMessage = `I will ${dm ? "DM" : "remind"} you at <t:${Math.round(reminderTime.toSeconds())}:R> after ${parseMillsToHuman(reminderDuration.toMillis())}!`;

	const reminder = await ReminderModel.create({
		sendTime: reminderTime.toJSDate(),
		message: message,
		isDM: !!dm,
		owner: interaction.user.id,
		channel: dm ? null : interaction.channel!.id,
	});

	scheduleJob(reminderTime.toJSDate(), () => {
		if (dm) {
			interaction.user.send({ content: message }).catch(err => logger.error(err.message));
		}
		else if (interaction.channel?.isSendable()) {
				interaction.channel!.send({ content: message }).catch(err => logger.error(err.message));
		}
		ReminderModel.deleteOne({ _id: reminder._id }).exec();
	});
	return interaction.reply({ content: reminderMessage, ephemeral: !!dm });

}
