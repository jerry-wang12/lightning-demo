import { LightningElement, api, track } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { updateRawLinkInfo } from 'lightning/routingService';
// eslint-disable-next-line lwc/no-aura-libs
import { addressFormat, utils as localeUtils } from 'lightning:IntlLibrary';

const MAP_HOST = 'https://www.google.com/maps/?q=';

/**
 * Displays a formatted address with a link to the given location on Google Maps.
 * The link is opened in a new tab.
 * A static map can be displayed with the address for better context.
 */
export default class LightningFormattedAddress extends LightningElement {
    @track
    state = {
        street: '',
        city: '',
        province: '',
        country: '',
        postalCode: '',
        latitude: '',
        longitude: '',
        disabled: false,
        mapUrl: '',
    };

    connected = false;
    connectedCallback() {
        this.connected = true;
        this.updateLinkInfo();
    }

    /**
     * The street detail for the address.
     * @type {string}
     *
     */
    @api
    get street() {
        return this.state.street;
    }
    set street(value) {
        this.state.street = value;
        this.updateLinkInfo();
    }

    /**
     * The city detail for the address.
     * @type {string}
     *
     */
    @api
    get city() {
        return this.state.city;
    }
    set city(value) {
        this.state.city = value;
        this.updateLinkInfo();
    }

    /**
     * The province detail for the address.
     * @type {string}
     *
     */
    @api
    get province() {
        return this.state.province;
    }
    set province(value) {
        this.state.province = value;
        this.updateLinkInfo();
    }

    /**
     * The country detail for the address.
     * @type {string}
     *
     */
    @api
    get country() {
        return this.state.country;
    }
    set country(value) {
        this.state.country = value;
        this.updateLinkInfo();
    }

    /**
     * The postal code detail for the address.
     * @type {string}
     *
     */
    @api
    get postalCode() {
        return this.state.postalCode;
    }
    set postalCode(value) {
        this.state.postalCode = value;
        this.updateLinkInfo();
    }

    /**
     * The latitude of the location if known. Latitude values must be within -90 and 90.
     * @type {number}
     *
     */
    @api
    get latitude() {
        return this.state.latitude;
    }
    set latitude(value) {
        this.state.latitude = value;
        this.updateLinkInfo();
    }

    /**
     * The longitude of the location if known. Longitude values must be within -180 and 180.
     * @type {number}
     *
     */
    @api
    get longitude() {
        return this.state.longitude;
    }
    set longitude(value) {
        this.state.longitude = value;
        this.updateLinkInfo();
    }

    /**
     * If present, the address is displayed as plain text and is not clickable.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this.state.disabled;
    }
    set disabled(value) {
        this.state.disabled = normalizeBoolean(value);
    }

    @track _showStaticMap;

    /**
     * Displays a static map of the location using Google Maps. This value defaults to false.
     * @default false
     */
    @api
    get showStaticMap() {
        return this._showStaticMap || false;
    }
    set showStaticMap(value) {
        this._showStaticMap = normalizeBoolean(value);
    }

    /**
     * Workaround for LWC Issue #1028
     * https://github.com/salesforce/lwc/issues/1028
     *
     * When we have two nested conditional templates wrapping
     * an iteration template, LWC fails to clear the template's content
     */
    get showPlainText() {
        return this.hasValue && this.isPlainText;
    }

    get showMapLink() {
        return this.hasValue && this.isMapLink;
    }

    get isPlainText() {
        return this.disabled;
    }

    get isMapLink() {
        return !this.disabled;
    }

    get hasValue() {
        return !!(
            this.street ||
            this.city ||
            this.province ||
            this.country ||
            this.postalCode
        );
    }

    get address() {
        const [langCode, countryCode] = localeUtils.getLocaleTag().split('-');
        return (
            addressFormat.formatAddressAllFields(langCode, countryCode, {
                address: this.street,
                city: this.city,
                state: this.province,
                country: this.country,
                zipCode: this.postalCode,
            }) || ''
        );
    }

    get addressLines() {
        return this.address.split('\n');
    }

    get mapQuery() {
        const { address, latitude, longitude } = this;
        return latitude && longitude ? `${latitude},${longitude}` : address;
    }

    get internalTabIndex() {
        return this.getAttribute('tabindex');
    }

    dispatcher = () => {};

    updateLinkInfo() {
        if (this.connected) {
            this.state.mapUrl = encodeURI(MAP_HOST + this.mapQuery);
            updateRawLinkInfo(this, this.state.mapUrl).then(linkInfo => {
                this.state.mapUrl = linkInfo.url;
                this.dispatcher = linkInfo.dispatcher;
            });
        }
    }

    handleClick(event) {
        this.dispatcher(event);
    }
}
