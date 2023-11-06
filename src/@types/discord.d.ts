import { BaseInteraction, Client, Collection } from "discord.js";

export interface DiscordClient extends Client{
    commands: CommandsCollection;
}

export type CommandsCollection = Collection<string, {execute: (interaction : BaseInteraction) => void}>;

export type CheckTomorrowScheduleMessageOptions = {annoucementChannel: TextChannel, avatarURL: string, tomorrowEvents: Collection<string, EventScheduleItem>}

export type checkTodayScheduleMessageOptions = { annoucementChannel: TextChannel, todayEvents: Collection<string, EventScheduleItem> }