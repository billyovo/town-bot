import { HkoRainOption } from "~/enums/cronOption";
import { client } from "~/managers/discord/discordManager";
import { callhko } from "~/utils/cron/hko";
import { returnDiff } from "~/utils/cron/richDay";
import { Channel, TextChannel } from "discord.js";
import { DateTime } from "luxon";
import { scheduleJob } from "node-schedule";

scheduleJob("1 0 * * *", () => {
	const now = DateTime.now().setZone("Asia/Taipei").endOf("day");

	client.channels.fetch(process.env.HAPPY_CHANNEL as string, { force: true, cache: false })
		.then((channel : Channel | null) => {
			if (!channel) return;

			(channel as TextChannel).send(`@everyone 小妹有錢人生活 ${returnDiff(now)} **POSITIVE**`);
		})
		.catch((error) => {console.error(error);});

});

scheduleJob("* 8 * * *", async () => {
	try {
		const respone = await callhko();
		const rain = respone.data.weatherForecast[0].PSR;
		console.log(respone.data.weatherForecast[0].PSR);
		if (rain === HkoRainOption.HIGH || rain === HkoRainOption.MEDIUM_HIGH) {
			client.channels.fetch((process.env.WEATHER_CHANNEL) as string, { force: true, cache: false })
				.then((channel : Channel | null) => {
					(channel as TextChannel).send("出門口記得帶遮!!!!!!!!!!");
				})
				.catch((error) => {console.error(error);});
		}
	}
	catch (error) {
		console.log(error);
	}
});