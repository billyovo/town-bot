import { EventScheduleItem } from "./eventSchedule";

export interface EventTomorrowEmbedOptions {
    event: EventScheduleItem;
    avatar: string;
}
export interface EventTodayMessageOptions{
    event: EventScheduleItem,
    startTime: Date,
    mentionedRole: string
}

export interface EventTimeOptions{
    event: EventScheduleItem,
    timeBetweenEvent: number
}