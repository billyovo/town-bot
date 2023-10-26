import { scheduleJob } from "node-schedule";
import { getEventTomorrowAnnoucementTime } from "../../../constants/times";
import { getEventTodayMessage, getEventTomorrowEmbed } from "../../../assets/messages/messages";
import { scheduleTodayEventMessageOptions, scheduleTomorrowEventMessageOptions } from "../../../@types/eventSchedule";

export function scheduleTomorrowEventMessage(options: scheduleTomorrowEventMessageOptions){
    console.log(`Scheduled tomorrow event annoucement for: ${options.event.title} ${options.event.emote} at ${getEventTomorrowAnnoucementTime().toTimeString()}`);
    
    scheduleJob(getEventTomorrowAnnoucementTime(), () => {
        options.annoucementChannel?.send({
            embeds: [
                getEventTomorrowEmbed({event: options.event, avatar: options.avatarURL})
            ]
        });
    })
}

export function scheduleTodayEventMessage(options: scheduleTodayEventMessageOptions){
    console.log(`Scheduled today event annoucement for: ${options.event.title} ${options.event.emote}`);

    scheduleJob(options.startTime, () => {
        options.annoucementChannel?.send(getEventTodayMessage({
            event: options.event,
            startTime: options.startTime,
            mentionedRole: options.mentionedRole
        }))
    })
}