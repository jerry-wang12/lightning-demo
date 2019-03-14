import { measure, main } from '../../../perf';
import { createElement } from 'lwc';
import Element from 'lightning/map';

// eslint-disable-next-line no-undef
measure('map', 10, benchmark, run, (tag, run) => {
    const elements = [];
    const markers = [
        'Salesforce Tower, 415 Mission St, San Francisco, CA, 94105, USA',
        'Salesforce Bellevue, 929 108th Ave NE, Bellevue, WA, 98004, USA',
        'Salesforce Toronto, 10 Bay Street, Toronto, ON, M5J 2R8, Canada',
        'Salesforce Chicago, 111 West Illinois St, Chicago, IL, 60654, USA',
        'Salesforce Atlanta, 950 East Paces Ferry Road NE, Atlanta, GA, 30326, USA',
    ].map(csv => {
        const data = csv.split(/\s*,\s*/g);
        const [title, Street, City, State, PostalCode, Country] = data;
        return {
            title,
            location: { Street, City, State, PostalCode, Country },
        };
    });

    run('create', i => {
        const element = createElement(tag, { is: Element });
        element.mapMarkers = markers;
        elements[i] = element;
    });

    run('append', i => {
        main.appendChild(elements[i]);
    });

    run('remove', i => {
        main.removeChild(elements[i]);
    });
});
