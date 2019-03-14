import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/formattedNumber';

// eslint-disable-next-line no-undef
measure('formatted-number', 200, benchmark, run, (tag, run) => {
    const elements = [];
    const attributes = [
        { formatStyle: 'currency', value: 5050.5 },
        { formatStyle: 'decimal', value: 0.50505 },
        { formatStyle: 'percent', value: 0.505 },
        { formatStyle: 'percent-fixed', value: 50.5 },
    ];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        const { formatStyle, value } = attributes[i % 4];
        element.formatStyle = formatStyle;
        element.value = value;
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
