import { Routes, REST, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { logger } from "../logger/logger";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.CLIENT_ID || !process.env.DISCORD_TOKEN) {
	console.error("Failed to register command: Missing CLIENT_ID or DISCORD_TOKEN in .env file");
	process.exit(1);
}

const commandsPath = path.resolve(__dirname, "./builders");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts")).map((file) => path.parse(file).name);
const rest = new REST().setToken(`${process.env.DISCORD_TOKEN}`);

const commands : RESTPostAPIApplicationCommandsJSONBody[] = [];

const importPromises = commandFiles.map(file =>
	import(path.resolve(commandsPath, file)).then(module =>
		commands.push(module.command.toJSON()),
	),
);

Promise.all(importPromises).then(async () => {
	const data = await rest.put(
		Routes.applicationCommands(`${process.env.CLIENT_ID}`),
		{ body: commands },
	);
	logger(JSON.stringify(data));
});