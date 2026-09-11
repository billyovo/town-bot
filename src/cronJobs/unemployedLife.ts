import { Channel, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { scheduleJob } from "node-schedule";
import { client } from "~/src/managers/discordManager";
import { returnDiff } from "../lib/cron/richDay";
import { logger } from "../lib/logger/logger";

scheduleJob("1 0 * * *", () => {
	const now = DateTime.now().setZone("Asia/Taipei").endOf("day");
	const day = { day: 1, month: 9, year: 2026 };
	client.channels.fetch(process.env.HAPPY_CHANNEL as string, { force: true, cache: false })
		.then((channel : Channel | null) => {
			if (channel?.type !== ChannelType.GuildText) return;

			channel.send(`@everyone ahlegs bb 失業後${returnDiff(now, day)} **NEGATIVE** `);
		})
		.catch((error : Error) => {logger.error(error.message);});

});
