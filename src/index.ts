import App from 'c/hello-world-app';
import * as Engine from 'lwc';
import './assets/styles/salesforce-lightning-design-system.css';

const rootEl = document.body;
const element = Engine.createElement('c-app', { is: App });
rootEl.appendChild(element);
