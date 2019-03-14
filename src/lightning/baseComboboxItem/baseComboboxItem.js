import { LightningElement, api } from 'lwc';

import card from './card.html';
import inline from './inline.html';
import defaultHtml from './default.html';

export default class LightningBaseComboboxItem extends LightningElement {
    @api item = {};

    connectedCallback() {
        // We want to make sure that the item has 'aria-selected' if it's selectable
        if (this.item.selectable) {
            this.setAttribute('aria-selected', 'false');
        }

        if (this.isInlineOption) {
            this.classList.add('slds-media_small');
            this.classList.add('slds-listbox__option_plain');
        } else {
            this.classList.add('slds-listbox__option_entity');
        }
    }

    // Return html based on the specified item type
    render() {
        switch (this.item.type) {
            case 'option-inline':
                return inline;
            case 'option-card':
                return card;
            default:
                return defaultHtml;
        }
    }

    @api
    highlight() {
        this.toggleHighlight(true);
    }

    @api
    removeHighlight() {
        this.toggleHighlight(false);
    }

    toggleHighlight(highlighted) {
        if (this.item.selectable) {
            this.setAttribute('aria-selected', highlighted ? 'true' : 'false');
            this.classList.toggle('slds-has-focus', highlighted);
        }
    }

    // Parts are needed for highlighting
    partsToText(parts) {
        if (parts && Array.isArray(parts) && parts.length > 0) {
            return parts.map(part => part.text).join('');
        }
        return parts;
    }

    get rightIconSize() {
        return this.item.rightIconSize || 'small';
    }

    get iconSize() {
        return this.item.iconSize || 'small';
    }

    get text() {
        return this.partsToText(this.item.text);
    }

    get subText() {
        return this.partsToText(this.item.subText);
    }

    get hasSubText() {
        return this.item.subText && this.item.subText.length > 0;
    }

    get isInlineOption() {
        return this.item.type === 'option-inline';
    }
}
