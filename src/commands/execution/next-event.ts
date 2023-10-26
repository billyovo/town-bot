import { ChatInputCommandInteraction } from "discord.js";
import { eventSchedule } from "../../managers/eventScheduleManager";
import { ServerEmoteEnum, ServerNameChineseEnum } from "../../constants/enums";
import { DateTime } from "luxon";
import { timeBetweenSurvivalAndSkyblockInMillisecond } from "../../constants/eventDelays";

export async function execute(interaction: ChatInputCommandInteraction){
    const targetEvent = eventSchedule.list.at(0);
    if(!targetEvent?.nextOccurrence) return interaction.reply("目前沒有活動");
    const skyblockTime = DateTime.fromJSDate(targetEvent?.nextOccurrence);
    const survivalTime = DateTime.fromJSDate(targetEvent?.nextOccurrence).plus({milliseconds: timeBetweenSurvivalAndSkyblockInMillisecond});

    const title = `${targetEvent?.emote} ${targetEvent?.title} ${targetEvent?.emote}`;
    const skyblock = `${ServerEmoteEnum.SKYBLOCK} ${ServerNameChineseEnum.SKYBLOCK}: <t:${skyblockTime.toSeconds()}:R>`;
    const survival = `${ServerEmoteEnum.SURVIVAL} ${ServerNameChineseEnum.SURVIVAL}: <t:${survivalTime.toSeconds()}:R>`;

    await interaction.reply(`${title}\r\n${skyblock}\r\n${survival}`);
}