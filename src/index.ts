import * as Engine from 'lwc';
import App from 'c/hello-world-app';
// import './assets/css/salesforce-lightning-design-system.css';

const rootEl = document.getElementById('root');
const element = Engine.createElement('c-app', { is: App });
rootEl.appendChild(element);
