import "dotenv/config";
import { connectDiscord } from "~/managers/discord/discordManager";
import { connectDatabase } from "~/managers/database/databaseManager";
import "./cronJobs/jobs";
import "./cronJobs/priceAlert";


connectDiscord(`${process.env.DISCORD_TOKEN}`);
connectDatabase(`${process.env.MONGO_CONNECTION_STRING}/${process.env.DATABASE_NAME}`);