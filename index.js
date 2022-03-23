// Обнулить lots в текущем (глобальном state)
let state = {
    time: new Date(),
    zone: 'PL',
    // 0. пока lots заполни моковыми данными.данными
    lots: null
};

const mockDataLots = [
    {
        id: 1,
        price: 16000,
        type: 'Web developers',
        description: 'Developers description',
        count: '16',
    }, {
        id: 2,
        price: 10000,
        type: 'Java',
        description: 'Developers description',
        count: '10',
    }, {
        id: 3,
        price: 3000,
        type: 'Python',
        description: 'Developers description',
        count: '3',
    },
];
// Обьект api с методом get. В нем switch по "/lots", который возвращает Promise (Внутри Promise setTimeout, который возвращает массив лотов)
const api = {
    get: (url) => {
        let promise;
        switch (url) {
            case '/lots':
                promise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(mockDataLots);
                    }, 1000);
                });
                break;
            default:
                console.log('Такого URL к сожалению не найдено :(');
        }

        return promise;
    },
}
// реализовать обьект stream с методом subscribe (он принимает channel ("price-id"), listener). В самом subscribe
const stream = {
    subscribe: (countId = '', listener) => {
        // регекспом проверяешь на совпадение формата "price-id".
        // Если формат совпал, то вызываешь setInterval,
        // в котором вызываешь listener - передаешь туда новый обьект с принятым {id, count: random от 0 до 100}
        const regex = /^count-[0-9a-zA-Z]*$/;
        const isFormat = regex.test(countId)
        if (isFormat) {
            setInterval(() => {
                const id = Number(countId.split('-')[1]);
                const count = Math.floor(Math.random() * 101);
                const updateLotObj = {
                    id,
                    count
                }
                listener(updateLotObj);
            }, 1000)
        }
    }
}

function listener(updateLotObj) {
    state.lots.forEach(lot => {
        if (lot.id === updateLotObj.id) {
            lot.count = updateLotObj.count;
        }
    })
    renderView(state);
}

//3.  в функции sync проверить, что если у принятых нод id, className и другие аттрибуты не совпадают - произвести синхронизацию.
function sync(virtualElement, realElement) {
    if (virtualElement.attributes) {
        Array.from(virtualElement.attributes).forEach((attr) => {
            realElement[attr.name] = attr.value;
        });
    }

    if (virtualElement.nodeValue !== realElement.nodeValue) {
        realElement.nodeValue = virtualElement.nodeValue;
    }

    if (virtualElement.id !== realElement.id) {
        realElement.id = virtualElement.id;
    }

    const virtualChild = virtualElement.childNodes;
    const realChild = realElement.childNodes;

    for (let i = 0; i < virtualChild.length || i < realChild.length; i++) {
        const virtual = virtualChild[i];
        const real = realChild[i];

        if (virtual === undefined && real !== undefined) {
            realElement.remove(real)
        }
        if (virtual !== undefined && real !== undefined && virtual.tagName === real.tagName) {
            sync(virtual, real);
        }
        if (virtual !== undefined && real !== undefined && virtual.tagName !== real.tagName) {
            const newReal = buildRealFromVirtual(virtual);
            sync(virtual, newReal);
            realElement.appendChild(newReal)
        }
        if (virtual !== undefined && real === undefined) {
            const newReal = buildRealFromVirtual(virtual);
            sync(virtual, newReal);
            realElement.appendChild(newReal);
        }
    }
}

function buildRealFromVirtual(virtual) {
    if (virtual.nodeType === Node.TEXT_NODE) {
        return document.createTextNode('');
    }
    return document.createElement(virtual.tagName);
}

//4. Создать функцию render. Она чистит root элемент и вставляет newDom
function render(virtualDom, realDomRoot) {
    const virtualDomRoot = document.createElement(realDomRoot.tagName);
    virtualDomRoot.id = realDomRoot.id;
    virtualDomRoot.append(virtualDom);
    sync(virtualDomRoot, realDomRoot);
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

function Lot(item) {
    const lot = document.createElement('div');
    lot.classList.add('lot');

    lot.dataset.key = item.id;

    const container = document.createElement('div');

    const typeElement = document.createElement('div');
    typeElement.classList.add('type');
    typeElement.innerHTML = item.type;

    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add('description');
    descriptionElement.innerHTML = item.description;

    const countElement = document.createElement('div');
    countElement.classList.add('count');
    countElement.innerHTML = item.count;

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
        lotsElement.append(Lot(item));
    });

    return lotsElement;
}

function App({time, lots}) {
    // 1.  Добавь в дом дополнительную обертку div class=app. Корень root, в нем app, а в app вся движуха.
    const app = document.createElement('div');
    app.classList.add('app');

    app.innerHTML = 'Hello, I am Arun';

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

//api получает lots (в then), обновляет state и вызывает renderView, ps/ не забывай про catch у промиса.
api.get('/lots')
    .then(result => {
        // 3. В этом же then описываешь  callback (listener).
        // Он принимает обьект  - меняешь count в state на тот,
        // который принял и вызываешь renderView
        result.forEach(lot => {
            stream.subscribe(`count-${lot.id}`, listener)
        });
        state.lots = result;
        renderView(state);
    })
    .catch(error => {
        console.log('Что-то пошло не так');
    });
// Реализовать setInterval. Он каждую секунду меняет time у state и пердает весь state в renderView
setInterval(function () {
    state.time = new Date();
    renderView(state);
}, 1000);
renderView(state);