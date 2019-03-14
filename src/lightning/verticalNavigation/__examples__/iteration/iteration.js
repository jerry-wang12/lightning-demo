import { LightningElement } from 'lwc';

const sections = [
    {
        label: 'Reports',
        items: [
            {
                label: 'Recent',
                name: 'default_recent',
                icon: 'utility:clock',
            },
            {
                label: 'Created by Me',
                name: 'default_created',
            },
            {
                label: 'Public Reports',
                name: 'default_public',
            },
            {
                label: 'My P1 Bugs',
                name: 'custom_p1bugs',
            },
        ],
    },

    {
        label: 'Dashboards',
        items: [
            {
                label: 'Favorites',
                name: 'default_favorites',
                icon: 'utility:favorite',
            },
            {
                label: 'Most Popular',
                name: 'custom_mostpopular',
            },
            {
                label: 'Summer Release Metrics',
                name: 'custom_newreleaseadoption',
            },
        ],
    },
];

export default class LightningExampleVerticalNavIteration extends LightningElement {
    initiallySelected = 'default_recent';
    navigationData = sections;
}
