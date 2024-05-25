import { join, resolve, relative } from "path";
import { lstatSync, readdirSync } from "fs";
import url from "node:url";
import { Collection } from "discord.js";
import { CommandsCollection } from "~/src/@types/discord";
import { log } from "~/src/lib/logger/logger";

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
			const commandName = relative(rootPath, filePath).replace(".ts", "").replace(".js", "").replace("/", "\\");
			commandsCollection.set(commandName, module);
			log(`Loaded command: ${commandName}`);
		}
	});

	await Promise.all(importPromises);
}

export async function loadSlashCommands(): Promise<CommandsCollection> {
	const rootPath = join(process.cwd(), process.env.NODE_ENV === "production" ? "./dist/discord/commands/execution" : "./src/discord/commands/execution");
	const commandsCollection: CommandsCollection = new Collection();

	await loadCommandsFromFolder(rootPath, rootPath, commandsCollection);

	return commandsCollection;
}