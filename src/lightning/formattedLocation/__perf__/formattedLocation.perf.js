import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/formattedLocation';

// eslint-disable-next-line no-undef
measure('formatted-location', 20, benchmark, run, (tag, run) => {
    const elements = [];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.latitude = 37.7899;
        element.longitude = 122.3969;
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
