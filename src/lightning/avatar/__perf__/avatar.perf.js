import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/avatar';

// eslint-disable-next-line no-undef
measure('avatar', 50, benchmark, run, (tag, run) => {
    const elements = [];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.initials = 'MB';
        element.fallbackIconName = 'standard:person_account';
        element.alternativeText = 'Mark Bench';
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
