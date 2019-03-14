import labelColumnWidth from '@salesforce/label/LightningDatatable.columnWidth';
import { LightningElement, api, track } from 'lwc';
import { keyCodes } from 'lightning/utilsPrivate';

const i18n = {
    columnWidth: labelColumnWidth,
};

export default class PrimitiveResizeHandler extends LightningElement {
    static delegatesFocus = true;
    @api minWidth = 0;
    @api maxWidth = 1000;
    @api label = '';
    @api colIndex;
    @api internalTabIndex;
    @api step = 10;
    @api value;

    @track state = {};

    connectedCallback() {
        this.addEventListener('focus', this.handleFocus.bind(this));
    }

    get resizerLabel() {
        const label = this.label || '';
        return `${label} ${i18n.columnWidth}`;
    }

    get resizeElement() {
        return this.template.querySelector('.slds-resizable__handle');
    }

    handleFocus() {
        this.template.querySelector('input').focus();
    }

    onClick(event) {
        // capture the click event on button, to prevent the sorting of the column
        this.preventDefaultAndStopPropagation(event);
    }
    onStart(event) {
        // prevent selecting text when mouse down
        event.returnValue = false;
        this.preventDefaultAndStopPropagation(event);

        const headerClientWidth = this.value;
        this.lowRange = this.minWidth - headerClientWidth;
        this.highRange = this.maxWidth - headerClientWidth;

        this.startX = event.pageX;
        this.currentX = this.startX;

        this.touchingResizer = true;

        document.body.addEventListener('mousemove', this.onMove.bind(this));
        document.body.addEventListener('mouseup', this.onEnd.bind(this));
        document.body.addEventListener('mouseleave', this.onEnd.bind(this));

        requestAnimationFrame(this.resizing.bind(this));
    }

    onMove(event) {
        if (!this.touchingResizer) {
            return;
        }
        this.currentX = event.pageX;
    }

    // eslint-disable-next-line no-unused-vars
    onEnd(event) {
        if (!this.touchingResizer) {
            return;
        }
        this.touchingResizer = false;

        document.body.removeEventListener('mousemove', this.onMove.bind(this));
        document.body.removeEventListener('mouseup', this.onEnd.bind(this));
        document.body.removeEventListener('mouseleave', this.onEnd.bind(this));

        const translateX = this.currentX - this.startX;
        this.resizeElement.style.transform = '';

        this.fireResizeEvent(translateX);
    }

    resizing() {
        if (!this.touchingResizer) {
            return;
        }
        requestAnimationFrame(this.resizing.bind(this));
        const translateX = this.currentX - this.startX;
        if (
            this.lowRange === undefined ||
            (translateX >= this.lowRange && translateX <= this.highRange)
        ) {
            this.resizeElement.style.transform = `translateX(${translateX}px)`;
        }
    }

    preventDefaultAndStopPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    handleKeydown(event) {
        switch (event.keyCode) {
            case keyCodes.left:
                this.preventDefaultAndStopPropagation(event);
                this.fireResizeEvent(0 - this.step);
                break;
            case keyCodes.right:
                this.preventDefaultAndStopPropagation(event);
                this.fireResizeEvent(this.step);
                break;
            case keyCodes.up:
            case keyCodes.down:
            case keyCodes.enter:
            case keyCodes.space:
                this.preventDefaultAndStopPropagation(event);
                break;
            case keyCodes.escape:
                break;
            default:
        }
    }

    fireResizeEvent(widthDelta) {
        const actionName = 'resizecol';
        // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
        const actionEvent = new CustomEvent(actionName, {
            bubbles: true,
            composed: true,
            detail: {
                colIndex: this.colIndex,
                widthDelta,
            },
        });
        this.dispatchEvent(actionEvent);
    }
}
