import { ActivityType } from "discord.js";
import { scheduleJob } from "node-schedule";
import { client } from "~/src/managers/discordManager";
import { getCatFact } from "~/src/lib/utils/catFact";

scheduleJob("0 0 * * *", async () => {
	const catFact = await getCatFact();
	client.user!.setActivity({ name: catFact, type: ActivityType.Custom });
});
