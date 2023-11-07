import { Collection, Guild } from "discord.js";
import { EventScheduleItem } from "./eventSchedule";
import { ServerNameChineseEnum } from "@enums/servers";

export interface checkGuildScheduledEventsOptions {
    guild: Guild;
    eventList: Collection<string, EventScheduleItem>
}

export interface createGuildScheduleEventOptions {
    guild: Guild;
    event: EventScheduleItem;
    server: ServerNameChineseEnum;
    image: string;
    startTime: Date;
}