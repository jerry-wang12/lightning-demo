import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/formattedRichText';

// eslint-disable-next-line no-undef
measure('formatted-rich-text', 5, benchmark, run, (tag, run) => {
    const elements = [];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.value = 'This is <b>Salesforce</b>!';
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
