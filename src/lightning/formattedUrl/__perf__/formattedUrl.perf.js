import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/formattedUrl';

// eslint-disable-next-line no-undef
measure('formatted-url', 50, benchmark, run, (tag, run) => {
    const elements = [];
    const urls = [
        { label: 'Salesforce', value: 'https://www.salesforce.com/' },
        {
            label: 'Lightning Components',
            value: 'https://github.com/salesforce/lightning-components',
        },
        {
            label: 'Component Reference',
            value:
                'https://developer.salesforce.com/docs/component-library/overview/components',
        },
        {
            label: 'Lightning Design System',
            value: 'https://www.lightningdesignsystem.com/',
        },
        {
            label: 'Lightning Components Performance',
            value: 'https://lgc-perf.lwcjs.org/',
        },
    ];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        Object.assign(element, urls[i % 5]);
        element.target = '_blank';
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
