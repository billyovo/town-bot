import "dotenv/config";
import { connectDiscord } from "./managers/discordManager";
import { connectDatabase } from "./managers/databaseManager";
import "./cronJobs/catFat";
import "./cronJobs/hkoRain";
import "./cronJobs/priceAlert";


connectDiscord(`${process.env.DISCORD_TOKEN}`);
connectDatabase(`${process.env.MONGO_CONNECTION_STRING}/${process.env.DATABASE_NAME}`);