import { LightningElement, createElement, api, track } from 'lwc';
import { raf, guid } from 'lightning/utilsPrivate';
import LightningPrimitiveDatatableTooltipBubble from 'lightning/primitiveDatatableTooltipBubble';
import { getNubbinShiftAmount, getBubbleAlignAndPosition } from './utils';
import { classSet } from 'lightning/utils';

const CACHED_BUBBLE_ELEMENT = createElement(
    'lightning-primitive-datatable-tooltip-bubble',
    {
        is: LightningPrimitiveDatatableTooltipBubble,
    }
);
CACHED_BUBBLE_ELEMENT.style.position = 'absolute';
CACHED_BUBBLE_ELEMENT.style.minWidth = '75px';
const DEFAULT_ANCHORING = {
    trigger: {
        horizontal: 'left',
        vertical: 'top',
    },
    bubble: {
        horizontal: 'left',
        vertical: 'bottom',
    },
};

const ZERO_OFFSET = {
    horizontal: 0, // right if > 0, left if < 0
    vertical: 0, // down if > 0, up if < 0
};

export default class LightningPrimitiveDatatableTooltip extends LightningElement {
    @api header = '';
    @api content = [];
    @api size = 'medium';
    @api trigger = 'click'; // hover, click
    @api hideCloseButton = false;
    @api variant = 'bare'; // bare, warning, error
    @api alternativeText;
    @api internalTabIndex;
    _uniqueId = `primitive-datatable-tooltip_${guid()}`;

    @track
    state = {
        showErrorBubble: false,
        offset: ZERO_OFFSET,
    };

    connectedCallback() {
        // watch for resize & scroll events to recalculate when needed
        window.addEventListener('resize', this.handleBrowserEvent, false);
        window.addEventListener('scroll', this.handleBrowserEvent, true);
    }

    disconnectedCallback() {
        // remove event listeners
        window.removeEventListener('resize', this.handleBrowserEvent, false);
        window.removeEventListener('scroll', this.handleBrowserEvent, true);

        const bubbleEl = CACHED_BUBBLE_ELEMENT;
        bubbleEl.removeEventListener('close', this.handleBubbleClose);
    }

    @api
    get offset() {
        return this.state.offset;
    }
    set offset(value) {
        this.state.offset = {
            ...ZERO_OFFSET,
            ...value,
        };
    }

    @api
    focus() {
        this.triggerElement.focus();
    }

    get computedButtonClass() {
        const classes = classSet('slds-button').add('slds-button_icon');

        classes.add({
            'slds-button_icon-error': this.variant === 'error',
        });

        return classes.toString();
    }

    get computedHeaderIconName() {
        switch (this.variant) {
            case 'error':
                return 'utility:ban';
            case 'warning':
                return 'utility:warning';
            case 'bare':
            default:
                return 'utility:info';
        }
    }

    get triggerElement() {
        return this.template.querySelector('[data-trigger="true"]');
    }

    handleMouseOver() {
        if (this.trigger === 'hover') {
            this.showBubble();
        }
    }

    handleMouseOut() {
        if (this.trigger === 'hover') {
            this.hideBubble();
            this.triggerElement.focus();
        }
    }

    handleClick(event) {
        event.preventDefault();

        if (this.trigger === 'click') {
            // since we share bubble element with other tooltip triggers,
            // we need to keep it open if bubble is not attached to the trigger
            if (
                this.state.showErrorBubble &&
                this.isBubbleAttachedToTrigger()
            ) {
                this.hideBubble();
            } else {
                this.showBubble();
            }
        }
    }

    handleBrowserEvent = raf(() => {
        // only perform changes for the currently focused/active trigger
        if (this.state.showErrorBubble && this.isBubbleAttachedToTrigger()) {
            this.setBubblePosition();
        }
    });

    handleBubbleClose = event => {
        // only keep 1 listener at a time and always turn off this.state.showErrorBubble
        // on close
        const bubbleEl = CACHED_BUBBLE_ELEMENT;
        bubbleEl.removeEventListener('close', this.handleBubbleClose);

        if (event.detail.anchor === this._uniqueId) {
            this.hideBubble();
            if (event.detail.reason !== 'bubbleLoseFocus') {
                this.triggerElement.focus();
            }
        }
    };

    showBubble() {
        this.state.showErrorBubble = true;

        const bubbleEl = CACHED_BUBBLE_ELEMENT;

        this.initBubble();
        this.setBubblePosition();

        bubbleEl.visible = true;

        // 100ms for bubble to fade in before becoming focusable
        // eslint-disable-next-line lwc/no-set-timeout
        setTimeout(() => {
            bubbleEl.focus();
        }, 100);
    }

    hideBubble() {
        this.state.showErrorBubble = false;

        const bubbleEl = CACHED_BUBBLE_ELEMENT;
        bubbleEl.visible = false;

        // 25ms for bubble to fade out before trigger becoming focusable
        // eslint-disable-next-line lwc/no-set-timeout
        setTimeout(() => {
            this.focus();
        }, 25);
    }

    isBubbleAttachedToTrigger() {
        return CACHED_BUBBLE_ELEMENT.anchor === this._uniqueId;
    }

    getTriggerBoundingRect() {
        return this.triggerElement
            ? this.triggerElement.getBoundingClientRect()
            : null;
    }

    calculateShiftAmounts() {
        // only calculate once
        if (typeof this.shiftAmounts === 'undefined') {
            const bubbleEl = CACHED_BUBBLE_ELEMENT;

            // initialize position in top left corner
            bubbleEl.style.top = 0;
            bubbleEl.style.left = 0;
            bubbleEl.style.bottom = null;
            bubbleEl.style.right = null;

            // calculate initial position of trigger element
            const triggerElRect = this.getTriggerBoundingRect();

            // calculate shift to align nubbin
            const nubbinComputedStyles =
                window.getComputedStyle(bubbleEl, ':before') || bubbleEl.style;

            this.shiftAmounts = getNubbinShiftAmount(
                nubbinComputedStyles,
                triggerElRect.width
            );
        }
    }

    initBubble() {
        const bubbleEl = CACHED_BUBBLE_ELEMENT;

        bubbleEl.anchor = this._uniqueId;
        bubbleEl.content = this.content;
        bubbleEl.header = this.header;
        bubbleEl.variant = this.variant;
        bubbleEl.hideCloseButton = this.hideCloseButton;

        bubbleEl.addEventListener('close', this.handleBubbleClose);

        if (bubbleEl.parentNode === null) {
            document.body.appendChild(bubbleEl);
        }

        this.calculateShiftAmounts();
    }

    setBubblePosition() {
        const rootEl = document.documentElement;
        const bubbleEl = CACHED_BUBBLE_ELEMENT;

        const result = getBubbleAlignAndPosition(
            this.getTriggerBoundingRect(),
            bubbleEl.getBoundingClientRect(),
            DEFAULT_ANCHORING.bubble,
            this.shiftAmounts,
            rootEl.clientHeight || window.innerHeight,
            rootEl.clientWidth || window.innerWidth,
            window.pageXOffset + this.offset.horizontal,
            window.pageYOffset + this.offset.vertical
        );
        bubbleEl.align = result.align;
        bubbleEl.style.top = result.top;
        bubbleEl.style.right = result.right;
        bubbleEl.style.bottom = result.bottom;
        bubbleEl.style.left = result.left;
    }
}
