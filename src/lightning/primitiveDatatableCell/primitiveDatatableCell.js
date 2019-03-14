import { LightningElement, api, track } from 'lwc';
import { keyCodes } from 'lightning/utilsPrivate';

export default class PrimitiveDatatableCell extends LightningElement {
    @api rowKeyValue;
    @api colKeyValue;

    _hasFocus = 0;

    @track
    state = {
        mode: 'NAVIGATION',
        currentInputIndex: 0,
        internalTabIndex: -1,
    };

    @api
    get hasFocus() {
        return this._hasFocus;
    }

    get keyboardMode() {
        return this.state.mode;
    }

    set hasFocus(value) {
        this._hasFocus = value;

        if (value) {
            this.classList.add('slds-has-focus');
        } else {
            this.classList.remove('slds-has-focus');
        }
    }

    @api
    setMode(keyboardMode, info) {
        const normalizedInfo = info || { action: 'none' };
        this.state.mode = keyboardMode;
        if (keyboardMode === 'ACTION') {
            this.state.internalTabIndex = 0;
            this.setFocusToActionableElement(this.state.currentInputIndex);
            const actionableElements = this.getActionableElements();

            // check if we have an edit button first (tab should open the inline edit)
            if (normalizedInfo.action === 'tab') {
                let editActionElement = false;
                actionableElements.some(elem => {
                    if (elem.getAttribute('data-action-edit')) {
                        editActionElement = elem;
                        return true;
                    }

                    return false;
                });

                if (editActionElement) {
                    editActionElement.click();
                }
            } else if (actionableElements.length === 1) {
                const elem = actionableElements[0];
                let defaultActions = elem.getAttribute('data-action-triggers');
                defaultActions = defaultActions || '';

                if (defaultActions.indexOf(normalizedInfo.action) !== -1) {
                    actionableElements[this.state.currentInputIndex].click();
                }
            }
        } else {
            this.state.internalTabIndex = -1;
        }
    }

    @api
    addFocusStyles() {
        this.classList.add('slds-has-focus');
    }

    @api
    removeFocusStyles(setTabIndex) {
        this.classList.remove('slds-has-focus');
        if (setTabIndex) {
            this.state.internalTabIndex = -1;
        }
    }

    @api
    resetCurrentInputIndex(direction) {
        switch (direction) {
            case -1: {
                const inputs = this.getActionableElements();
                this.state.currentInputIndex = inputs.length
                    ? inputs.length - 1
                    : 0;
                break;
            }
            case 1:
            case 2:
                this.state.currentInputIndex = 0;
                break;
            default:
        }

        if (this.state.mode === 'ACTION') {
            this.setFocusToActionableElement(this.state.currentInputIndex);
        }
    }

    connectedCallback() {
        this.addEventListener('focus', this.handleFocus.bind(this));
        this.addEventListener('click', this.handleClick.bind(this));
        this.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    get internalTabIndex() {
        return this.state.internalTabIndex;
    }

    get canMoveLeft() {
        return this.state.currentInputIndex > 0;
    }

    get canMoveRight() {
        return (
            this.state.actionableElementsCount > 1 &&
            this.state.currentInputIndex <
                this.state.actionableElementsCount - 1
        );
    }

    moveToNextActionableElement() {
        this.setFocusToActionableElement(this.state.currentInputIndex + 1);
    }

    moveToPrevActionableElement() {
        this.setFocusToActionableElement(this.state.currentInputIndex - 1);
    }

    // eslint-disable-next-line no-unused-vars
    handleClick(event) {
        this.addFocusStyles();
        this.fireCellFocusByClickEvent();
    }

    handleKeydown(event) {
        const { keyCode, shiftKey } = event;
        const { mode } = this.state;
        let passThroughEvent = keyCode !== keyCodes.shift;

        // if it is in Action mode, then traverse to the next or previous
        // focusable element.
        // if there is no focusable element, or reach outside of the range, then move to
        // previous or next cell.
        if (mode === 'ACTION') {
            switch (keyCode) {
                case keyCodes.left:
                    if (this.canMoveLeft) {
                        // there are still actionable element before the current one
                        // move to the previous actionable element.
                        event.preventDefault();
                        this.moveToPrevActionableElement();
                        passThroughEvent = false;
                    }
                    break;
                case keyCodes.right:
                    if (this.canMoveRight) {
                        // there are still actionable element before the current one
                        // move to the previous actionable element.
                        event.preventDefault();
                        this.moveToNextActionableElement();
                        passThroughEvent = false;
                    }
                    break;
                case keyCodes.tab:
                    // if in action mode, try to navigate through the element inside
                    // always prevent the default tab behavior
                    // so that the tab will not focus outside of the table.
                    if (shiftKey) {
                        // moving to the left
                        if (this.canMoveLeft) {
                            event.preventDefault();
                            this.moveToPrevActionableElement();
                            passThroughEvent = false;
                        }
                    } else {
                        // moving to the right
                        // eslint-disable-next-line no-lonely-if
                        if (this.canMoveRight) {
                            event.preventDefault();
                            this.moveToNextActionableElement();
                            passThroughEvent = false;
                        }
                    }
                    break;
                default:
            }
        } else if (mode === 'NAVIGATION') {
            // click the header, press enter, it does not go to action mode without this code.
            if (
                keyCode === keyCodes.left ||
                keyCode === keyCodes.right ||
                keyCode === keyCodes.up ||
                keyCode === keyCodes.down ||
                keyCode === keyCodes.enter
            ) {
                this.fireCellKeydown(event);
            }
        }

        if (passThroughEvent && mode === 'ACTION') {
            this.fireCellKeydown(event);
        }
    }

    getActionableElements() {
        return Array.prototype.slice.call(
            this.template.querySelectorAll('[data-navigation="enable"]')
        );
    }

    get resizeElement() {
        return this.template.querySelector('.slds-resizable');
    }

    setFocusToActionableElement(activeInputIndex) {
        const actionableElements = this.getActionableElements();
        this.state.actionableElementsCount = actionableElements.length;
        if (actionableElements.length > 0) {
            if (
                activeInputIndex > 0 &&
                activeInputIndex < actionableElements.length
            ) {
                // try to locate to the previous active index of previous row.
                actionableElements[activeInputIndex].focus();
                this.state.currentInputIndex = activeInputIndex;
            } else {
                actionableElements[0].focus();
                this.state.currentInputIndex = 0;
            }
        }
        // TODO: Fire event back to the datatable, so that the activeInputIndex can be
        // stored in the datatable level state.  So that when user use up and down arrow to
        // navigate throught the datatable in ACTION mode, we can rememeber the active input position
    }

    handleFocus() {
        if (this.state.mode === 'ACTION') {
            this.setFocusToActionableElement(this.state.currentInputIndex);
        }
    }

    fireCellKeydown(keyEvent) {
        const { rowKeyValue, colKeyValue } = this;
        const { keyCode, shiftKey } = keyEvent;

        const event = new CustomEvent('privatecellkeydown', {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                rowKeyValue,
                colKeyValue,
                keyCode,
                shiftKey,
                keyEvent,
            },
        });

        this.dispatchEvent(event);
    }

    fireCellFocusByClickEvent() {
        const { rowKeyValue, colKeyValue } = this;
        const event = new CustomEvent('privatecellfocusedbyclick', {
            bubbles: true,
            composed: true,
            detail: {
                rowKeyValue,
                colKeyValue,
            },
        });

        this.dispatchEvent(event);
    }
}
