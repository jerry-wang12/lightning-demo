import { LightningElement, api, track } from 'lwc';
import { ratioToScale, calculateSize } from './util';
import {
    registerMessageHandler,
    createMessage,
    postMessage,
} from 'lightning/messageDispatcher';
import { guid } from 'lightning/utilsPrivate';
import {
    getLocale,
    getFormFactor,
    getCoreInfo,
} from 'lightning/configProvider';

const DOMAIN_PREFIX = guid();

const EVENT_NAME = {
    LOADING_MAP: 'loadingMap',
    STATIC_MAP_LOADED: 'lightning:staticMapLoaded',
};

export default class LightningStaticMap extends LightningElement {
    @api width;
    @api height;
    @api street;
    @api city;
    @api province;
    @api postalCode;
    @api country;

    _zoom = 14;
    _scale = 1;
    _mapType = 'roadmap';
    _format = 'png';

    secureDomain = `https://${DOMAIN_PREFIX}${
        getCoreInfo().untrustedContentDomain
    }:${getCoreInfo().securePort}`;

    apiDomain = `*`;

    @track _mapSrc;
    @track _mapLoaded = false;

    connectedCallback() {
        this._dispatchId = registerMessageHandler(event => {
            this.handleMessage(event);
        });

        this._scale = ratioToScale();
    }

    @track _latitude;
    @api
    get latitude() {
        return this._latitude;
    }
    set latitude(value) {
        if (value != null && value !== '') {
            this._latitude = parseFloat(value);
        }
    }

    @track _longitude;
    @api
    get longitude() {
        return this._longitude;
    }
    set longitude(value) {
        if (value != null && value !== '') {
            this._longitude = parseFloat(value);
        }
    }

    get size() {
        if (!this._size) {
            this._size = calculateSize(
                this.width,
                this.height,
                this.formFactor
            );
        }
        return `${this._size.width}x${this._size.height}`;
    }

    get formFactor() {
        return getFormFactor();
    }

    get markers() {
        return `color:red|${this.address}`;
    }

    get mapStyle() {
        if (this._mapLoaded) {
            return 'border: 0px; top: 0; left: 0; right: 0; bottom: 0; position: relative; overflow: hidden; display: inherit';
        }
        return 'display:none';
    }

    get hasValidAddress() {
        return !!(this.state || this.country || this.postalCode);
    }

    get staticMapSrc() {
        if (this.hasValidAddress) {
            return `${
                this.secureDomain
            }/lightningmaps/mapsloader?resource=staticMap&center=${
                this.address
            }&size=${this.size}&zoom=${this._zoom}&scale=${
                this._scale
            }&maptype=${this._mapType}&format=${this._format}&markers=${
                this.markers
            }&locale${getLocale().userLocaleLang}`;
        }

        return '';
    }

    get address() {
        // if latitude/longitude specified use that to avoid expensive Google geo-coding processing
        if (
            this.latitude != null &&
            this.latitude >= -90.0 &&
            this.latitude <= 90.0 &&
            this.longitude != null &&
            this.longitude >= -180.0 &&
            this.longitude <= 180.0
        ) {
            return `${this.latitude},${this.longitude}`;
        }

        return `${this.street} ${this.city} ${this.province} ${
            this.postalCode
        } ${this.country}`;
    }

    handleMessage(data) {
        if (data.event === EVENT_NAME.STATIC_MAP_LOADED) {
            this._mapLoaded = true;
        }
    }

    sendMessage(event, params) {
        if (this._handler) {
            const message = createMessage(
                this._dispatchId,
                event,
                params || {}
            );
            postMessage(this._handler, message, '*');
        }
    }

    handleIframeLoad(event) {
        this._handler = event.detail.callbacks.postToWindow;
        this.sendMessage(EVENT_NAME.LOADING_MAP, {});
    }
}
