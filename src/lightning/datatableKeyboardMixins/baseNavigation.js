import { api } from 'lwc';
import { queryFocusable } from 'lightning/utils';

const handleArrowLeft = Symbol('handleArrowLeft');
const handleArrowRight = Symbol('handleArrowRight');
const handleTabKey = Symbol('handleTabKey');
const getActiveElementIndex = Symbol('getActiveElementIndex');
const moveToPreviousOf = Symbol('moveToPreviousOf');
const moveToNextOf = Symbol('moveToNextOf');
const privateActionables = Symbol('privateActionables');
const updateActionables = Symbol('updateActionables');
const handleArrowKeyDown = Symbol('handleArrowKeyDown');
const lastElementFocused = Symbol('lastElementFocused');
const keyboardMode = Symbol('keyboardMode');

const ARROW_RIGHT = 39;
const ARROW_LEFT = 37;
const TAB = 9;

const isInput = element => element.tagName === 'INPUT';
const isTextarea = element => element.tagName === 'TEXTAREA';
const isInputButton = element =>
    element.type === 'button' || element.type === 'submit';
const implementNativeArrowNavigation = element =>
    (isInput(element) && !isInputButton(element)) || isTextarea(element);

export const baseNavigation = superclass =>
    class extends superclass {
        static delegatesFocus = true;

        [keyboardMode] = 'NAVIGATION';

        @api
        set keyboardMode(value) {
            this[keyboardMode] = value;
            this.setAttribute('tabindex', value === 'NAVIGATION' ? -1 : 0);
        }

        get keyboardMode() {
            return this[keyboardMode];
        }

        @api
        focus() {
            this[updateActionables]();
            if (this[lastElementFocused]) {
                this[lastElementFocused].focus();
            } else if (this[privateActionables][0]) {
                this[privateActionables][0].focus();
                this[lastElementFocused] = this[privateActionables][0];
            }
        }

        connectedCallback() {
            this.setAttribute(
                'tabindex',
                this.keyboardMode === 'ACTION' ? 0 : -1
            );
            this.addEventListener(
                'keydown',
                this[handleArrowKeyDown].bind(this)
            );
            if (super.connectedCallback) {
                super.connectedCallback();
            }
        }

        [updateActionables]() {
            this[privateActionables] = queryFocusable(this.template);
        }

        [handleArrowKeyDown](event) {
            if (this.keyboardMode === 'ACTION') {
                switch (event.keyCode) {
                    case ARROW_LEFT:
                        this[handleArrowLeft](event);
                        break;
                    case ARROW_RIGHT:
                        this[handleArrowRight](event);
                        break;
                    case TAB:
                        this[handleTabKey](event);
                        break;
                    default:
                }
            }
        }

        [handleArrowLeft](event) {
            if (implementNativeArrowNavigation(this.template.activeElement)) {
                event.stopPropagation();
            } else {
                this[updateActionables]();
                const index = this[getActiveElementIndex]();
                if (index > 0) {
                    event.stopPropagation();
                    event.preventDefault();
                    this[moveToPreviousOf](index);
                }
            }
        }

        [handleArrowRight](event) {
            if (implementNativeArrowNavigation(this.template.activeElement)) {
                event.stopPropagation();
            } else {
                this[updateActionables]();
                const index = this[getActiveElementIndex]();
                if (index < this[privateActionables].length - 1) {
                    event.stopPropagation();
                    event.preventDefault();
                    this[moveToNextOf](index);
                }
            }
        }

        [handleTabKey](event) {
            if (event.shiftKey) {
                this[handleArrowLeft](event);
            } else {
                this[handleArrowRight](event);
            }
        }

        [getActiveElementIndex]() {
            const templateActive = this.template.activeElement;
            const actionables = this[privateActionables];
            return actionables.indexOf(templateActive);
        }

        [moveToPreviousOf](index) {
            const actionables = this[privateActionables];
            actionables[index - 1].focus();
            this[lastElementFocused] = actionables[index - 1];
        }

        [moveToNextOf](index) {
            const actionables = this[privateActionables];
            actionables[index + 1].focus();
            this[lastElementFocused] = actionables[index + 1];
        }
    };
