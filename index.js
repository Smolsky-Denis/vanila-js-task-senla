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

function sync(virtualNode, realNode) {
    if (virtualNode.props) {
        Object.entries(virtualNode.props).forEach(([name, value]) => {
            if (name === 'children' && name === 'key') {
                return;
            }

            if (realNode[name] !== value) {
                realNode[name] = value;
            }
        });
    }

    if (virtualNode.key) {
        realNode.dataset.key = virtualNode.key;
    }

    if (
        typeof virtualNode !== 'object' &&
        virtualNode !== realNode.nodeValue
    ) {
        realNode.nodeValue = virtualNode;
    }

    const virtualChildren = virtualNode.props
        ? virtualNode.props.children || []
        : [];

    const realChildren = realNode.childNodes;

    for (
        let i = 0;
        i < virtualChildren.length || i < realChildren.length;
        i++
    ) {
        const virtual = virtualChildren[i];
        const real = realChildren[i];


        if (virtual === undefined && real !== undefined) {
            realNode.remove(real);
        }

        if (
            virtual !== undefined &&
            real !== undefined &&
            (virtual.type || '') === (real.tagName || '').toLowerCase()
        ) {
            sync(virtual, real);
        }

        if (
            virtual !== undefined &&
            real !== undefined &&
            (virtual.type || '') !== (real.tagName || '').toLowerCase()
        ) {
            const newReal = createRealNodeByVirtual(virtual);
            sync(virtual, newReal);
            realNode.replaceChild(newReal, real);
        }

        if (virtual !== undefined && real === undefined) {
            const newReal = createRealNodeByVirtual(virtual);
            sync(virtual, newReal);

            realNode.appendChild(newReal);
        }
    }
}

function createRealNodeByVirtual(virtual) {
    if (typeof virtual !== 'object') {
        return document.createTextNode('');
    }
    return document.createElement(virtual.type);
}

function evaluate(virtualNode) {
    if (typeof virtualNode !== 'object') {
        return virtualNode;
    }

    if (typeof virtualNode.type === 'function') {
        return evaluate(virtualNode.type(virtualNode.props));
    }

    const props = virtualNode.props || {};

    return {
        ...virtualNode,
        props: {
            ...props,
            children: Array.isArray(props.children)
                ? props.children.map(evaluate)
                : [evaluate(props.children)],
        },
    };
}

function render(virtualDom, realDomRoot) {
    const evaluateVirtualDom = evaluate(virtualDom); // выполняем children и заполняем ответами

    const virtualDomRoot = {
        type: realDomRoot.tagName.toLowerCase(), //договоренность работы в нижнем регистре
        props: {
            id: realDomRoot.id,
            ...realDomRoot.attributes,
            children: [evaluateVirtualDom],
        },
    };
    sync(virtualDomRoot, realDomRoot);
}

// 3. Создать функцию renderView,
function renderView(state) {
    render(App(state), document.getElementById('root'));
}

function Header() {

    return {
        type: 'div',
        props: {
            className: 'header',
            children: [{type: Logo}]
        }
    }
}

function Logo() {

    return {
        type: 'img',
        props: {
            src: './icons/senla.svg',
        }
    }
}

function Preloader() {

    return {
        type: 'img',
        props: {
            className: 'preloader',
            src: './icons/preloader.svg',
        },
    };
}

function Clock({time}) {
    const isDay = time.getHours() >= 7 && time.getHours() <= 21;
debugger

    return {
        type: 'div',
        props: {
            className: 'clock',
            children: [
                {
                    type: 'span',
                    props: {
                        className: 'value',
                        children: [
                            `${time.toLocaleTimeString()} ${(isDay ? 'PM' : 'AM')}`,
                        ],
                    },
                }
            ],
        },
    }
}

function Lot({lot}) {

    return {
        type: 'article',
        key: lot.id,
        props: {
            className: 'lot',
            children: [
                {
                    type: 'div',
                    props: {
                        children: [
                            {
                                type: 'div',
                                props: {
                                    className: 'type',
                                    children: [lot.type],
                                },
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [lot.count]
                                },
                            },

                        ],
                    },
                },
                {
                    type: 'div',
                    props: {
                        children: [lot.description],
                    },
                },
            ],
        },
    };
}

function Lots({lots}) {
    if (lots === null) {
        return {
            type: Preloader,
            props: {},
        };
    }

    const children = lots.map(lot => ({
            type: Lot,
            props: {
                lot
            },
        })
    );

    return {
        type: 'div',
        props: {
            children
        }
    };
}

function App({time, lots}) {

    return {
        type: 'div',
        props: {
            className: 'app',
            children: [
                {
                    type: Header
                },
                {
                    type: Clock,
                    props: {
                        time
                    }
                },
                {
                    type: Lots,
                    props: {
                        lots
                    }
                }
            ]
        }
    };
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