import { ChatInputCommandInteraction } from "discord.js";
import { parseDurationStringToMills, parseMillsToHuman } from "~/src/lib/utils/time/duration";
import { DateTime, Duration } from "luxon";
import { scheduleJob } from "node-schedule";
import { ReminderModel } from "~/src/lib/database/schemas/reminders";
import { logger } from "~/src/lib/logger/logger";
import { Failure, Success } from "~/src/@types/utils";

function getCorrectDuration(timeInput : string) : Success<Duration> | Failure {
	const errorMessages : string[] = [];
	// parse time in YYYY-MM-DD HH:MM:SS, then by MM-DD-YYYY HH:MM:SS
	const timeWithYear = DateTime.fromFormat(timeInput, "dd/MM/yyyy HH:mm");
	if (timeWithYear.isValid) {
		return {
			success: true,
			data: Duration.fromMillis(timeWithYear.diff(DateTime.now()).as("milliseconds")),
		};
	}
	errorMessages.push("Input is not in dd/MM/yyyy HH:mm");

	const timeNoYear = DateTime.fromFormat(timeInput, "dd/MM HH:mm");
	if (timeNoYear.isValid) {
		return {
			success: true,
			data: Duration.fromMillis(timeNoYear.diff(DateTime.now()).as("milliseconds")),
		};
	}
	errorMessages.push("Input is not in dd/MM HH:mm");

	const durationString = parseDurationStringToMills(timeInput.replace(/\s/g, ""));
	if (durationString.success) {
		return {
			success: true,
			data: Duration.fromMillis(durationString.data),
		};
	}
	errorMessages.push(durationString.error);
	return {
		success: false,
		error: errorMessages.join("\r\n"),
		data: null,
	};
}

export async function execute(interaction: ChatInputCommandInteraction) {
	const timeInput = interaction.options.getString("time", true);
	const message = interaction.options.getString("message", true);
	const dm = interaction.options.getBoolean("dm", false);

	if (!dm && !interaction.channel?.isSendable()) {
		return interaction.reply({ content: "No Permission to send message in this channel!", ephemeral: true });
	}

	const reminderDuration = getCorrectDuration(timeInput);
	if (!reminderDuration.success) {
		return interaction.reply({ content: reminderDuration.error, ephemeral: true });
	}

	if (reminderDuration.data.as("milliseconds") < 0) {
		return interaction.reply({ content: "You can't set a reminder in the past!", ephemeral: true });
	}

	const reminderTime : DateTime = DateTime.now().plus(reminderDuration.data);
	const reminderMessage = `I will ${dm ? "DM" : "remind"} you at <t:${Math.round(reminderTime.toSeconds())}:R> after ${parseMillsToHuman(reminderDuration.data.toMillis())}!`;

	const reminder = await ReminderModel.create({
		sendTime: reminderTime.toJSDate(),
		message: message,
		isDM: !!dm,
		owner: interaction.user.id,
		channel: dm ? null : interaction.channel!.id,
	});

	scheduleJob(reminder._id.toString(), reminderTime.toJSDate(), () => {
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
