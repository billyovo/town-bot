import { ActivityType, Collection } from "discord.js";
import { EventScheduleItem } from "../../@types/eventSchedule";
import { ExtendedDiscordClient } from "../../managers/discord/client";

export function updateStatus(client : ExtendedDiscordClient, eventsToday: Collection<string, EventScheduleItem>){
    if(eventsToday.size > 0){
        client.user?.setActivity(`今天的${eventsToday.size}個小遊戲` ,{type: ActivityType.Playing});
    }
    else{
        client.user?.setActivity("今天沒有小遊戲 :(", {type: ActivityType.Watching});
    }
}