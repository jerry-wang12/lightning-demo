import { LightningElement, api } from 'lwc';
import labelEmailLabel from '@salesforce/label/LightningFormattedEmail.emailIconLabel';

// Temporary workaround until we get real label support. New label entries must
// also be added to the static `labels` prop inside the class.
// https://git.soma.salesforce.com/raptor/raptor/issues/196
const i18n = {
    emailLabel: labelEmailLabel,
};

/**
 * Displays an email as a hyperlink with the mailto: URL scheme.
 */
export default class LightningFormattedEmail extends LightningElement {
    /**
     * The email address that's displayed if a label is not provided.
     * @type {string}
     * @required
     */
    @api value;

    /**
     * The text label for the email address.
     * @type {string}
     *
     */
    @api label;

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * A value of 0 means that the element is focusable and
     * participates in sequential keyboard navigation. A value of -1 means
     * that the element is focusable but does not participate in keyboard navigation.
     * @type {number}
     *
     */
    @api tabIndex;

    /**
     * If present, the email icon is hidden and only the email address is displayed.
     * @type {boolean}
     * @default false
     */
    @api hideIcon;

    _connected = false;

    connectedCallback() {
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * Sets focus on the element.
     */
    @api
    focus() {
        if (this.emailAnchor) {
            this.emailAnchor.focus();
        }
    }

    /**
     * Removes keyboard focus from the element.
     */
    @api
    blur() {
        if (this.emailAnchor) {
            this.emailAnchor.blur();
        }
    }

    /**
     * Clicks the email address and opens the default email app.
     */
    @api
    click() {
        const anchor = this.emailAnchor;
        if (anchor && anchor.click) {
            anchor.click();
        }
    }

    get emailAnchor() {
        if (this._connected && this.hasValue) {
            return this.template.querySelector('a');
        }
        return undefined;
    }

    get trimmedValue() {
        return (this.value || '').trim();
    }

    get trimmedLabel() {
        return (this.label || '').trim();
    }

    get hasValue() {
        return !!this.trimmedValue;
    }

    get href() {
        return 'mailto:' + this.trimmedValue;
    }

    get computedLabel() {
        return this.trimmedLabel || this.trimmedValue;
    }

    get i18n() {
        return i18n;
    }
}
