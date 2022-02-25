(function App() {
    const employeeTypes = [
        {
            type: 'Web developers',
            description: 'Developers description',
            count: '16',
        },{
            type: 'Java',
            description: 'Developers description',
            count: '10',
        },{
            type: 'Python',
            description: 'Developers description',
            count: '3',
        },
    ]

    const timeFormats = {
        pm: " PM",
        am: " AM",
    }

    const root = document.getElementById('root');

    root.append(Logo());
    root.append(Clock());
    employeeTypes.map(item => {
        root.append(InfoBox(item.type, item.description, item.count));
    });

    function Logo() {
        const logo = document.createElement('img');

        logo.classList.add('logo');
        logo.src = './icons/senla.svg';

        return logo
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

    function Clock() {
        const clockElement = document.createElement('div');
        clockElement.classList.add('clock');

        setInterval(function () {
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

    function InfoBox(type, description, count) {
        const infoBoxElement = document.createElement('div');
        infoBoxElement.classList.add('infoBox');

        const container = document.createElement('div');

        const typeElement = document.createElement('div');
        typeElement.classList.add('type');
        typeElement.innerHTML = type;

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('description');
        descriptionElement.innerHTML = description;

        const countElement = document.createElement('div');
        countElement.classList.add('count');
        countElement.innerHTML = count;

        container.appendChild(typeElement);
        container.appendChild(descriptionElement);

        infoBoxElement.appendChild(container);
        infoBoxElement.appendChild(countElement);

        return infoBoxElement;
    }
})();
