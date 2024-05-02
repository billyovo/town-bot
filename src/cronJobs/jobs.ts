import { HkoRainOption } from "~/enums/cronOption";
import { client } from "~/managers/discord/discordManager";
import { callhko } from "~/utils/cron/hko";
import { returnDiff } from "~/utils/cron/richDay";
import { ActivityType, Channel, ChannelType, TextChannel } from "discord.js";
import { DateTime } from "luxon";
import { scheduleJob } from "node-schedule";
import { getCatFact } from "~/utils/catFact";
import { logger } from "~/logger/logger";
import { ReminderModel } from "~/database/schemas/reminders";

scheduleJob("1 0 * * *", () => {
	const now = DateTime.now().setZone("Asia/Taipei").endOf("day");

	client.channels.fetch(process.env.HAPPY_CHANNEL as string, { force: true, cache: false })
		.then((channel: Channel | null) => {
			if (channel?.type !== ChannelType.GuildText) return;

			channel.send(`@everyone 小妹有錢人生活 ${returnDiff(now)} **POSITIVE**`);
		})
		.catch((error) => { logger(error.message); });

});

scheduleJob("0 0 * * *", async () => {
	const catFact = await getCatFact();
  client.user!.setActivity({ name: catFact, type: ActivityType.Custom });
});

scheduleJob("0 6 * * *", async () => {
	try {
		const respone = await callhko();
		const rain = respone.data.weatherForecast[0].PSR;
		if (rain === HkoRainOption.HIGH || rain === HkoRainOption.MEDIUM_HIGH) {
			const reminderTime = DateTime.now().plus({ days: 1 });
			const message = "出門口記得帶遮!!!!!!!!!!";
			const reminder = await ReminderModel.create({
				sendTime: reminderTime,
				message: message,
				isDm: false,
				owner: process.env.CLIENT_ID,
				channel: process.env.WEATHER_CHANNEL,
			});

			scheduleJob(reminderTime.toJSDate(), () => {
				client.channels.fetch((process.env.WEATHER_CHANNEL) as string, { force: true, cache: false })
					.then((channel: Channel | null) => {
						(channel as TextChannel).send(message);
					})
					.catch((error) => { logger(error.message); });
				ReminderModel.deleteOne({ _id: reminder.id }).exec();
			});
		}
	}
	catch (error) {
		if (error instanceof Error) {
			logger(error.message);
		}
	}
});
