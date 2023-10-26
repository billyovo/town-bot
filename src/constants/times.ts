export const timeBetweenSurvivalAndSkyblockInMillisecond = 1*60*60*1000; // 1 hour

export const annoucementTimeBeforeEventStart = 20*60*1000; // 20 minutes

export function getEventTomorrowAnnoucementTime(){
    // 5:00 PM
    const time = new Date();
    time.setHours(17, 0 , 0);

    return time;
};

