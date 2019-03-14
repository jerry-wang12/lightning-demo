import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/input';

// eslint-disable-next-line no-undef
measure('input', 50, benchmark, run, (tag, run) => {
    const elements = [];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.name = `input${i}`;
        element.label = `Input ${i}`;
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('change value', i => {
        elements[i].value = 'Hello, World!';
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
