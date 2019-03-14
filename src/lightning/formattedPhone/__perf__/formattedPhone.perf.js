import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/formattedPhone';

// eslint-disable-next-line no-undef
measure('formatted-phone', 20, benchmark, run, (tag, run) => {
    const elements = [];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.value = '4255552255';
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
