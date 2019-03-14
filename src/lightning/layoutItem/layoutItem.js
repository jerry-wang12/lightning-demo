import { LightningElement, api, track } from 'lwc';
import {
    normalizeFlexibility,
    normalizePadding,
    validateSize,
    computeLayoutClass,
    normalizeSize,
    normalizeDirection,
} from './styleUtils';

/**
 * The basic element of `lightning-layout`.
 * A layout item groups information together to define visual grids, spacing, and sections.
 */
export default class LightningLayoutItem extends LightningElement {
    /**
     * Make the item fluid so that it absorbs any extra space in its
     * container or shrinks when there is less space. Allowed values are:
     * auto (columns grow or shrink equally as space allows),
     * shrink (columns shrink equally as space decreases),
     * no-shrink (columns don't shrink as space reduces),
     * grow (columns grow equally as space increases),
     * no-grow (columns don't grow as space increases),
     * no-flex (columns don't grow or shrink as space changes).
     * Use a comma-separated value for multiple options, such as 'auto, no-shrink'.
     * @type {object}
     */
    @api
    get flexibility() {
        return this._flexibility;
    }
    set flexibility(value) {
        this._flexibility = normalizeFlexibility(value);
        this.updateClassList();
    }
    @track _flexibility;

    /**
     * Specifies a direction to bump the alignment of adjacent layout items. Allowed values are left, top, right, bottom.
     * @type {string}
     */
    @api
    get alignmentBump() {
        return this._alignmentBump;
    }
    set alignmentBump(value) {
        this._alignmentBump = normalizeDirection(value);
        this.updateClassList();
    }
    @track _alignmentBump;

    /**
     * Sets padding to either the right and left sides of a container,
     * or all sides of a container. Allowed values are horizontal-small,
     * horizontal-medium, horizontal-large, around-small, around-medium, around-large.
     * @type {string}
     */
    @api
    get padding() {
        return this._padding;
    }
    set padding(value) {
        this._padding = normalizePadding(value);
        this.updateClassList();
    }
    @track _padding;

    /**
     * If the viewport is divided into 12 parts, size indicates the
     * relative space the container occupies. Size is expressed as
     * an integer from 1 through 12. This applies for all device-types.
     * @type {number}
     */
    @api
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = normalizeSize(value);
        this.validateSize();
        this.updateClassList();
    }
    @track _size;

    /**
     * If the viewport is divided into 12 parts, this attribute indicates
     * the relative space the container occupies on device-types larger than
     * mobile. It is expressed as an integer from 1 through 12.
     * @type {number}
     */
    @api
    get smallDeviceSize() {
        return this._smallDeviceSize;
    }
    set smallDeviceSize(value) {
        this._smallDeviceSize = normalizeSize(value);
        this.validateSize();
        this.updateClassList();
    }
    @track _smallDeviceSize;

    /**
     * If the viewport is divided into 12 parts, this attribute indicates
     * the relative space the container occupies on device-types larger than
     * tablet. It is expressed as an integer from 1 through 12.
     * @type {number}
     */
    @api
    get mediumDeviceSize() {
        return this._mediumDeviceSize;
    }
    set mediumDeviceSize(value) {
        this._mediumDeviceSize = normalizeSize(value);
        this.validateSize();
    }
    @track _mediumDeviceSize;

    /**
     * If the viewport is divided into 12 parts, this attribute indicates
     * the relative space the container occupies on device-types larger than
     * desktop. It is expressed as an integer from 1 through 12.
     * @type {number}
     */
    @api
    get largeDeviceSize() {
        return this._largeDeviceSize;
    }
    set largeDeviceSize(value) {
        this._largeDeviceSize = normalizeSize(value);
        this.validateSize();
        this.updateClassList();
    }
    @track _largeDeviceSize;

    _layoutClass = [];

    connectedCallback() {
        this.updateClassList();
    }

    updateClassList() {
        this.classList.remove(...this._layoutClass);
        const config = computeLayoutClass(
            {
                default: this.size,
                small: this.smallDeviceSize,
                medium: this.mediumDeviceSize,
                large: this.largeDeviceSize,
            },
            this.flexibility,
            this.padding,
            this.alignmentBump
        );
        this._layoutClass = Object.keys(config);
        this.classList.add(...this._layoutClass);
    }

    validateSize() {
        validateSize(
            this.size,
            this.smallDeviceSize,
            this.mediumDeviceSize,
            this.largeDeviceSize
        );
    }
}
