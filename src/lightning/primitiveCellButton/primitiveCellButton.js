import { LightningElement, api, track } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';

export default class PrivateCellButton extends LightningElement {
    @api rowKeyValue;
    @api colKeyValue;
    @api variant;
    @api label;
    @api iconName;
    @api iconPosition;
    @api buttonName;
    @api buttonClass;
    @api buttonTitle;
    @api internalTabIndex;
    @api type;
    @api alternativeText; // from type=button-icon
    @api iconClass; // from type=button-icon

    initialRender = true;
    buttonHasFocus = false;

    @track
    state = {
        disabled: false,
    };

    @api
    focus() {
        const buttonCustomElement = this.buttonCustomElement;

        if (buttonCustomElement) {
            buttonCustomElement.focus();
        }
    }

    get computedTitle() {
        return this.buttonTitle || this.label;
    }

    @api
    get disabled() {
        return this.state.disabled;
    }

    set disabled(value) {
        const newValue = normalizeBoolean(value);
        const oldValue = this.state.disabled;
        if (oldValue === false && newValue === true && this.buttonHasFocus) {
            this.fireCellFalseBlurred();
        }
        this.state.disabled = newValue;
    }

    get isButtonIconType() {
        return this.type === 'button-icon';
    }

    renderedCallback() {
        if (this.initialRender) {
            this.addListeners();
        }
        this.initialRender = false;
    }

    get buttonCustomElement() {
        const qs = this.isButtonIconType
            ? 'lightning-button-icon'
            : 'lightning-button';

        return this.template.querySelector(qs);
    }

    addListeners() {
        const buttonCustomElement = this.buttonCustomElement;

        buttonCustomElement.addEventListener(
            'focus',
            this.handleButtonFocused.bind(this)
        );
        buttonCustomElement.addEventListener(
            'blur',
            this.handleButtonBlurred.bind(this)
        );
    }

    handleButtonFocused(event) {
        if (event.target.localName.indexOf('button') > -1) {
            this.buttonHasFocus = true;
        }
    }

    handleButtonBlurred(event) {
        if (event.target.localName.indexOf('button') > -1) {
            this.buttonHasFocus = false;
        }
    }

    fireCellFalseBlurred() {
        const { rowKeyValue, colKeyValue } = this;
        this.dispatchEvent(
            new CustomEvent('privatecellfalseblurred', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    rowKeyValue,
                    colKeyValue,
                },
            })
        );
    }

    handleButtonClick() {
        const { rowKeyValue, colKeyValue } = this;
        // fire this event in the next tick so that dt can do things it has to do for correct focus
        // eslint-disable-next-line lwc/no-set-timeout
        setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent('privatecellbuttonclicked', {
                    composed: true,
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        rowKeyValue,
                        colKeyValue,
                    },
                })
            );
        }, 0);
    }
}
