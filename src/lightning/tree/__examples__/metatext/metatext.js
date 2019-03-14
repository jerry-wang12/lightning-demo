import { LightningElement } from 'lwc';

export default class TreeMetatext extends LightningElement {
    items = [
        {
            label: 'Western Sales Director',
            name: '1',
            metatext: 'Jane Dough',
            expanded: true,
            items: [
                {
                    label: 'Western Sales Manager',
                    name: '2',
                    metatext: 'John Doe',
                    expanded: true,
                    items: [
                        {
                            label: 'CA Sales Rep',
                            name: '3',
                            metatext: 'Buck Rogers',
                            expanded: true,
                            items: [],
                        },
                        {
                            label: 'OR Sales Rep',
                            name: '4',
                            metatext: 'Flash Gordon',
                            expanded: true,
                            items: [],
                        },
                    ],
                },
            ],
        },
        {
            label: 'Eastern Sales Director',
            name: '5',
            metatext: 'Emma Frost',
            expanded: false,
            items: [
                {
                    label: 'Easter Sales Manager',
                    name: '6',
                    expanded: true,
                    items: [
                        {
                            label: 'NY Sales Rep',
                            name: '7',
                            metatext: 'John Crichton',
                            expanded: true,
                            items: [],
                        },
                        {
                            label: 'MA Sales Rep',
                            name: '8',
                            expanded: true,
                            items: [],
                        },
                    ],
                },
            ],
        },
        {
            label: 'International Sales Director',
            name: '9',
            metatext: 'Aeryn Sun',
            expanded: true,
            items: [
                {
                    label: 'Asia Sales Manager',
                    name: '10',
                    expanded: true,
                    items: [
                        {
                            label: 'Sales Rep1',
                            name: '11',
                            expanded: true,
                            items: [],
                        },
                        {
                            label: 'Sales Rep2',
                            name: '12',
                            expanded: true,
                            items: [],
                        },
                    ],
                },
                {
                    label: 'Europe Sales Manager',
                    name: '13',
                    expanded: false,
                    items: [
                        {
                            label: 'Sales Rep1',
                            name: '14',
                            expanded: true,
                            items: [],
                        },
                        {
                            label: 'Sales Rep2',
                            name: '15',
                            expanded: true,
                            items: [],
                        },
                    ],
                },
            ],
        },
    ];
}
