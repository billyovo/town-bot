import "dotenv/config";
import { connectDiscord } from "@managers/discord/discordManager";
import "./cronJobs/jobs";

connectDiscord(process.env.DISCORD_TOKEN as string);