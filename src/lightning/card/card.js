import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { isNarrow, isBase } from './utils';

/**
 * @slot title The card title, which can be represented by a `header` or `h1` element.
 * The title is displayed at the top of the card, to the right of the icon.
 * Alternatively, use the `title` attribute if you don't need to pass in extra markup in your title.
 * @slot actions Actionable components, such as `lightning-button` or `lightning-button-menu`.
 * Actions are displayed on the top right corner of the card next to the title.
 * @slot footer The card footer, which is displayed at the bottom of the card and is usually optional.
 * For example, the footer can display a "View All" link to navigate to a list view.
 */
/**
 * Cards apply a container around a related grouping of information.
 */
export default class LightningCard extends LightningElement {
    /**
     * The title can include text, and is displayed in the header.
     * To include additional markup or another component, use the title slot.
     *
     * @type {string}
     */
    @api title;

    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     * The icon is displayed in the header to the left of the title.
     *
     * @type {string}
     */
    @api iconName;

    @track privateVariant = 'base';

    set variant(value) {
        if (isNarrow(value) || isBase(value)) {
            this.privateVariant = value;
        } else {
            this.privateVariant = 'base';
        }
    }

    /**
     * The variant changes the appearance of the card.
     * Accepted variants include base or narrow.
     * This value defaults to base.
     *
     * @type {string}
     * @default base
     */
    @api
    get variant() {
        return this.privateVariant;
    }

    renderedCallback() {
        const footerWrapper = this.template.querySelector('.slds-card__footer');
        const noFooterContent = this.template.querySelector(
            'slot[name="footer"] [data-id="default-content"]'
        );
        if (noFooterContent) {
            if (footerWrapper.remove) {
                footerWrapper.remove();
            } else if (footerWrapper.parentNode) {
                // IE11 doesn't support remove. https://caniuse.com/#feat=childnode-remove
                // TODO: remove when lwc can polyfill node.remove.
                footerWrapper.parentNode.removeChild(footerWrapper);
            }
        }
    }

    get computedWrapperClassNames() {
        return classSet('slds-card').add({
            'slds-card_narrow': isNarrow(this.privateVariant),
        });
    }

    get hasIcon() {
        return !!this.iconName;
    }

    get hasStringTitle() {
        return !!this.title;
    }
}
