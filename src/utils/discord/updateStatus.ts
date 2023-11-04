import { ActivityType, Collection } from "discord.js";
import { EventScheduleItem } from "../../@types/eventSchedule";
import { ExtendedDiscordClient } from "../../managers/discord/client";

export function updateStatus(client : ExtendedDiscordClient, eventsToday: Collection<string, EventScheduleItem>) {
	if (eventsToday.size > 0) {
		const eventNames : string = eventsToday.map((event : EventScheduleItem) => event.title).join(" ");
		client.user?.setActivity(eventNames, { type: ActivityType.Playing });
	}
	else {
		client.user?.setActivity("今天沒有小遊戲 :(", { type: ActivityType.Watching });
	}
}