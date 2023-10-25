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
    list: EventScheduleItem[],
    today: EventScheduleItem[],
    tomorrow: EventScheduleItem[],
}