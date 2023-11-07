import { generateSchedule, isScheduleValid } from "@utils/eventScheduleGenerator/eventScheduleGenerator";
import events from "@configs/events.json";
import { EventSchedule } from "../@types/eventSchedule";

export let eventSchedule: EventSchedule = generateSchedule(new Date(), events);

export function updateEventSchedule() {
	eventSchedule = generateSchedule(new Date(), events);
}

if (!isScheduleValid(eventSchedule)) {
	console.error("Event schedule is invalid");
	process.exit(1);
}

