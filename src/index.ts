import dotenv from "dotenv";
import { connectDiscord } from "./managers/discordManager";
import { connectDatabase } from "./managers/databaseManager";
import "./cronJobs/catFat";
import "./cronJobs/hkoRain";
import "./cronJobs/priceAlert";
import "./cronJobs/richLife";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "./secrets/deposit/.env") });

connectDiscord(`${process.env.DISCORD_TOKEN}`);
connectDatabase(`${process.env.MONGO_CONNECTION_STRING}/${process.env.DATABASE_NAME}`);