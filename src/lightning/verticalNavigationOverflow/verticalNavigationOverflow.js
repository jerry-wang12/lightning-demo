import { LightningElement, track } from 'lwc';
import showMoreLabel from '@salesforce/label/LightningVerticalNavigation.showMore';
import showLessLabel from '@salesforce/label/LightningVerticalNavigation.showLess';

const SLDS_SHOW = 'slds-show';
const SLDS_HIDE = 'slds-hide';
const COLLAPSED_ICON = 'utility:chevronright';
const EXPANDED_ICON = 'utility:chevrondown';

export default class LightningVerticalNavigationSection extends LightningElement {
    @track
    state = {
        isExpanded: false,
    };

    get computedActionText() {
        return this.state.isExpanded ? showLessLabel : showMoreLabel;
    }

    get computedItemListClass() {
        return this.state.isExpanded ? SLDS_SHOW : SLDS_HIDE;
    }

    get computedIconName() {
        return this.state.isExpanded ? EXPANDED_ICON : COLLAPSED_ICON;
    }

    get computedAssistiveText() {
        return this.state.assistiveText || '';
    }

    toggleOverflow() {
        this.state.isExpanded = !this.state.isExpanded;
    }

    updateAssistiveText(assistiveText) {
        this.state.assistiveText = assistiveText;
    }

    connectedCallback() {
        this.dispatchEvent(
            new CustomEvent('privateoverflowregister', {
                bubbles: true,
                composed: true,
                detail: {
                    callbacks: {
                        updateAssistiveText: this.updateAssistiveText.bind(
                            this
                        ),
                    },
                },
            })
        );
    }
}
