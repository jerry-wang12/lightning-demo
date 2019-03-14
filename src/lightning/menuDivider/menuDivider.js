import { LightningElement, api, track } from 'lwc';
import {
    normalizeString as normalize,
    classListMutation,
} from 'lightning/utilsPrivate';

export default class LightningMenuDivider extends LightningElement {
    @track
    state = {
        variant: 'standard',
    };

    connectedCallback() {
        this.setAttribute('role', 'separator');
        this.updateClass();
    }

    updateClass() {
        classListMutation(this.classList, {
            'slds-has-divider_top-space': this.variant === 'standard',
            'slds-has-divider_top': this.variant === 'compact',
        });
    }

    @api
    get variant() {
        return this.state.variant;
    }

    set variant(value) {
        this.state.variant = normalize(value, {
            fallbackValue: 'standard',
            validValues: ['standard', 'compact'],
        });
        this.updateClass();
    }
}
