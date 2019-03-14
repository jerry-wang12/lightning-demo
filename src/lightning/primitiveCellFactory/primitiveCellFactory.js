import PrimitiveDatatableCell from 'lightning/primitiveDatatableCell';
import { api } from 'lwc';
import { classSet } from 'lightning/utils';
import template from './primitiveCellFactory.html';

function isNumberedBasedType(cellType) {
    return (
        cellType === 'currency' ||
        cellType === 'number' ||
        cellType === 'percent'
    );
}

function isTypeCenteredByDefault(cellType) {
    return cellType === 'button-icon';
}

export default class PrivateCellFactory extends PrimitiveDatatableCell {
    @api types;
    @api alignment;
    @api value;
    @api iconName;
    @api iconLabel;
    @api iconPosition;
    @api iconAlternativeText;
    @api editable;
    @api hasError;
    @api columnLabel;
    @api columnSubType;
    @api typeAttribute0;
    @api typeAttribute1;
    @api typeAttribute2;
    @api typeAttribute3;
    @api typeAttribute4;
    @api typeAttribute5;
    @api typeAttribute6;
    @api typeAttribute7;
    @api typeAttribute8;
    @api typeAttribute9;
    @api typeAttribute10;
    // typeAttribute21 and typeAttribute21 used by treegrid
    @api typeAttribute21;
    @api typeAttribute22;

    @api
    get wrapText() {
        return this.state.wrapText;
    }

    set wrapText(value) {
        if (value) {
            this.classList.add('slds-cell-wrap');
        } else {
            this.classList.remove('slds-cell-wrap');
        }

        this.state.wrapText = value;
    }

    @api
    get columnType() {
        return this.state.columnType;
    }

    set columnType(value) {
        if (value === 'tree') {
            this.classList.add('slds-no-space');
        }
        this.state.columnType = value;
    }

    get computedWrapperClass() {
        const alignment = this.computedAlignment;

        return classSet('slds-grid')
            .add({
                'slds-no-space': this.hasTreeData,
                'slds-align_absolute-center': this.isAction,
                'slds-grid_align-end': alignment === 'right',
                'slds-grid_align-center': alignment === 'center',
                'slds-grid_align-spread': this.isSpreadAlignment,
            })
            .toString();
    }

    get hasTreeData() {
        return this.columnType === 'tree';
    }

    get isAction() {
        return this.columnType === 'action';
    }

    get isCustomType() {
        return this.types.getType(this.columnType).type === 'custom';
    }
    render() {
        return template;
    }

    // Inline edit button
    handleEditButtonClick() {
        const { rowKeyValue, colKeyValue } = this;
        const event = new CustomEvent('privateeditcell', {
            bubbles: true,
            composed: true,
            detail: {
                rowKeyValue,
                colKeyValue,
            },
        });
        this.dispatchEvent(event);
    }

    /**
     * Overridden click handler from the datatable-cell.
     *
     */
    handleClick() {
        if (!this.classList.contains('slds-has-focus')) {
            this.addFocusStyles();
            this.fireCellFocusByClickEvent();
        }
    }

    getActionableElements() {
        const wrapper = this.template.querySelector(
            'lightning-primitive-cell-wrapper'
        );
        const types = this.template.querySelector(
            'lightning-primitive-cell-types'
        );
        const result = [];
        const typeActionableElements = types.getActionableElements();
        typeActionableElements.forEach(elem => result.push(elem));

        if (wrapper) {
            const wrapperActionableElements = wrapper.getActionableElements();
            wrapperActionableElements.forEach(elem => result.push(elem));
        }
        return result;
    }

    get isSpreadAlignment() {
        const alignment = this.computedAlignment;

        return (
            !alignment ||
            alignment === 'left' ||
            (alignment !== 'center' && alignment !== 'right')
        );
    }

    /**
     * Note: this should be passed from above, but we dont have a defined architecture that lets customize / provide defaults
     * on cell attributes per type.
     */
    get computedAlignment() {
        if (!this.alignment && isNumberedBasedType(this.columnType)) {
            return 'right';
        }

        if (!this.alignment && isTypeCenteredByDefault(this.columnType)) {
            return 'center';
        }

        return this.alignment;
    }
}
