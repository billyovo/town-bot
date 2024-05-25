import { Channel, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { scheduleJob } from "node-schedule";
import { client } from "~/src/managers/discordManager";
import { returnDiff } from "../lib/cron/richDay";
import { log } from "~/src/lib/logger/logger";

scheduleJob("1 0 * * *", () => {
	const now = DateTime.now().setZone("Asia/Taipei").endOf("day");

	client.channels.fetch(process.env.HAPPY_CHANNEL as string, { force: true, cache: false })
		.then((channel : Channel | null) => {
			if (channel?.type !== ChannelType.GuildText) return;

			channel.send(`@everyone 小妹有錢人生活 ${returnDiff(now)} **POSITIVE**`);
		})
		.catch((error : Error) => {log(error.message);});

});
