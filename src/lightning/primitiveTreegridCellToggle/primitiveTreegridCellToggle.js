import labelCollapseBranch from '@salesforce/label/LightningPrimitiveCellTree.collapseBranch';
import labelExpandBranch from '@salesforce/label/LightningPrimitiveCellTree.expandBranch';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeBoolean } from 'lightning/utilsPrivate';

const i18n = {
    collapseBranch: labelCollapseBranch,
    expandBranch: labelExpandBranch,
};

export default class PrivateTreeGridCellToggle extends LightningElement {
    @api rowKeyValue;
    @api colKeyValue;
    @api value;

    @track
    state = {
        expanded: false,
        hasChildren: false,
    };

    get computedButtonClass() {
        return classSet('slds-m-right_x-small')
            .add({
                'slds-is-disabled': !this.hasChildren,
            })
            .toString();
    }

    @api
    get hasChildren() {
        return this.state.hasChildren;
    }

    set hasChildren(value) {
        this.state.hasChildren = normalizeBoolean(value);
    }

    @api
    get isExpanded() {
        return this.state.expanded;
    }

    set isExpanded(value) {
        this.state.expanded = normalizeBoolean(value);
    }

    get buttonTitle() {
        if (this.isExpanded) {
            return this.formatString(i18n.collapseBranch, this.value);
        }
        return this.formatString(i18n.expandBranch, this.value);
    }

    formatString(str, ...args) {
        if (str) {
            return str.replace(/{(\d+)}/g, (match, i) => {
                return typeof args[i] !== 'undefined' ? args[i] : match;
            });
        }
        return '';
    }

    handleChevronClick() {
        const customEvent = new CustomEvent('privatetogglecell', {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                name: this.rowKeyValue,
                nextState: this.isExpanded ? false : true, // True = expanded, False = collapsed
            },
        });
        this.dispatchEvent(customEvent);
    }
}
