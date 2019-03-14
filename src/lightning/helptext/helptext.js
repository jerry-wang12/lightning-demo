import labelButtonAlternativeText from '@salesforce/label/LightningHelptext.buttonAlternativeText';
import { LightningElement, createElement, api, track } from 'lwc';
import { isValidName } from 'lightning/iconUtils';
import { guid, normalizeString } from 'lightning/utilsPrivate';
import { classSet } from 'lightning/utils';
import { isiOS } from './iosDetect';
import LightningPrimitiveBubble from 'lightning/primitiveBubble';
import { getNubbinShiftAmount, getBubbleAlignAndPosition } from './utils';

const i18n = {
  buttonAlternativeText: labelButtonAlternativeText
};

// generate a unique ID
const BUBBLE_ID = `salesforce-lightning-helptext-bubble_${guid()}`;

const CACHED_BUBBLE_ELEMENT = createElement('lightning-primitive-bubble', {
  is: LightningPrimitiveBubble
});
CACHED_BUBBLE_ELEMENT.contentId = BUBBLE_ID;
CACHED_BUBBLE_ELEMENT.style.position = 'absolute';
CACHED_BUBBLE_ELEMENT.style.minWidth = '75px';

const DEFAULT_ICON_NAME = 'utility:info';
const DEFAULT_ANCHORING = {
  trigger: {
    horizontal: 'left',
    vertical: 'top'
  },
  bubble: {
    horizontal: 'left',
    vertical: 'bottom'
  }
};

/**
 * An icon with a text popover used for tooltips.
 */
export default class LightningHelptext extends LightningElement {
  /**
   * Text to be shown in the popover.
   * @type {string}
   */
  @api content = '';

  /**
   * The Lightning Design System name of the icon used as the visible element.
   * Names are written in the format 'utility:info' where 'utility' is the category,
   * and 'info' is the specific icon to be displayed.
   * The default is 'utility:info'.
   * @type {string}
   * @default utility:info
   */
  @api iconName = DEFAULT_ICON_NAME;

  /**
   * Changes the appearance of the icon.
   * Accepted variants include inverse, warning, error.
   * @type {string}
   */
  @api iconVariant = 'bare';

  @track state = {};

  _initialRender = true;

  connectedCallback() {
    // watch for resize & scroll events to recalculate when needed
    window.addEventListener('resize', this.handleBrowserEvent, false);
    window.addEventListener('scroll', this.handleBrowserEvent, true);
  }

  renderedCallback() {
    if (this._initialRender) {
      const buttonEle = this.template.querySelector('button');
      if (isiOS && 'ontouchstart' in document.documentElement) {
        buttonEle.addEventListener('touchstart', this.handleTouch.bind(this));
      } else {
        buttonEle.addEventListener(
          'mouseover',
          this.handleMouseOver.bind(this)
        );
        buttonEle.addEventListener('mouseout', this.handleMouseOut.bind(this));
        buttonEle.addEventListener('focusin', this.handleFocus.bind(this));
        buttonEle.addEventListener('focusout', this.handleBlur.bind(this));
      }
    }
    this._initialRender = false;
  }

  disconnectedCallback() {
    // remove event listeners
    window.removeEventListener('resize', this.handleBrowserEvent, false);
    window.removeEventListener('scroll', this.handleBrowserEvent, true);
    // handle the case where panels try to focus on element after closing
    if (this.state.currentTrigger === true) {
      this.hideBubble();
    }
  }

  get i18n() {
    return i18n;
  }

  // compute icon name
  get computedIconName() {
    if (isValidName(this.iconName)) {
      return this.iconName;
    }

    return DEFAULT_ICON_NAME;
  }

  // compute SVG CSS classes to apply to the icon
  get computedSvgClass() {
    const classes = classSet('slds-button__icon');

    switch (this.normalizedIconVariant) {
      case 'error':
        classes.add('slds-icon-text-error');
        break;
      case 'warning':
        classes.add('slds-icon-text-warning');
        break;
      case 'inverse':
      case 'bare':
        break;
      default:
        // if custom icon is set, we don't want to set
        // the text-default class
        classes.add('slds-icon-text-default');
    }

    return classes.toString();
  }

