import "dotenv/config";
import "@managers/eventScheduleManager";
import { connectDatabase } from "@managers/databaseManager";
import { connectDiscord } from "@managers/discord/discordManager";
import "./cronJobs/jobs";

connectDatabase((process.env.DB_CONNECTION_STRING) as string);
connectDiscord(process.env.DISCORD_TOKEN as string);