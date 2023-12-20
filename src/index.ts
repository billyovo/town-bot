import "dotenv/config";
import { connectDiscord } from "@managers/discord/discordManager";
import "./cronJobs/jobs";
import "./cronJobs/priceAlert";
import { connectDatabase } from "@managers/database/databaseManager";

connectDiscord(process.env.DISCORD_TOKEN as string);
connectDatabase(process.env.MONGO_CONNECTION_STRING as string);