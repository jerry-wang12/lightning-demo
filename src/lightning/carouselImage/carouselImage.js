import { api, track, LightningElement } from 'lwc';
import { assert, guid } from 'lightning/utilsPrivate';

/**
 * Class representing a Ligthing Carousel Image.
 * It displays an image on the page with a description and title
 * @extends Element
 */
export default class LightningCarouselImage extends LightningElement {
    /**
     * {String} src - The image source
     */
    @api
    get src() {
        return this._src;
    }
    @track _src;
    set src(value) {
        this._src = value;
        this.validateSrc();
    }

    /**
     * {String} header - The header label
     */
    @api header;

    /**
     * {String} description - The description of the Image Card
     */
    @api description;

    /**
     * {String} alternativeText - The alt attribute of the image
     */
    @api
    get alternativeText() {
        return this._alternativeText;
    }
    @track _alternativeText;
    set alternativeText(value) {
        this._alternativeText = value;
        this.validateAlternativeText();
    }

    /**
     * {String} href - The link for the call to action
     */
    @api href;

    /**
     * {String} ariaHidden - The aria hidden attribute
     */
    @track ariaHidden = 'true';

    /**
     * {String} ariaLabelledby - The aria labeled by attribute
     * This is used by the aria-labeledby attribute and it needs to match
     * the id of the carousel's pagination item
     */
    @track ariaLabelledby;

    /**
     * {String} computedId - the ID of the tabpanel element
     */
    @track computedId;

    /**
     * {String} tabIndex - the tabindex of the main image's anchor
     */
    @track tabIndex = '-1';

    /**
     * {Boolean} selected - Flag to indicate if the carousel image is selected
     */
    _selected = false;

    initialRender = true;

    /**
     * Carousel Image constructor. We initialize some default values and set the className attribute
     */
    constructor() {
        super();
        this.selected = false;
    }

    /**
     * setter function for the _selected attribute.
     * It also calls the classListMutation with the new value
     * @param {Boolean} value -  The value of the active item in
     */
    set selected(value) {
        this._selected = value;

        if (value === true) {
            this.ariaHidden = 'false';
            this.setTabIndex('0');
        } else {
            this.ariaHidden = 'true';
            this.setTabIndex('-1');
        }
    }

    get selected() {
        return this._selected;
    }

    setLabelledBy(value) {
        this.panelElement.setAttribute('aria-labelledby', value);
    }

    /**
     * setter function for the tabIndex attribute.
     * @param {String} value -  The value of the active item in
     */
    setTabIndex(value) {
        this.tabIndex = value;
    }

    /**
     * {Function} select - Marks and displays the image as selected
     */
    select() {
        const privateimageselect = new CustomEvent('privateimageselect', {
            bubbles: true,
            composed: true,
        });

        this.selected = true;
        this.dispatchEvent(privateimageselect);
    }

    /**
     * {Function} unselect - Hides the image. Set's the selected property to false.
     */
    unselect() {
        this.selected = false;
    }

    /**
     * {Function} isSelected - Hides the image. Set's the selected property to false
     * @returns  {Boolean} the selected property.
     */
    isSelected() {
        return this.selected;
    }

    validateAll() {
        this.validateAlternativeText();
        this.validateSrc();
    }
    validateAlternativeText() {
        assert(
            typeof this._alternativeText === 'string' &&
                this._alternativeText.length,
            `<lightning-carousel-image> The "alternative-text" attribute value is required.`
        );
    }
    validateSrc() {
        assert(
            typeof this._src === 'string' && this._src.length,
            `<lightning-carousel-image> The "src" attribute value is required.`
        );
    }

    /**
     * Once we are connected, we fire a register event so the Carousel component can register
     * the carousel images.
     */
    renderedCallback() {
        if (this.initialRender) {
            this.validateAll();
            this.panelElement = this.template.querySelector('div');

            const privateimageregister = new CustomEvent(
                'privateimageregister',
                {
                    bubbles: true,
                    composed: true,
                    detail: {
                        callbacks: {
                            select: this.select.bind(this),
                            unselect: this.unselect.bind(this),
                            isSelected: this.isSelected.bind(this),
                            setTabIndex: this.setTabIndex.bind(this),
                            setLabelledBy: this.setLabelledBy.bind(this),
                        },
                        contentId: this.panelElement.getAttribute('id'),
                        guid: guid(),
                    },
                }
            );

            this.classList.add('slds-carousel__panel');
            this.dispatchEvent(privateimageregister);
            this.initialRender = false;
        }
    }
}
