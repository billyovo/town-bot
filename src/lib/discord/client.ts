import { Client, ClientOptions, Collection } from "discord.js";
import { AutoCompleteCollection, CommandsCollection } from "~/src/@types/discord";

export class ExtendedDiscordClient extends Client {
	commands: CommandsCollection;
	autoCompleteCommands: AutoCompleteCollection;

	constructor(options: ClientOptions = { intents: [] }) {
		super(options);
		this.commands = new Collection();
		this.autoCompleteCommands = new Collection();
	}
}
