import labelCancelButton from '@salesforce/label/LightningColorPicker.cancelButton';
import labelCustomTab from '@salesforce/label/LightningColorPickerPanel.customTab';
import labelDefaultTab from '@salesforce/label/LightningColorPickerPanel.defaultTab';
import labelDoneButton from '@salesforce/label/LightningColorPicker.doneButton';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { keyCodes } from 'lightning/utilsPrivate';

const i18n = {
    cancelButton: labelCancelButton,
    customTab: labelCustomTab,
    defaultTab: labelDefaultTab,
    doneButton: labelDoneButton,
};

const DEFAULT_COLOR = '#000000';
export default class LightningColorPickerPanel extends LightningElement {
    @api currentColor;

    @track
    state = {
        isCustomTabActive: false,
        selectedColor: null,
    };

    connectedCallback() {
        this.state.selectedColor = this.currentColor || DEFAULT_COLOR;
    }

    get i18n() {
        return i18n;
    }

    get computedClassDefault() {
        return classSet({
            'slds-tabs_default__item': true,
            'slds-is-active': !this.state.isCustomTabActive,
        }).toString();
    }

    get computedClassCustom() {
        return classSet({
            'slds-tabs_default__item': true,
            'slds-is-active': this.state.isCustomTabActive,
        }).toString();
    }

    get ariaSelectedDefault() {
        return !this.state.isCustomTabActive.toString();
    }

    get ariaSelectedCustom() {
        return this.state.isCustomTabActive.toString();
    }

    handleTabChange(event) {
        event.preventDefault();
        const tabElement = event.currentTarget;
        if (tabElement.classList.contains('slds-is-active')) {
            return;
        }
        this.state.isCustomTabActive = tabElement.title !== i18n.defaultTab;
    }

    handleUpdateSelectedColor(event) {
        this.state.selectedColor = event.detail.color;
    }

    dispatchUpdateColorEventWithColor(color) {
        this.dispatchEvent(
            // eslint-disable-next-line lightning-global/no-custom-event-bubbling
            new CustomEvent('updatecolor', {
                composed: true,
                bubbles: true,
                detail: { color },
            })
        );
    }

    handleDoneClick() {
        this.dispatchUpdateColorEventWithColor(this.state.selectedColor);
    }

    handleCancelClick() {
        this.dispatchUpdateColorEventWithColor(this.currentColor);
    }

    handleKeydown(event) {
        if (event.keyCode === keyCodes.escape) {
            event.preventDefault();
            this.dispatchUpdateColorEventWithColor(this.currentColor);
        } else if (
            event.shiftKey &&
            event.keyCode === keyCodes.tab &&
            event.srcElement.dataset.id === 'color-anchor'
        ) {
            event.preventDefault();
            this.template.querySelector('button[name="done"]').focus();
        } else if (
            !event.shiftKey &&
            event.keyCode === keyCodes.tab &&
            event.srcElement.name === 'done'
        ) {
            event.preventDefault();
            this.template
                .querySelector('lightning-color-picker-custom')
                .focus();
        }
    }
}
