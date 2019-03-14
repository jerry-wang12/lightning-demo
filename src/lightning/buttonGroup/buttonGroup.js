import { LightningElement } from 'lwc';

export default class LightningButtonGroup extends LightningElement {
    privateButtons = [];

    constructor() {
        super();

        // listen for button registration events
        this.template.addEventListener(
            'privatebuttonregister',
            this.handleButtonRegister.bind(this)
        );
    }

    connectedCallback() {
        this.classList.add('slds-button-group');
        this.setAttribute('role', 'group');
    }

    /**
     * Handles the registration for all the items inside the button-group that have been
     * loaded via <slot></slot>.
     * @param {Object} event - The event object
     */
    handleButtonRegister(event) {
        event.stopPropagation();

        const button = event.detail;
        const ref = event.target;

        // set the deregistration callback
        button.callbacks.setDeRegistrationCallback(() => {
            const indexToDelete = this.privateButtons.findIndex(
                el => el.ref === ref
            );
            this.privateButtons.splice(indexToDelete, 1);
        });

        // add button to registered array
        this.privateButtons.push({ button, ref });
    }

    /**
     * Handles the updates to slotted elements when the content of the slot changes.
     */
    handleSlotChange() {
        // sort registered buttons based on DOM location
        // :: sorting allows us to determine order/position in the group
        this.privateButtons = this.getSortedButtons(this.privateButtons);

        // if we only have a single button reset it to a plain button
        if (this.privateButtons.length === 1) {
            // pass down the position via a CSS class
            this.privateButtons[0].button.callbacks.setOrder(null);
        } else {
            // if we have more than one button iterate and set the order state
            for (let i = 0; i < this.privateButtons.length; i++) {
                let dataValue;
                if (i === 0) {
                    dataValue = 'first';
                } else if (i === this.privateButtons.length - 1) {
                    dataValue = 'last';
                } else {
                    dataValue = 'middle';
                }

                // pass down the position via a CSS class
                this.privateButtons[i].button.callbacks.setOrder(dataValue);
            }
        }
    }

    getSortedButtons(buttons) {
        const sortedButtons = Object.values(buttons);

        sortedButtons.sort((a, b) => {
            const position = a.ref.compareDocumentPosition(b.ref);

            if (
                position & Node.DOCUMENT_POSITION_FOLLOWING ||
                position & Node.DOCUMENT_POSITION_CONTAINED_BY
            ) {
                return -1;
            } else if (
                position & Node.DOCUMENT_POSITION_PRECEDING ||
                position & Node.DOCUMENT_POSITION_CONTAINS
            ) {
                return 1;
            }

            return 0;
        });

        return sortedButtons;
    }
}
