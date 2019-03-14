import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/formattedText';

// eslint-disable-next-line no-undef
measure('formatted-text', 200, benchmark, run, (tag, run) => {
    const elements = [];
    const values = [
        'Please format me.',
        'When formatting text,\nOne can choose whether or not,\nTo write a haiku.',
        'Feel free to linkify this www.salesforce.com link.',
    ];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.value = values[i % 3];
        element.linkify = !(i % 2);
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
