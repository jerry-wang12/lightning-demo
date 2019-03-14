import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/datatable';
import Store from './store';

// eslint-disable-next-line no-undef
measure('datatable', 1, benchmark, run, (tag, run) => {
    const created = new Store(50).data;
    const updated = new Store(50).updateData().data;
    const more = new Store(100).data;
    const added = [...updated, ...more];

    const columns = [
        { label: 'Who', fieldName: 'email', type: 'email' },
        { label: 'What', fieldName: 'text' },
        { label: 'When', fieldName: 'date', type: 'text' },
        { label: 'Where', fieldName: 'url', type: 'url' },
        { label: 'How Much', fieldName: 'number', type: 'number' },
    ];

    const elements = [];

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.keyField = 'id';
        element.columns = columns;
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('add 50 rows', i => {
        elements[i].data = created;
    });

    run('update 50 rows', i => {
        elements[i].data = updated;
    });

    run('add 100 rows', i => {
        elements[i].data = added;
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
