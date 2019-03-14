import { LightningElement, api, track, unwrap } from 'lwc';
import {
    classListMutation,
    guid,
    normalizeString,
} from 'lightning/utilsPrivate';
import labelOpenInGoogleMaps from '@salesforce/label/LightningMap.openInGoogleMaps';
import labelCoordinatesTitle from '@salesforce/label/LightningMap.coordinatesTitle';
import { formatAddress, titleCase } from './mapUtils';
import { getCoreInfo } from 'lightning/configProvider';

const i18n = {
    openInGoogleMapsString: labelOpenInGoogleMaps,
    coordinatesTitleString: labelCoordinatesTitle,
};

const DOMAIN_PREFIX = guid();
const EXTERNAL_GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/';

/**
 * Displays a map with markers for one or more locations.
 */
export default class LightningMap extends LightningElement {
    @track
    state = {
        mapHref: EXTERNAL_GOOGLE_MAPS_URL,
        coordinates: [],
        activeCoordinate: null,
        markersTitle: i18n.coordinatesTitleString,
    };

    privateZoomLevel = null;
    privateCenter = null;
    privateMarkers = null;

    /**
     * @name privateCoordinateItems
     * @type {Array}
     * @private
     * Array that holds all the child primitiveCoordinateItem(s).
     */
    privateCoordinateItems = [];

    mapDomain = `https://${DOMAIN_PREFIX}${
        getCoreInfo().untrustedContentDomain
    }:${getCoreInfo().securePort}`;

    mapSrc = `${
        this.mapDomain
    }/lightningmaps/mapsloader?resource=container&cache=218`;

    /**
     * If present, the footer element is displayed.
     * The footer is displayed at the bottom of the map with a link that opens an external window.
     * The link is in the format https://www.google.com/maps/place/your+address+here.
     *
     * @type {Boolean}
     * @default false
     */
    @api showFooter = false;

    /**
     * @param {Integer} value - Corresponds to zoom levels defined in Google Maps API
     * If not specified, automatically chooses an appropriate zoom level
     * to show all markers with comfortable margins.
     */
    set zoomLevel(value) {
        this.privateZoomLevel = value;
        this.postToIframe({ zoomLevel: this.privateZoomLevel });
    }

    /**
     * The zoom levels as defined by Google Maps API.
     * If a zoom level is not specified, a default zoom level is applied to accommodate all markers on the map.
     * @type {number}
     */
    @api
    get zoomLevel() {
        return this.privateZoomLevel;
    }

    /**
     * @param {Object} value - A single address value to center the map around
     */
    set center(value) {
        this.privateCenter = value;
        const computedCenter = this.primitivifyMarker(unwrap(this.center));
        this.postToIframe({ center: computedCenter });
    }

    /**
     * Centers the map according to a specific `map-marker` object.
     * If a map marker is not specified, the map centers automatically.
     *
     * @type {object}
     */
    @api
    get center() {
        return this.privateCenter;
    }

    /**
     * Setter for the markersTitle property.
     * @param {String} title - A title string for the list of locations
     */
    set markersTitle(title) {
        this.state.markersTitle = titleCase(title);
    }

    /**
     * Provides the heading title for the markers. Required if specifying multiple markers.
     * The title is displayed below the map as a header for the list of clickable addresses.
     *
     * @type {string}
     */
    @api
    get markersTitle() {
        return this.state.markersTitle;
    }

    /**
     * Setter function, for mapMarkers.
     * Depending on the number of markers passed, we display a single view map or
     * a map with multiple markers and a list of coordinates
     * @param {Object[]} mapMarkers - the markers array with the following format:
     * map-markers = [
     *  {
     *      City: 'San Francisco',
     *      Country: 'USA',
     *      PostalCode: '94105',
     *      state: 'CA',
     *      street: '50 Fremont St',
     *      // Extra info for tile in sidebar
     *      icon: 'standard:account',
     *      title: 'Julies Kitchen', // e.g. Account.Name
     *  },
     *  {
     *      City: 'San Francisco',
     *      Country: 'USA',
     *      PostalCode: '94105',
     *      State: 'CA',
     *      Street: '30 Fremont St.',
     *      icon: 'standard:account',
     *      title: 'Tender Greens', // e.g. Account.Name
     *  }
     */
    set mapMarkers(mapMarkers) {
        this.privateMarkers = mapMarkers;
        this.initMarkers(mapMarkers);
        this.state.activeCoordinate = mapMarkers[0];
    }

    /**
     * One or more objects with the address or latitude and longitude to be displayed on the map.
     * If latitude and longitude are provided, the address is ignored.
     * @type {array}
     * @required
     */
    @api
    get mapMarkers() {
        return this.privateMarkers;
    }

    /**
     * getter for the i18 constant containing the localized strings
     */
    get i18n() {
        return i18n;
    }

