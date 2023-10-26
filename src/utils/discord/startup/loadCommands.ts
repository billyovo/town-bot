import path from "path";
import fs from "fs";
import url from "node:url";
import { Collection } from "discord.js";
import { CommandsCollection } from "../../../@types/discord";

export async function loadSlashCommands() : Promise<CommandsCollection> {
  const foldersPath = path.join(__dirname, "../../../commands/execution");
  const commandFiles = fs.readdirSync(foldersPath);

  const commandsCollection : CommandsCollection = new Collection();

  const importPromises = commandFiles.map(async file =>{
    const command = url.pathToFileURL(path.resolve(foldersPath, file)).toString();
    const module = await import(command);
    commandsCollection.set(path.parse(file).name, module);
    console.log(`Loaded command: ${path.parse(file).name}`);
  });

  await Promise.all(importPromises);
  return commandsCollection;
}
