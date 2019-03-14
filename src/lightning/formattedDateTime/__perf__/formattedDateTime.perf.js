import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/formattedDateTime';

// eslint-disable-next-line no-undef
measure('formatted-date-time', 50, benchmark, run, (tag, run) => {
    const elements = [];
    const attributes = [
        {
            weekday: 'long',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
        },
    ];
    let date = 14e11;

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.value = date += 1e9;
        Object.assign(element, attributes[0]);
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
