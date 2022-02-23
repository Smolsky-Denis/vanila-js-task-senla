const timeFormats = {
    pm: " PM",
    am: " AM",
}

function checkTime(i) {
    if (i < 10) {
        return "0" + i;
    }
    return i;
}

function checkHours(h) {
    if (h > 12) {
        return h - 12;
    }
    return h;
}

function getTime() {
    const today = new Date();
    const h = today.getHours();
    const m = today.getMinutes();
    const s = today.getSeconds();
    const timeFormat = h > 12 ? timeFormats.pm : timeFormats.am;

    return {
        hours: checkHours(h),
        minutes: checkTime(m),
        seconds: checkTime(s),
        timeFormat,
    }
}

export function clock () {
    const clockElement = document.createElement('div');
    clockElement.classList.add('clock');

    setInterval(function() {
        const {
            hours,
            minutes,
            seconds,
            timeFormat,
        } = getTime();

        clockElement.innerHTML = hours + ":" + minutes + ":" + seconds + timeFormat;
    }, 500);

    return clockElement;
}

