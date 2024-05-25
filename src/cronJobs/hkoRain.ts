import { client } from "~/src/managers/discordManager";
import { callhko } from "~/src/lib/cron/hko";
import { Channel, TextChannel } from "discord.js";
import { scheduleJob } from "node-schedule";
import { log } from "~/src/lib/logger/logger";

enum HkoRainOption {
    HIGH = "High",
    MEDIUM_HIGH = "Medium High"
}

scheduleJob("0 7 * * *", async () => {
	try {
		const respone = await callhko();
		const rain = respone.data.weatherForecast[0].PSR;
		if (rain === HkoRainOption.HIGH || rain === HkoRainOption.MEDIUM_HIGH) {
			client.channels.fetch((process.env.WEATHER_CHANNEL) as string, { force: true, cache: false })
				.then((channel : Channel | null) => {
					(channel as TextChannel).send("出門口記得帶遮!!!!!!!!!!");
				})
				.catch((error : Error) => {
					log(error.message);
				});
		}
	}
	catch (error) {
		if (error instanceof Error) {
			log(error.message);
		}
	}
});