  get normalizedIconVariant() {
    // NOTE: Leaving a note here because I just wasted a bunch of time
    // investigating why both 'bare' and 'inverse' are supported in
    // lightning-primitive-icon. lightning-icon also has a deprecated
    // 'bare', but that one is synonymous to 'inverse'. This 'bare' means
    // that no classes should be applied. So this component needs to
    // support both 'bare' and 'inverse' while lightning-icon only needs to
    // support 'inverse'.
    return normalizeString(this.iconVariant, {
      fallbackValue: 'bare',
      validValues: ['bare', 'error', 'inverse', 'warning']
    });
  }

  handleTouch() {
    if (this.state.currentTrigger === true) {
      this.hideBubble();
    } else {
      this.showBubble();
    }
  }

  // compute bubble's unique ID
  get computedBubbleUniqueId() {
    return BUBBLE_ID;
  }

  // handle mouse over event
  handleMouseOver() {
    this.showBubble();
  }

  // handle mouse out event
  handleMouseOut() {
    this.hideBubble();
  }

  // handle focus
  handleFocus() {
    this.showBubble();
  }

  // handle blur
  handleBlur() {
    this.hideBubble();
  }

  // handle resize + scroll event
  handleBrowserEvent = () => {
    // only perform changes for the currently focused/active trigger
    if (this.state.currentTrigger === true) {
      this.setBubblePosition();
    }
  };

  // retrieve trigger element bounding rectangle
  getTriggerBoundingRect() {
    const triggerEl = this.template.querySelector('div');

    return triggerEl ? triggerEl.getBoundingClientRect() : null;
  }

  // retrieve bubble element bounding rectangle (raw)
  getBubbleBoundingRect() {
    const bubbleEl = CACHED_BUBBLE_ELEMENT;

    // initialize position in top left corner
    bubbleEl.style.top = 0;
    bubbleEl.style.left = 0;
    bubbleEl.style.removeProperty('bottom');
    bubbleEl.style.removeProperty('right');

    return bubbleEl ? bubbleEl.getBoundingClientRect() : null;
  }

  // show bubble
  showBubble() {
    // set the triggered by element
    this.state.currentTrigger = true;

    const bubbleEl = CACHED_BUBBLE_ELEMENT;

    this.initBubble();
    this.setBubblePosition();

    bubbleEl.visible = true;
  }

  // hide bubble
  hideBubble() {
    const bubbleEl = CACHED_BUBBLE_ELEMENT;

    // remove the triggered by value
    this.state.currentTrigger = false;
    bubbleEl.visible = false;
  }

  // calculate shift amounts
  calculateShiftAmounts() {
    // only calculate once
    if (typeof this.shiftAmounts === 'undefined') {
      const bubbleEl = CACHED_BUBBLE_ELEMENT;

      // initialize position in top left corner
      bubbleEl.style.top = 0;
      bubbleEl.style.left = 0;
      bubbleEl.style.removeProperty('bottom');
      bubbleEl.style.removeProperty('right');

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

  // initialize bubble element
  initBubble() {
    const bubbleEl = CACHED_BUBBLE_ELEMENT;

    // set the content value
    bubbleEl.content = this.content;

    // check if bubble element is already in DOM
    if (bubbleEl.parentNode === null) {
      document.body.appendChild(bubbleEl);
    }

    this.calculateShiftAmounts();
  }

  // set the position of the bubble relative to its target
  setBubblePosition() {
    const rootEl = document.documentElement;
    const bubbleEl = CACHED_BUBBLE_ELEMENT;

    const result = getBubbleAlignAndPosition(
      this.getTriggerBoundingRect(),
      this.getBubbleBoundingRect(),
      DEFAULT_ANCHORING.bubble,
      this.shiftAmounts,
      rootEl.clientHeight || window.innerHeight,
      rootEl.clientWidth || window.innerWidth,
      window.pageXOffset,
      window.pageYOffset
    );
    bubbleEl.align = result.align;
    bubbleEl.style.top = result.top;
    bubbleEl.style.right = result.right;
    bubbleEl.style.bottom = result.bottom;
    bubbleEl.style.left = result.left;
  }
}
