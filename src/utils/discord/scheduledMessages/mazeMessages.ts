import { DateTime } from "luxon";
import { getEventMazeTodayMessage, getEventMazeTomorrowEmbed } from "@assets/messages/messages";
import { ServerRoleMentionEnum } from "@enums/servers";
import { TextChannel } from "discord.js";

export function sendMazeTomorrowMessage(options: {announcementChannel: TextChannel, avatar: string}) {
	options.announcementChannel?.send({ embeds: [
		getEventMazeTomorrowEmbed({
			avatar: options.avatar,
			resetTime: DateTime.now().plus({ days: 1 }).set({ hour: 13, minute: 30, second: 0, millisecond: 0 }).toJSDate(),
			openTime: DateTime.now().plus({ days: 1 }).set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toJSDate(),
		}),
	], content: `${ServerRoleMentionEnum.SKYBLOCK} ${ServerRoleMentionEnum.SURVIVAL}` });
}


export function sendMazeTodayMessage(options: {annoucementChannel: TextChannel}) {
	options.annoucementChannel.send(
		getEventMazeTodayMessage({
			nextResetDate: DateTime.now().plus({ months: 1 }).set({ hour: 13, minute: 30, second: 0, millisecond: 0 }).toJSDate(),
		}),
	);
}