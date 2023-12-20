import { join, resolve, relative } from "path";
import { lstatSync, readdirSync } from "fs";
import url from "node:url";
import { Collection } from "discord.js";
import { CommandsCollection } from "../../../@types/discord";
import { logger } from "../../../logger/logger";


async function loadCommandsFromFolder(folderPath: string, rootPath: string, commandsCollection: CommandsCollection) {
	const commandFiles = readdirSync(folderPath);

	const importPromises = commandFiles.map(async (file) => {
		const filePath = resolve(folderPath, file);

		if (lstatSync(filePath).isDirectory()) {
			await loadCommandsFromFolder(filePath, rootPath, commandsCollection);
		}
		else {
			const command = url.pathToFileURL(filePath).toString();
			const module = await import(command);
			const commandName = relative(rootPath, filePath).replace(".ts", "").replace("/", "\\");
			commandsCollection.set(commandName, module);
			logger(`Loaded command: ${commandName}`);
		}
	});

	await Promise.all(importPromises);
}

export async function loadSlashCommands(): Promise<CommandsCollection> {
	const rootPath = join(process.cwd(), "./src/commands/execution");
	const commandsCollection: CommandsCollection = new Collection();

	await loadCommandsFromFolder(rootPath, rootPath, commandsCollection);

	return commandsCollection;
}