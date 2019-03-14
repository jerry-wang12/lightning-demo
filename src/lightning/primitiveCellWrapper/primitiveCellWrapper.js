import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';

export default class PrimitiveCellWrapper extends LightningElement {
    @api iconName;
    @api iconPosition;
    @api iconAlternativeText;
    @api isAction = false;
    @api wrapText;
    @api iconLabel;
    @api editable = false;
    @api hasError = false;
    @api type = 'text';
    @api rowKeyValue;
    @api colKeyValue;
    @api hasTreeData = false;
    @api value;
    @api hasChildren;
    @api isExpanded;
    @api columnLabel;
    @api internalTabIndex;

    get hasLeftIcon() {
        return (
            !this.hasTreeData &&
            this.iconName &&
            (!this.iconPosition || this.iconPosition === 'left')
        );
    }

    get hasRightIcon() {
        return this.iconName && this.iconPosition === 'right';
    }

    get computedCellDivClass() {
        return classSet()
            .add({
                'slds-truncate':
                    !this.isAction &&
                    this.type !== 'button-icon' &&
                    !this.wrapText,
            })
            .add({ 'slds-hyphenate': this.wrapText })
            .toString();
    }

    // Inline edit button
    handleEditButtonClick() {
        // this event does not bubble, it is not composed
        const event = new CustomEvent('edit');
        this.dispatchEvent(event);
    }

    @api
    getActionableElements() {
        return Array.prototype.slice.call(
            this.template.querySelectorAll('[data-navigation="enable"]')
        );
    }
}
