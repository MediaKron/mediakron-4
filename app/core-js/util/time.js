/**
 * Given a time object, return an error,
 * or false if there are no errors
 * @param {object} date 
 */
function validateTimeline(date) {
    if (!date) return "Please provide at least a start date.";
    if (!date.start) return "Please provide at least a start date.";
    var serialStart = Mediakron.serializeDate(date.start);
    if (!serialStart) return "The start date seems to be invalid.";
    if (date.end) {
        // TODO Validate if start is later than end.  Serialize
        var serialEnd = Mediakron.serializeDate(date.end);
        if (!serialEnd) return "The end date seems to be invalid.";
        if (serialStart > serialEnd) return "The end date must be after the start date.";
    }
    return false;
}

/**
 * Given a well formed time object, serialize the date
 * into a number of seconds from 1 CE / -1 BCE
 * @param {object} dateObj 
 */
function serializeDate(dateObj) {
    var seconds = 0,
        leap = false,
        reference = {
            normalFourYear: 126230400,
            nonLeapFourYear: 126144000,
            nonLeapCentury: 3155673600,
            leapCentury: 3155760000,
            fourHundredYears: 12622780800,
            year: 31536000,
            leap: 31622400,
            month: 2678400,
            shortMonth: 2592000,
            febuary: 2419200,
            leapFebuary: 2505600,
            day: 86400,
            hour: 3600,
            minute: 60
        },
        bce = false;
    calculateYear = function () {
        var year = dateObj.year.trim();
        // Years can have a couple of forms.  
        if (isNaN(year)) {
            var parts = year.split(' ');
            if (!parts[0]) return false;
            if (!parts[1]) return false;
            var number = parseFloat(parts[0]),
                str = parts[1].toLowerCase();
            if (parts[2]) str += ' ' + parts[2].toLowerCase();
            if (parts[3]) str += ' ' + parts[3].toLowerCase();
            if (parts[3]) str += ' ' + parts[3].toLowerCase();

            switch (str) {
                case 'billion':
                case 'billions':
                    year = number * 1000000000;
                    break;
                case 'bya':
                    year = number * 1000000000 * -1;
                    break;

                case 'million':
                case 'millions':
                    year = number * 1000000;
                    break;
                case 'mya':
                    year = number * 1000000 * -1;
                    break;
            }
        }

        year = Math.abs(parseInt(year, 10));

        // get the number of seconds in the year
        var seconds = 0,
            modulo4 = year % 4,
            closest4 = year - modulo4,
            modulo100 = year % 100,
            closestCentury = year - modulo100,
            modulo400 = year % 400,
            closestFourHundred = year - modulo400,
            additonalCenturies = closestCentury - closestFourHundred,
            additionalYears = year - closestCentury,
            tracker = 0;
        // is this a leap year
        if (modulo400 === 0) leap = true;
        if (modulo4 === 0 && modulo100 !== 0) leap = true;
        seconds = (closestFourHundred / 400) * reference.fourHundredYears;
        tracker += closestFourHundred;
        if (additonalCenturies > 0) {
            seconds += (additonalCenturies / 100) * reference.nonLeapCentury;
            tracker += additonalCenturies;
        }
        if (additionalYears > 0) {
            seconds += ((closest4 - tracker) / 4) * reference.normalFourYear;
            var additional = year - closest4;
            seconds += additional * reference.leap;
        }
        if (this.timelineType != 'generic') {
            seconds = seconds - reference.leap;
        }
        if (modulo4 === 0 && modulo100 === 0) {
            seconds += reference.day;
        }
        if (parseInt(dateObj.year, 10) < 0) {
            bce = true;
        }
        return seconds;
    };
    calculateMonth = function () {
        var month = parseFloat(dateObj.month),
            seconds = 0;
        if (month === 0) return 0; // Jan
        if (month > 0) seconds += reference.month; // Feb
        if (month > 1 && this.leap) seconds += reference.leapFebuary; // leap march
        if (month > 1 && !this.leap) seconds += reference.febuary; // non leap march
        if (month > 2) seconds += reference.month; // apri
        if (month > 3) seconds += reference.shortMonth; // may
        if (month > 4) seconds += reference.month; // june
        if (month > 5) seconds += reference.shortMonth; // june
        if (month > 6) seconds += reference.month; // july
        if (month > 7) seconds += reference.month; // august
        if (month > 8) seconds += reference.shortMonth; // sept
        if (month > 9) seconds += reference.month; // october
        if (month > 10) seconds += reference.shortMonth; // nov
        return seconds;
    };
    if (dateObj.year) {
        seconds += calculateYear();
    }
    if (dateObj.month) {
        seconds += calculateMonth();
    }
    if (dateObj.day) {
        seconds += (parseInt(dateObj.day, 10) - 1) * reference.day;
    }
    if (dateObj.hour) {
        seconds += (parseInt(dateObj.hour, 10) - 1) * reference.hour;
    }
    if (dateObj.minute) {
        seconds += (parseInt(dateObj.minute, 10) - 1) * reference.minute;
    }
    if (dateObj.second) {
        seconds += parseInt(dateObj.second, 10);
    }
    if (bce) {
        seconds = seconds * -1;
    }
    if (seconds === 0) return false;
    return seconds;
}


export {
    validateTimeline,
    serialize
}
