import { LightningElement } from 'lwc';

export default class TreeLinks extends LightningElement {
    items = [
        {
            label: 'Go to Salesforce.com',
            name: '1',
            href: 'https://salesforce.com',
        },
        {
            label: 'Go to Google.com',
            name: '2',
            href: 'https://google.com',
        },
        {
            label: 'Go to Developer.salesforce.com',
            name: '3',
            href: 'https://developer.salesforce.com',
        },
        {
            label: 'Go to Trailhead.salesforce.com',
            name: '3',
            href: 'https://trailhead.salesforce.com',
        },
    ];
}
