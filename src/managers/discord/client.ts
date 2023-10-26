import { Client, ClientOptions, Collection } from 'discord.js';
import { CommandsCollection } from '../../@types/discord';

export class ExtendedDiscordClient extends Client {
  commands: CommandsCollection;

  constructor(options: ClientOptions = {intents: []}) {
    super(options);
    this.commands = new Collection();
  }
}
