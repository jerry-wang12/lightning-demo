import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/formattedEmail';

// eslint-disable-next-line no-undef
measure('formatted-email', 50, benchmark, run, (tag, run) => {
    const elements = [];
    const email = 'abc@email.com';
    const label = 'my email';

    run('create', i => {
        const element = createElement(tag, { is: Element });
        if (i % 2) {
            element.label = label;
        }
        element.value = email;
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
