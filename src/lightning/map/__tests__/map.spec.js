import { createElement } from 'lwc';
import {
    shadowQuerySelector,
    shadowQuerySelectorAll,
} from 'lightning/testUtils';
import Element from 'lightning/map';

const createMap = attributes => {
    const element = createElement('lightning-map', { is: Element });

    Object.assign(element, attributes);
    document.body.appendChild(element);

    return element;
};

const SINGLE_MARKER = [
    {
        location: {
            City: 'San Francisco',
            Country: 'USA',
            PostalCode: '94105',
            State: 'CA',
            Street: '101 Spear st',
        },
        title: 'Salesforce Rincon', // e.g. Account.Name
    },
];

const MULTIPLE_MARKERS = [
    {
        location: {
            City: 'San Francisco',
            Country: 'USA',
            PostalCode: '94105',
            State: 'CA',
            Street: '101 Spear st',
        },
        title: 'Salesforce Rincon', // e.g. Account.Name
    },
    {
        location: {
            City: 'San Francisco',
            Country: 'USA',
            PostalCode: '94105',
            State: 'CA',
            Street: '101 Spear st',
        },
        title: 'Salesforce Rincon', // e.g. Account.Name
    },
];

const MARKERS_LATLONG = [
    {
        location: {
            City: 'San Francisco',
            Country: 'USA',
            PostalCode: '94105',
            State: 'CA',
            Street: '101 Spear st',
            Latitude: '37.787940',
            Longitude: '-122.388290',
        },
        title: 'Salesforce Rincon', // e.g. Account.Name
    },
    {
        location: {
            City: 'San Francisco',
            Country: 'USA',
            PostalCode: '94105',
            State: 'CA',
            Street: '101 Spear st',
        },
        title: 'Salesforce Rincon', // e.g. Account.Name
    },
];

describe('lightning-map', () => {
    it('renders map with one marker and default attribute values', () => {
        const map = createMap({ mapMarkers: SINGLE_MARKER });

        return Promise.resolve().then(() => {
            expect(map.classList).toContain('slds-grid');
            expect(map.classList).not.toContain('slds-has-coordinates');
            expect(map.showFooter).toBe(false);
            expect(map.zoomLevel).toBe(null);
            expect(map.center).toEqual(null);
            expect(map.children).toHaveLength(1);
        });
    });

    it('renders map with two markers', () => {
        const map = createMap({ mapMarkers: MULTIPLE_MARKERS });

        return Promise.resolve().then(() => {
            expect(map.classList).toContain('slds-grid');
            expect(map.classList).toContain('slds-has-coordinates');
            const coordinatesList = shadowQuerySelector(
                map,
                '.slds-coordinates__list'
            );
            expect(coordinatesList.children).toHaveLength(2);
        });
    });

    it('renders map with a marker title', () => {
        const map = createMap({ mapMarkers: MULTIPLE_MARKERS });
        const title = 'My Go To Places';

        map.markersTitle = title;

        return Promise.resolve().then(() => {
            const header = shadowQuerySelector(map, '.slds-coordinates__title');
            expect(header.textContent).toBe(
                `${title} (${MULTIPLE_MARKERS.length})`
            );
        });
    });

    it('renders map with center around a latitude and longitude', () => {
        const map = createMap({ mapMarkers: MULTIPLE_MARKERS });

        map.center = {
            Langtitude: '-34',
            Longitude: '151',
        };

        return Promise.resolve().then(() => {
            expect(map.center.Langtitude).toBe('-34');
            expect(map.center.Longitude).toBe('151');
        });
    });

    it('renders map with a custom zoom', () => {
        const map = createMap({ mapMarkers: MULTIPLE_MARKERS });
        map.zoomLevel = 20;

        return Promise.resolve().then(() => {
            expect(map.zoomLevel).toBe(20);
        });
    });

    it('renders street and city even when Lat and Long are set', () => {
        const map = createMap({ mapMarkers: MARKERS_LATLONG });

        return Promise.resolve().then(() => {
            const coordinateItem = shadowQuerySelector(
                map,
                'lightning-primitive-coordinate-item'
            );
            const textDescription = shadowQuerySelectorAll(
                coordinateItem,
                '.slds-media__body span'
            )[1];

            expect(textDescription.textContent).toBe(
                '101 Spear st, San Francisco, CA'
            );
        });
    });

    it('renders map with no footer by default', () => {
        const map = createMap({ mapMarkers: MULTIPLE_MARKERS });

        return Promise.resolve().then(() => {
            const footer = shadowQuerySelector(map, 'footer');
            expect(footer).toBe(null);
        });
    });

    it('renders map with footer', () => {
        const map = createMap({ mapMarkers: MULTIPLE_MARKERS });
        map.showFooter = true;

        return Promise.resolve().then(() => {
            const footer = shadowQuerySelector(map, 'footer');
            expect(footer).toBeDefined();
        });
    });
});
