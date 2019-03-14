import { LightningElement, api, track } from 'lwc';
import {
    normalizeParam,
    computeLayoutClass,
    HORIZONTAL_ALIGN,
    VERTICAL_ALIGN,
    BOUNDARY,
} from './styleUtils';
import { normalizeBoolean } from 'lightning/utilsPrivate';

/**
 * Represents a responsive grid system for arranging containers on a page.
 */
export default class LightningLayout extends LightningElement {
    /**
     * Determines how to spread the layout items horizontally.
     * The alignment options are center, space, spread, and end.
     * @type {string}
     * @default
     */
    @api
    get horizontalAlign() {
        return this._horizontalAlign;
    }
    set horizontalAlign(value) {
        this._horizontalAlign = normalizeParam(value, HORIZONTAL_ALIGN);
        this.updateClassList();
    }
    @track _horizontalAlign;

    /**
     * Determines how to align the layout items vertically in the container.
     * The alignment options are start, center, end, and stretch.
     * @type {string}
     * @default
     */
    @api
    get verticalAlign() {
        return this._verticalAlign;
    }
    set verticalAlign(value) {
        this._verticalAlign = normalizeParam(value, VERTICAL_ALIGN);
        this.updateClassList();
    }
    @track _verticalAlign;

    /**
     * Pulls layout items to the layout boundaries and corresponds
     * to the padding size on the layout item. Possible values are small, medium, or large.
     * @type {string}
     * @default
     *
     */
    @api
    get pullToBoundary() {
        return this._pullToBoundary;
    }
    set pullToBoundary(value) {
        this._pullToBoundary = normalizeParam(value, BOUNDARY);
        this.updateClassList();
    }
    @track _pullToBoundary;

    /**
     * If present, layout items wrap to the following line when they exceed the layout width.
     * @type {boolean}
     * @default false
     */
    @api
    get multipleRows() {
        return this._multipleRows || false;
    }
    set multipleRows(value) {
        this._multipleRows = normalizeBoolean(value);
        this.updateClassList();
    }
    @track _multipleRows;

    _layoutClass = [];

    connectedCallback() {
        this.updateClassList();
    }

    updateClassList() {
        this.classList.remove(...this._layoutClass);
        const config = computeLayoutClass(
            this.horizontalAlign,
            this.verticalAlign,
            this.pullToBoundary,
            this.multipleRows
        );
        this._layoutClass = Object.keys(config);
        this.classList.add(...this._layoutClass);
    }
}
