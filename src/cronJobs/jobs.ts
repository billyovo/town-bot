import { scheduleJob } from "node-schedule";
import { eventSchedule, updateEventSchedule } from "../managers/eventScheduleManager";
import { checkTodayScheduleMessage, checkTomorrowScheduleMessage } from "../utils/discord/scheduledMessages/checkScheduledMessages";
import { annoucementChannel } from "../managers/discord/discordManager";
import { Guild, TextChannel } from "discord.js";
import { checkGuildScheduledEvents } from "../utils/discord/guildScheduledEvents/checkGuildScheduledEvents";

// daily updates schedule and messages
scheduleJob("1 0 * * *", async () => {
	console.log("Updated Event Schedule!");
	updateEventSchedule();

	checkTodayScheduleMessage({
		annoucementChannel: annoucementChannel as TextChannel,
		todayEvents: eventSchedule.today,
	});

	checkTomorrowScheduleMessage({
		annoucementChannel: annoucementChannel as TextChannel,
		avatarURL: "",
		tomorrowEvents: eventSchedule.tomorrow,
	});

	await checkGuildScheduledEvents({
		guild: annoucementChannel?.guild as Guild,
		eventList: eventSchedule.list,
	});
});