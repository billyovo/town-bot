import { scheduleJob } from "node-schedule";
import { eventSchedule, updateEventSchedule } from "../managers/eventScheduleManager";
import { checkTodayScheduleMessage, checkTomorrowScheduleMessage } from "../utils/discord/scheduledMessages/checkScheduledMessages";
import { annoucementChannel, client } from "../managers/discord/discordManager";
import { Guild, TextChannel } from "discord.js";
import { checkGuildScheduledEvents } from "../utils/discord/guildScheduledEvents/checkGuildScheduledEvents";
import { sendMazeTodayMessage, sendMazeTomorrowMessage } from "../utils/discord/scheduledMessages/mazeMessages";
// daily updates schedule and messages
scheduleJob("1 0 * * *", async () => {
	updateEventSchedule();

	checkTodayScheduleMessage({
		annoucementChannel: annoucementChannel as TextChannel,
		todayEvents: eventSchedule.today,
	});

	checkTomorrowScheduleMessage({
		annoucementChannel: annoucementChannel as TextChannel,
		avatarURL: client.user?.displayAvatarURL() ?? "",
		tomorrowEvents: eventSchedule.tomorrow,
	});

	await checkGuildScheduledEvents({
		guild: annoucementChannel?.guild as Guild,
		eventList: eventSchedule.list,
	});
});

scheduleJob("0 12 14 * *", () => {
	sendMazeTomorrowMessage({
		announcementChannel: annoucementChannel as TextChannel,
		avatar: client.user?.displayAvatarURL() ?? "",
	});
});

scheduleJob("0 14 15 * *", () => {
	sendMazeTodayMessage({ annoucementChannel: annoucementChannel as TextChannel });
});