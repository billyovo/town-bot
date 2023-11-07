import { GuildScheduledEvent, GuildScheduledEventEntityType } from "discord.js";
import { EventScheduleItem } from "../../../@types/eventSchedule";
import { checkGuildScheduledEventsOptions, createGuildScheduleEventOptions } from "../../../@types/guildScheduleEvents";
import { guildEventScheduleDuration, guildEventScheduleTime, timeBetweenSurvivalAndSkyblockInMillisecond } from "@constants/times";
import { ServerNameChineseEnum, ServerNameEnum } from "@enums/servers";
import { getGuildScheduledEventMessage } from "@assets/messages/messages";
import fs from "fs/promises";
import { logger } from "../../../logger/logger";

export async function checkGuildScheduledEvents(options : checkGuildScheduledEventsOptions) : Promise<void> {
	const shouldBeScheduledDateLimit = new Date(Date.now() + guildEventScheduleTime);
	const currentScheduledEvents = await options.guild.scheduledEvents.fetch();

	const shouldBeScheduledEvents = options.eventList.filter((event : EventScheduleItem) => {
		const isAlreadyScheduled = currentScheduledEvents.some((guildEvent : GuildScheduledEvent) => {
			return guildEvent.name === `${event.emote} ${event.title}`;
		});
		const isWithInScheduleTime = event.nextOccurrence <= shouldBeScheduledDateLimit;

		return !isAlreadyScheduled && isWithInScheduleTime;
	});

	for (const [_key, event] of shouldBeScheduledEvents) {
		await createGuildScheduleEvent({
			guild: options.guild,
			event: event,
			server: ServerNameChineseEnum.SKYBLOCK,
			image: `./src/assets/images/${event.id}_${ServerNameEnum.SKYBLOCK}.png`,
			startTime: event.nextOccurrence,
		});

		await createGuildScheduleEvent({
			guild: options.guild,
			event: event,
			server: ServerNameChineseEnum.SURVIVAL,
			image: `./src/assets/images/${event.id}_${ServerNameEnum.SURVIVAL}.png`,
			startTime: new Date(event.nextOccurrence.getTime() + timeBetweenSurvivalAndSkyblockInMillisecond),
		});
	}
}

async function createGuildScheduleEvent(options : createGuildScheduleEventOptions) : Promise<void> {
	logger("Created Guild Schedule Event for " + options.event.title);
	options.guild.scheduledEvents.create({
		name: `${options.event.emote} ${options.event.title}`,
		scheduledStartTime: options.startTime.getTime(),
		scheduledEndTime: options.startTime.getTime() + guildEventScheduleDuration,
		privacyLevel: 2,
		image: await fs.readFile(options.image),
		entityType: GuildScheduledEventEntityType.External,
		description: getGuildScheduledEventMessage({ server: options.server }),
		entityMetadata:{
			location: `${options.server}小遊戲伺服器`,
		},
	});

}