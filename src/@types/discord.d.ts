import { Client, Collection } from "discord.js";

export interface DiscordClient extends Client{
    commands: CommandsCollection;
}

export type CommandsCollection = Collection<string, {execute: Function}>;