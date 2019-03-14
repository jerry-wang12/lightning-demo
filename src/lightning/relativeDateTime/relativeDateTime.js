import { LightningElement, track, api } from 'lwc';
import { assert } from 'lightning/utilsPrivate';
import { getFormattedRelativeDate, getTimeoutUnitsTillInvalid } from './utils';

/**
 * Displays the relative time difference between the source date-time and the provided date-time.
 */
export default class LightningRelativeDateTime extends LightningElement {
    @track formattedValue = '';
    set value(next) {
        this.privateValue = next;
        this.updateFormattedValue();
    }

    /**
     * The timestamp or JavaScript Date object to be formatted.
     */
    @api
    get value() {
        return this.privateValue;
    }
    privateValue;

    connectedCallback() {
        if (!this.updateFormattedValue()) {
            this.scheduleFormattedValueUpdate();
        }
    }

    disconnectedCallback() {
        this.cancelScheduledFormattedValueUpdate();
    }

    renderedCallback() {
        this.scheduleFormattedValueUpdate();
    }

    updateFormattedValue() {
        const oldFormattedValue = this.formattedValue;

        try {
            this.formattedValue = getFormattedRelativeDate(this.value);
        } catch (e) {
            const errorMessage =
                `<lightning-relative-date-time>: Error while formatting ` +
                `"${this.value}": ${e.message}`;

            assert(false, errorMessage);
            this.formattedValue = '';
        }

        return oldFormattedValue !== this.formattedValue;
    }

    scheduleFormattedValueUpdate() {
        this.cancelScheduledFormattedValueUpdate();
        if (this.formattedValue !== '') {
            const units = getTimeoutUnitsTillInvalid(this.value);

            // eslint-disable-next-line lwc/no-set-timeout
            this.formattedValueUpdateTask = setTimeout(
                this.updateFormattedValue.bind(this),
                units
            );
        }
    }

    cancelScheduledFormattedValueUpdate() {
        clearTimeout(this.formattedValueUpdateTask);
    }
}
