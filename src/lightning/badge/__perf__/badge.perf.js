import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/badge';

// eslint-disable-next-line no-undef
measure('badge', 100, benchmark, run, (tag, run) => {
    const elements = [];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.label = 'Hello';
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