    get multipleCoordinates() {
        return this.state.coordinates && this.state.coordinates.length > 1;
    }

    /**
     * returns the href link to open the map on an external window.
     * e.g. "https://www.google.com/maps/place/1+Market+St,+San+Francisco,+CA+94105"
     */
    get mapHref() {
        const activeCoordinate = this.state.activeCoordinate.location;
        let mapHrefURL = '';

        if (activeCoordinate.Latitude && activeCoordinate.Longitude) {
            mapHrefURL = encodeURI(
                `${EXTERNAL_GOOGLE_MAPS_URL}${activeCoordinate.Latitude},${
                    activeCoordinate.Longitude
                }`
            );
        } else {
            mapHrefURL = encodeURI(
                `${EXTERNAL_GOOGLE_MAPS_URL}${normalizeString(
                    activeCoordinate.Street
                )}+${normalizeString(activeCoordinate.City)}+${normalizeString(
                    activeCoordinate.State
                )}+${normalizeString(activeCoordinate.PostalCode)}`
            );
        }
        return mapHrefURL;
    }

    connectedCallback() {
        classListMutation(this.classList, {
            'slds-grid': true,
            'slds-has-coordinates': this.multipleCoordinates,
        });
    }

    /**
     * Function to normalize and store the coordinates being passed.
     * We store an array with all the coordindates as well as a map for easy access.
     * @param {Object} mapMarkers - Array of Coordindates
     */
    initMarkers(mapMarkers) {
        const mapMarkersLength = mapMarkers.length;
        const coordinates = [];
        const coordinatesMap = {};
        let i = 0,
            coordinate = {},
            key;

        for (i; i < mapMarkersLength; i++) {
            key = guid();
            coordinate = unwrap(mapMarkers[i]);
            coordinate.key = key;
            coordinate.formattedAddress = formatAddress(coordinate.location);
            if (!coordinate.icon) {
                coordinate.icon = 'standard:location';
            }
            coordinates.push(coordinate);
            coordinatesMap[key] = coordinate;
        }

        this.state.coordinates = coordinates;
        this.state.coordinatesMap = coordinatesMap;

        const markers = this.state.coordinates.map(marker =>
            this.primitivifyMarker(marker)
        );

        this.postToIframe({ markers });
    }

    handleCoordinateRegister(event) {
        event.stopPropagation(); // suppressing event since its not part of public API
        this.privateCoordinateItems.push(event.srcElement);
    }

    /**
     * Click handler for the coordinate click.
     * On click we post the coordinate key to the primitive map so it can get selected
     * @param {Object} event - The event object containing the key of the coordinate clicked
     */
    handleCoordinateClick(event) {
        const key = event.detail.key;
        const activeCoordinate = this.state.coordinatesMap[key];
        this.state.activeCoordinate = activeCoordinate;

        this.state.activeMarkerId = key;

        // unselect other child coordinateitems
        this.privateCoordinateItems.forEach(coordinate => {
            if (coordinate.guid === key) {
                coordinate.selected = true;
            } else {
                coordinate.selected = false;
            }
        });

        this.postToIframe({
            activeMarkerId: this.state.activeMarkerId,
        });
    }

    /**
     * Click handler for the coordinate hover.
     * @param {Object} event - The event object containing the key of the coordinate hovered
     */
    handleCoordinateHover(event) {
        this.state.hoverMarkerId = event.detail.key;
        this.postToIframe({
            hoverMarkerId: this.state.hoverMarkerId,
        });
    }

    /**
     * Create marker for sending to primitive map.
     * Extract only information that is relevant to primitive map
     * @param {Object} marker  - a marker containing location and related information.
     * @returns {Object} marker - a marker with only keys relevant to primitive map.
     */
    primitivifyMarker(marker) {
        let primitifiedMarker = null;

        if (marker && marker.location) {
            primitifiedMarker = {
                key: marker.key,
                title: marker.title,
                description: marker.description,
                ...marker.location,
            };
        }

        return primitifiedMarker;
    }

    /**
     * Method helper to posts messages to the map iframe
     * @param {Object} data - The payload to post to the iframe
     */
    postToIframe(data) {
        if (this.iframeLoaded) {
            this.mapIframe.callbacks.postToWindow(data);
        }
    }

    /**
     * handler function for when the iframe is loaded, at which point we
     * store a reference for the callback postToWindow method for iframe communication.
     * We also post the first payload of coordindates to the primitive map
     * @param {Object} event - The event object containing the postToWindow callback
     */
    handleIframeLoad(event) {
        const center = this.center
            ? this.primitivifyMarker(unwrap(this.center))
            : null;
        const zoomLevel = this.zoomLevel;
        const markers = unwrap(this.state.coordinates).map(marker =>
            this.primitivifyMarker(marker)
        );

        this.iframeLoaded = true;
        this.mapIframe = event.detail;
        this.postToIframe({ center, markers, zoomLevel });
    }
}
