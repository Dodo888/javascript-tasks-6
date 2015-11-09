'use strict';

module.exports = function () {
    return {
        // Здесь как-то хранится дата ;)
        date: {
            day: 0,
            hours: 0,
            minutes: 0
        },

        dateInMinutes: function () {
            return this.date.day * 24 * 60 + this.date.hours * 60 + this.date.minutes;
        },

        // А здесь часовой пояс
        timezone: 5,

        increase: function () {
            this.date.minutes++;
            if (this.date.minutes == 60) {
                this.date.minutes = 0;
                this.date.hours++;
            }
            if (this.date.hours == 24) {
                this.date.hours = 0;
                this.date.day++;
            }
        },

        // Выводит дату в переданном формате
        format: function (pattern) {
            pattern = pattern.replace('%DD', ['ПН', 'ВТ', 'СР'][this.date.day +
                Math.floor((this.date.hours + this.timezone) / 24)]);
            pattern = pattern.replace('%HH', (this.date.hours + this.timezone) % 24);
            if (this.date.minutes < 10) {
                pattern = pattern.replace('%MM', '0' + this.date.minutes);
            } else {
                pattern = pattern.replace('%MM', this.date.minutes);
            }
            return pattern;
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            var differenceInMinutes = (moment.date.day - this.date.day) * 24 * 60 +
                (moment.date.hours - this.date.hours) * 60 +
                (moment.date.minutes - this.date.minutes);
            var resultString = '';
            if (differenceInMinutes >= 24 * 60) {
                resultString += Math.floor(differenceInMinutes / 24 * 60) + ' дней, ';
            }
            differenceInMinutes = differenceInMinutes % (24 * 60);
            if (differenceInMinutes >= 60) {
                resultString += Math.floor(differenceInMinutes / 60) + ' часов, ';
            }
            differenceInMinutes = differenceInMinutes % 60;
            if (differenceInMinutes == 0) {
                resultString += differenceInMinutes + ' минут';
            }
            return resultString;
        }
    };
};
