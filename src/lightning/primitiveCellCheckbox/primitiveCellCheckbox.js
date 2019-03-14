import labelSelectItem from '@salesforce/label/LightningDatatable.selectItem';
import PrimitiveDatatableCell from 'lightning/primitiveDatatableCell';
import { api } from 'lwc';
import { keyCodes } from 'lightning/utilsPrivate';
import checkbox from './checkbox.html';
import radio from './radio.html';

const i18n = {
    selectItem: labelSelectItem,
};

export default class PrimitiveCellCheckbox extends PrimitiveDatatableCell {
    @api rowIndex = 0;
    @api isSelected = false;
    @api isDisabled = false;
    @api type = 'checkbox';
    @api dtContextId;

    render() {
        if (this.type === 'radio') {
            return radio;
        }
        return checkbox;
    }

    get selectItemAssistiveText() {
        return `${i18n.selectItem} ${this.rowIndex + 1}`;
    }

    get labelId() {
        return `radio-button-label-${this.rowIndex + 1}`;
    }

    get ariaLabelledBy() {
        return `${this.labelId} radio-group-header`;
    }

    get computedOptionName() {
        return `${this.dtContextId}-options`;
    }

    handleRadioClick(event) {
        event.stopPropagation();

        if (!this.isSelected) {
            this.dispatchSelection(false);
        }
    }

    /**
     * We control the checkbox behaviour with the state and we handle it in the container,
     * but we need to prevent default in order to avoid the checkbox to change state
     * with the click and the generated click in the input from the label
     *
     * @param {Object} event - click event of the checkbox
     */
    handleCheckboxClick(event) {
        // click was catch on the input, stop propagation to avoid to be handled in container.
        // ideally you can let it bubble and be handled in there, but there is a raptor issue:
        // https://git.soma.salesforce.com/raptor/raptor/issues/838
        event.stopPropagation();
        this.dispatchSelection(event.shiftKey);
    }

    handleCheckboxContainerClick(event) {
        if (!this.isDisabled) {
            // click was catch in the label, the default its to activate the checkbox,
            // lets prevent it to avoid to send a double event.
            event.preventDefault();
            this.dispatchSelection(event.shiftKey);
        }
    }

    handleCheckboxContainerMouseDown(event) {
        // Prevent selecting text by Shift+click
        if (event.shiftKey) {
            event.preventDefault();
        }
    }

    handleRadioKeyDown(event) {
        const keyCode = event.keyCode;

        if (keyCode === keyCodes.left || keyCode === keyCodes.right) {
            // default behavior for radios is to select the prev/next radio with the same name
            event.preventDefault();
        }
    }

    dispatchSelection(isMultipleSelection) {
        const actionName = !this.isSelected ? 'selectrow' : 'deselectrow';
        // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
        const actionEvent = new CustomEvent(actionName, {
            bubbles: true,
            composed: true,
            detail: {
                rowKeyValue: this.rowKeyValue,
                isMultiple: isMultipleSelection,
            },
        });

        this.dispatchEvent(actionEvent);
    }
}
