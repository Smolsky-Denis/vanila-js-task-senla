import {logo} from './components/logo/logo.js';
import {clock} from './components/clock/clock.js';
import {infoBox} from  './components/infoBox/infoBox.js';
import {employeeTypes} from './mockData/employeeTypes.js';

function App() {
    const root = document.getElementById('root');

    root.appendChild(logo());
    root.appendChild(clock());

    employeeTypes.map(item => {
        root.appendChild(infoBox(item.type, item.description, item.count));
    });
}

App();

