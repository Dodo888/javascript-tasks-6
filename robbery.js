'use strict';

var moment = require('./moment');

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    var gangTimetable = JSON.parse(json);
    var workingMoments = {
        start: timeToMoment(workingHours.from, false),
        end: timeToMoment(workingHours.to, false)
    };
    while (!isInWorkingHours(workingMoments, appropriateMoment) ||
        !isGangFree(gangTimetable, appropriateMoment)) {
        appropriateMoment.increase();
    }
    // 1. Читаем json
    // 2. Находим подходящий ближайший момент начала ограбления
    // 3. И записываем в appropriateMoment

    return appropriateMoment;
};

function timeToMoment(time, hasDay) {
    var workingTimes = time.split(/[ :+-]/);
    var currentMoment = moment();
    if (hasDay) {
        currentMoment.date.day = ['ПН', 'ВТ', 'СР'].indexOf(workingTimes[0]);
        workingTimes.shift();
    }
    currentMoment.date.hours = parseInt(workingTimes[0]);
    currentMoment.date.minutes = parseInt(workingTimes[1]);
    currentMoment.timezone = parseInt(workingTimes[2]);
    if ((time[5] == '-' && !hasDay) || (time[8] == '-' && hasDay)) {
        currentMoment.timezone *= -1;
    }
    currentMoment.date.hours -= currentMoment.timezone;
    currentMoment.overflow();
    return currentMoment;
}

function isInWorkingHours(workingHours, appropriateMoment) {
    return (workingHours.start.dateInMinutes() <= (appropriateMoment.dateInMinutes() % (24 * 60)) &&
        (workingHours.end.dateInMinutes() >= (appropriateMoment.dateInMinutes() % (24 * 60))));
}

function isGangFree(gang, appropriateMoment) {
    for (var bandit = 0; bandit < Object.keys(gang).length; bandit++) {
        for (var deal = 0; deal < gang[Object.keys(gang)[bandit]].length; deal++) {
            if (!((timeToMoment(gang[Object.keys(gang)[bandit]][deal].to, true).dateInMinutes() <=
                appropriateMoment.dateInMinutes()) ||
                (timeToMoment(gang[Object.keys(gang)[bandit]][deal].from, true).dateInMinutes() >
                appropriateMoment.dateInMinutes() + 90))) {
                return false;
            }
        }
    }
    return true;
}

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    var moment = timeToMoment(moment.date, true);
    if (moment.isSoonerThan(robberyMoment)) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }
    return 'Ограбление уже идёт!';
};
