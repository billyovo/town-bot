import { Routes, REST } from "discord.js";
import path from "path";
import dotenv from "dotenv";
import { logger } from "../src/lib/logger/logger";

dotenv.config({ path: path.resolve(__dirname, "../src/secrets/deposit/.env") });

if (!process.env.CLIENT_ID || !process.env.DISCORD_TOKEN) {
	console.error("Failed to register command: Missing CLIENT_ID or DISCORD_TOKEN in .env file");
	process.exit(1);
}

const rest = new REST().setToken(`${process.env.DISCORD_TOKEN}`);

(async () => {
	const data = await rest.put(
		Routes.applicationCommands(`${process.env.CLIENT_ID}`),
		{ body: [] },
	);
	logger.info(JSON.stringify(data));
})();

