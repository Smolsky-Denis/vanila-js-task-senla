let state = {
    time: new Date(),
    zone: 'PL',
    // 0. пока lots заполни моковыми данными.данными
    lots: [
        {
            type: 'Web developers',
            description: 'Developers description',
            count: '16',
        }, {
            type: 'Java',
            description: 'Developers description',
            count: '10',
        }, {
            type: 'Python',
            description: 'Developers description',
            count: '3',
        },
    ]
};

//4. Создать функцию render. Она чистит root элемент и вставляет newDom
function render(component, root) {
    root.innerHTML = '';

    root.append(component);
}

// 3. Создать функцию renderView,
function renderView(state) {
    // 5. render(App({ state }), document.getElementById('root'));
    render(App(state), document.getElementById('root'));
}

function Header() {
    const header = document.createElement('img');

    header.classList.add('logo');
    header.src = './icons/senla.svg';

    return header;
}

// можешь добавить еще вот такое в Lots (вставим Loading...)
function Preloader() {
    const preloader = document.createElement('img');
    preloader.src = './icons/preloader.svg';
    preloader.classList.add('preloader');

    return preloader;
}

function Clock(state) {
    const timeFormats = {
        pm: " PM",
        am: " AM",
    };
    const clockElement = document.createElement('div');
    clockElement.classList.add('clock');

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

    function getTime(state) {
        const today = state.time;
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

    const {
        hours,
        minutes,
        seconds,
        timeFormat,
    } = getTime(state);

    clockElement.innerHTML = hours + ":" + minutes + ":" + seconds + timeFormat;

    return clockElement;
}

function Lot(type, description, count) {
    const lot = document.createElement('div');
    lot.classList.add('lot');

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

    container.append(typeElement);
    container.append(descriptionElement);

    lot.append(container);
    lot.append(countElement);

    return lot;
}

function Lots(state) {
    const lotsElement = document.createElement('div');
    lotsElement.classList.add('lots');

    state.lots.forEach(item => {
        lotsElement.append(Lot(item.type, item.description, item.count));
    });

    return lotsElement;
}

function App({time, lots}) {
    // 1.  Добавь в дом дополнительную обертку div class=app. Корень root, в нем app, а в app вся движуха.
    const app = document.createElement('div');
    app.classList.add('app');

    // 2. Создать функцию App, которая принимает весь state, создает Header, app.append(Clock({ time: state.time }), app.append(Lots({ lots: state.lots }));
    // и return app
    app.append(Header());
    app.append(Clock({time}));
    if (lots === null) {
        app.append(Preloader())
    } else {
        app.append(Lots({lots}));
    }
    return app;
}

//6. реализовать setInterval. Он каждую секунду меняет time у state и пердает весь state в renderView
renderView(state);

setInterval(function () {
    state.time = new Date();

    renderView(state);
}, 1000);
