import { HkoRainOption } from "~/enums/cronOption";
import { client } from "~/managers/discord/discordManager";
import { callhko } from "~/utils/cron/hko";
import { returnDiff } from "~/utils/cron/richDay";
import { ActivityType, Channel, ChannelType, TextChannel } from "discord.js";
import { DateTime } from "luxon";
import { scheduleJob } from "node-schedule";
import { getCatFact } from "~/utils/catFact";
import { logger } from "~/logger/logger";

scheduleJob("1 0 * * *", () => {
	const now = DateTime.now().setZone("Asia/Taipei").endOf("day");

	client.channels.fetch(process.env.HAPPY_CHANNEL as string, { force: true, cache: false })
		.then((channel : Channel | null) => {
			if (channel?.type !== ChannelType.GuildText) return;

			channel.send(`@everyone 小妹有錢人生活 ${returnDiff(now)} **POSITIVE**`);
		})
		.catch((error) => {logger(error.message);});

});

scheduleJob("0 0 * * *", async () => {
	const catFact = await getCatFact();
	client.user!.setActivity({ name: catFact, type: ActivityType.Custom });
});

scheduleJob("0 7 * * *", async () => {
	try {
		const respone = await callhko();
		const rain = respone.data.weatherForecast[0].PSR;
		if (rain === HkoRainOption.HIGH || rain === HkoRainOption.MEDIUM_HIGH) {
			client.channels.fetch((process.env.WEATHER_CHANNEL) as string, { force: true, cache: false })
				.then((channel : Channel | null) => {
					(channel as TextChannel).send("出門口記得帶遮!!!!!!!!!!");
				})
				.catch((error) => {logger(error.message);});
		}
	}
	catch (error) {
		if (error instanceof Error) {
			logger(error.message);
		}
	}
});