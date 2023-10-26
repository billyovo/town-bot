import { Embed, EmbedBuilder } from "discord.js";
import { timeBetweenSurvivalAndSkyblockInMillisecond } from "../../constants/times";
import config from "../../configs/config.json";
import { EventTodayMessageOptions, EventTomorrowEmbedOptions } from "../../@types/embeds";
import { DateTime } from "luxon";
import { embedColor } from "../../constants/embeds";
import { ServerEmoteEnum, ServerNameChineseEnum } from "../../enums/servers";

export function getEventTomorrowEmbed(options: EventTomorrowEmbedOptions) : EmbedBuilder{
    const eventTime = DateTime.fromJSDate(options.event.nextOccurrence);
    const embed = new EmbedBuilder()
    .setColor(embedColor)
    .setTitle('活動提示')
    .setURL(config.homePage)
    .setThumbnail(`${config.homePage}/images/${options.event.id}.png`)
    .addFields(
        { name: '\u200B', value: `小遊戲 **${options.event.title}** 將於 **明天(<t:${eventTime.toSeconds()}:d>)** 舉行`},
        { name: '\u200B', value: '__時間__:'},
		{ name: `${ServerEmoteEnum.SKYBLOCK} ${ServerNameChineseEnum.SKYBLOCK}`, value: `<t:${eventTime.toSeconds()}:t>`, inline: true },
		{ name: `${ServerEmoteEnum.SURVIVAL} ${ServerNameChineseEnum.SURVIVAL}`, value: `<t:${eventTime.plus({millisecond: timeBetweenSurvivalAndSkyblockInMillisecond}).toSeconds()}:t>`, inline: true },
        )
    .setFooter({text: '點擊標題獲取更多資訊', iconURL: options.avatar})

    return embed;
}

export function getEventTodayMessage(options: EventTodayMessageOptions) : string{
    return `<@&${options.mentionedRole}>
${options.event.emote} 小遊戲 ${options.event.title} 將於 <t:${DateTime.fromJSDate(options.startTime).toSeconds()}:t> 開始 ${options.event.emote}
有意參加的玩家可以按spawn左邊的魔法使, 往右走就能找到傳送告示牌了
:warning: 小遊戲會在小遊戲伺服器舉行, 建議提早3分鐘起行以免錯過開始時間
:warning: 請在背包預留至少5格空位以便回來時領取參加獎
`;
}