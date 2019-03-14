import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/buttonIcon';

// eslint-disable-next-line no-undef
measure('button-icon', 50, benchmark, run, (tag, run) => {
    const elements = [];
    const variants = [
        'bare',
        'brand',
        'container',
        'border',
        'border-filled',
        'bare-inverse',
        'border-inverse',
    ];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.size = 'medium';
        element.iconName = 'action:approval';
        element.variant = variants[i % 7];
        element.alternativeText = 'Click to answer';
        element.selected = !(i % 20);
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
