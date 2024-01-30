import "dotenv/config";
import { connectDiscord } from "~/managers/discord/discordManager";
import { connectDatabase } from "~/managers/database/databaseManager";
import "./cronJobs/jobs";
import "./cronJobs/priceAlert";


connectDiscord(process.env.DISCORD_TOKEN as string);
connectDatabase(process.env.MONGO_CONNECTION_STRING as string);