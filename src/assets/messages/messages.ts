import { EmbedBuilder } from "discord.js";
import { timeBetweenSurvivalAndSkyblockInMillisecond } from "../../constants/times";
import config from "../../configs/config.json";
import { EventTimeOptions, EventTodayMessageOptions, EventTomorrowEmbedOptions } from "../../@types/embeds";
import { DateTime } from "luxon";
import { embedColor } from "../../constants/embeds";
import { ServerEmoteEnum, ServerNameChineseEnum, ServerRoleMentionEnum } from "../../enums/servers";

export function getEventTomorrowEmbed(options: EventTomorrowEmbedOptions) : EmbedBuilder {
	const eventTime = DateTime.fromJSDate(options.event.nextOccurrence);
	const embed = new EmbedBuilder()
		.setColor(embedColor)
		.setTitle("活動提示")
		.setURL(config.homePage)
		.setThumbnail(`${config.homePage}/images/${options.event.id}.png`)
		.addFields(
			{ name: "\u200B", value: `小遊戲 **${options.event.title}** 將於 **明天(<t:${eventTime.toSeconds()}:d>)** 舉行` },
			{ name: "\u200B", value: "__時間__:" },
			{ name: `${ServerEmoteEnum.SKYBLOCK} ${ServerNameChineseEnum.SKYBLOCK}`, value: `<t:${eventTime.toSeconds()}:t>`, inline: true },
			{ name: `${ServerEmoteEnum.SURVIVAL} ${ServerNameChineseEnum.SURVIVAL}`, value: `<t:${eventTime.plus({ millisecond: timeBetweenSurvivalAndSkyblockInMillisecond }).toSeconds()}:t>`, inline: true },
		)
		.setFooter({ text: "點擊標題獲取更多資訊", iconURL: options.avatar });

	return embed;
}

export function getEventTodayMessage(options: EventTodayMessageOptions) : string {
	return `<@&${options.mentionedRole}>
${options.event.emote} 小遊戲 ${options.event.title} 將於 <t:${DateTime.fromJSDate(options.startTime).toSeconds()}:t> 開始 ${options.event.emote}
有意參加的玩家可以按spawn左邊的魔法使, 往右走就能找到傳送告示牌了
:warning: 小遊戲會在小遊戲伺服器舉行, 建議提早3分鐘起行以免錯過開始時間
:warning: 請在背包預留至少5格空位以便回來時領取參加獎
`;
}

export function getSingleEventTimeMessage(options: EventTimeOptions) : string {
	const title = `${options.event?.emote} ${options.event?.title} ${options.event?.emote}`;
	const skyblockTime = DateTime.fromJSDate(options.event?.nextOccurrence);
	const survivalTime = DateTime.fromJSDate(options.event?.nextOccurrence).plus({ milliseconds: options.timeBetweenEvent });

	const skyblock = `${ServerEmoteEnum.SKYBLOCK} ${ServerNameChineseEnum.SKYBLOCK}: <t:${skyblockTime.toSeconds()}:f>`;
	const survival = `${ServerEmoteEnum.SURVIVAL} ${ServerNameChineseEnum.SURVIVAL}: <t:${survivalTime.toSeconds()}:f>`;

	return `${title}\r\n${skyblock}\r\n${survival}`;
}

export function getGuildScheduledEventMessage(options : {server: ServerNameChineseEnum}) : string {
	return `小遊戲入口會在正式開始前20分鐘開啟
有意參加的玩家可以按spawn左邊的魔法使, 往右走就能找到傳送告示牌了
:warning: 小遊戲會在${options.server}小遊戲伺服器舉行, 建議提早3分鐘起行以免錯過開始時間
:warning: 請在背包預留至少5格空位以便回來時領取參加獎
`;
}

export function getEventMazeTomorrowEmbed(options: {avatar: string, resetTime: Date, openTime: Date}) {
	const resetTimeInSecond = DateTime.fromJSDate(options.resetTime).toSeconds();
	const openTimeInSecond = DateTime.fromJSDate(options.openTime).toSeconds();

	const embed = new EmbedBuilder()
		.setColor(embedColor)
		.setTitle("迷宮重置提示")
		.addFields(
			{ name: "\u200B", value: `🧭 小遊戲 **赤翠迷蹤** 將於 **明天(<t:${resetTimeInSecond}:d>)** 進行迷宮重置 🧭` },
			{ name: "\u200B", value: "__重置及開放時間__:" },
			{ name: "<:close:936717091120246895> 關閉重置時間", value: `<t:${resetTimeInSecond}:t>`, inline: true },
			{ name: "<:open:936717091011170395> 重新開放時間", value: `<t:${openTimeInSecond}:t>`, inline: true },
		)
		.setFooter({ text: "點擊標題獲取更多資訊", iconURL: options.avatar });
	return embed;
}

export function getEventMazeTodayMessage(options: { nextResetDate: Date}) {
	return `<@&${ServerRoleMentionEnum.SKYBLOCK}> <@&${ServerRoleMentionEnum.SURVIVAL}>
🧭 小遊戲 **赤翠迷蹤** 已經完成迷宮重置並重新開放 🧭
有意參加的玩家可以按spawn左邊的魔法使, 往右走就能找到傳送告示牌了
到達小遊戲伺服器後一直向左前方走即可看到前往迷宮的樓梯
:warning: 請在背包預留至少5格空位以便從小遊戲伺服器來時領取參加獎
:calendar_spiral: 下一次迷宮重置日期: <t:${DateTime.fromJSDate(options.nextResetDate).toSeconds()}:d>`;
}

export function getEventWinnerMessage(options:{server: string, game: string, name: string}) {
	return `${DateTime.now().toFormat("LL 月 dd 日")}
${options.server}服: ${options.game} - ${options.name} , 禁賽一次`;
}