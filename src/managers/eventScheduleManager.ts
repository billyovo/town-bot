import { checkSchedule, isScheduleValid } from "../utils/eventScheduler/eventSchedule";
import events from "../configs/events.json";

export const eventSchedule: EventSchedule = checkSchedule(new Date(), events);

if (!isScheduleValid(eventSchedule)) {
	console.error("Event schedule is invalid");
	process.exit(1);
}
