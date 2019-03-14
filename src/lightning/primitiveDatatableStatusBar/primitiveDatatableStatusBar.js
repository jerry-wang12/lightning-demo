import { LightningElement, api, track } from 'lwc';
import labelSave from '@salesforce/label/LightningDatatable.save';
import labelCancel from '@salesforce/label/LightningDatatable.cancel';
import labelError from '@salesforce/label/LightningDatatable.error';

const i18n = {
    save: labelSave,
    cancel: labelCancel,
    error: labelError,
};

export default class LightningPrimitiveDatatableStatusBar extends LightningElement {
    @track privateError = {};

    @api
    get error() {
        return this.privateError;
    }

    set error(value) {
        this.privateError = value;

        if (this.showError && this.isSaveBtnFocused()) {
            this.focusOnErrorMessages();
        }
    }

    get i18n() {
        return i18n;
    }

    get showError() {
        const { error } = this;
        return error && (error.title || error.messages);
    }

    get bubbleOffset() {
        // move bubble above the docked bar since docked bar has higher z-index
        // and can block the nubbin of the bubble
        return {
            vertical: -10,
        };
    }

    handleCancelButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();

        this.dispatchEvent(
            new CustomEvent('privatecancel', {
                bubbles: true,
                composed: true,
                cancelable: true,
            })
        );
    }

    handleSaveButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();

        // safari and firefox does not focus on click.
        if (document.activeElement !== event.target) {
            event.target.focus();
        }

        this.dispatchEvent(
            new CustomEvent('privatesave', {
                bubbles: true,
                composed: true,
                cancelable: true,
            })
        );
    }

    isSaveBtnFocused() {
        return this.template.querySelector('button.save-btn:focus') !== null;
    }

    focusOnErrorMessages() {
        Promise.resolve().then(() => {
            const trigger = this.template.querySelector(
                'lightning-primitive-datatable-tooltip'
            );

            if (trigger) {
                trigger.focus();
            }
        });
    }
}
