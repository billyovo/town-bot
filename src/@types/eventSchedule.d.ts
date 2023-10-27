import { Collection } from "discord.js";

export interface EventData {
    title: string,
    id: string,
    rrule: string,
    emote: string
}

export interface EventScheduleItem {
    title: string,
    id: string,
    emote: string,
    nextOccurrence: Date
}
export interface EventSchedule {
    list: Collection<string, EventScheduleItem>,
    today: Collection<string, EventScheduleItem>,
    tomorrow: Collection<string, EventScheduleItem>,
}

export interface scheduleTomorrowEventMessageOptions {
    annoucementChannel: TextChannel,
    avatarURL: string,
    event: EventScheduleItem
}

export interface scheduleTodayEventMessageOptions{
    annoucementChannel: TextChannel,
    event: EventScheduleItem,
    startTime: Date,
    mentionedRole: string
}