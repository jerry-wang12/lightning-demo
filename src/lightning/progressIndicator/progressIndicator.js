import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    getStepIndex,
    getCurrentStepIndex,
    computeProgressValue,
} from './utils';
import base from './base.html';
import path from './path.html';

const STATE_COMPLETED = 'completed';
const STATE_CURRENT = 'current';
const STATE_INCOMPLETE = 'incomplete';
const STATE_ERROR = 'error';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

/**
 * Provides a visual indication on the progress of a particular process.
 */
export default class LightningProgressIndicator extends LightningElement {
    /**
     * Changes the visual pattern of the indicator. Valid values are base and path.
     * The default is base.
     * @type {string}
     * @default base
     */
    @api type = 'base';

    /**
     * Changes the appearance of the progress indicator for the base type only.
     * Valid values are base or shaded. The shaded variant adds a light gray border to the step indicators.
     * The default is base.
     * @type {string}
     * @default base
     */
    @api variant = 'base';

    /**
     * Set current-step to match the value attribute of one of progress-step components.
     * If current-step is not provided, the value of the first progress-step component is used.
     * @type {string}
     */
    @api currentStep;

    /**
     * If present, the current step is in error state and a warning icon is displayed on the step indicator.
     * Only the base type can display errors.
     * @type {boolean}
     * @default false
     */
    @api hasError = false;

    privateStepHandlers = {};

    @track privateProgressValue = 0;
    @track privateTooltipHidden = true;
    @track privateTooltipLabel;

    privateActiveStepIndex;
    privateTooltipElement;

    renderedCallback() {
        this.updateSteps();
    }

    updateSteps(activeStep) {
        const steps = this.getSteps();
        const { privateStepHandlers, type, hasError, currentStep } = this;
        const currentStepIndex = getCurrentStepIndex(steps, currentStep);
        let activeStepIndex = -1;

        if (activeStep) {
            activeStepIndex = getStepIndex(steps, activeStep);
            this.privateActiveStepIndex = activeStepIndex;
        }

        // cast 'steps' NodeList to an Array for crossbrowser compatibility
        const stepsArray = Array.prototype.slice.call(steps);

        stepsArray.forEach((step, index) => {
            const stepName = step.value;
            const isActive = index === activeStepIndex;

            if (index < currentStepIndex) {
                privateStepHandlers[stepName](
                    STATE_COMPLETED,
                    type,
                    index,
                    isActive
                );
            } else if (index === currentStepIndex) {
                const state = hasError ? STATE_ERROR : STATE_CURRENT;
                privateStepHandlers[stepName](state, type, index, isActive);
            } else {
                privateStepHandlers[stepName](
                    STATE_INCOMPLETE,
                    type,
                    index,
                    isActive
                );
            }
        });

        if (this.isBase) {
            this.privateProgressValue = computeProgressValue(
                steps,
                currentStepIndex
            );
        }
    }

    isActive(stepName) {
        return this.currentStep === stepName;
    }

    getSteps() {
        return Array.from(this.querySelectorAll('lightning-progress-step'));
    }

    handleStepRegister(event) {
        const { stepName, callback } = event.detail;
        this.privateStepHandlers[stepName] = callback;
    }

    handleStepFocus(event) {
        if (this.isBase) {
            this.showTooltip(event.target);
        } else {
            this.updateActiveStepStatus(event.target);
        }
    }

    handleStepBlur() {
        this.hideTooltip();
    }

    handleStepMouseEnter(event) {
        this.showTooltip(event.target);
    }

    handleStepMouseLeave() {
        this.hideTooltip();
    }

    handleStepKeyDown(event) {
        if (this.privateActiveStepIndex >= 0) {
            const steps = this.getSteps();

            switch (event.keyCode) {
                case UP:
                case LEFT:
                    if (this.privateActiveStepIndex - 1 >= 0) {
                        this.updateSteps(
                            steps[this.privateActiveStepIndex - 1].value
                        );
                    }
                    break;
                case DOWN:
                case RIGHT:
                    if (this.privateActiveStepIndex + 1 <= steps.length) {
                        this.updateSteps(
                            steps[this.privateActiveStepIndex + 1].value
                        );
                    }
                    break;
                default:
                    break;
            }
        }
    }

    get computedWrapperClass() {
        return classSet('slds-progress').add({
            'slds-progress_shade': this.variant === 'shade',
        });
    }

    get computedTooltipClass() {
        return classSet(
            'slds-popover slds-popover_tooltip slds-nubbin_bottom slds-is-absolute'
        ).add({
            'slds-hidden': this.privateTooltipHidden,
        });
    }

    showTooltip(step) {
        this.privateTooltipLabel = step.label;
        // eslint-disable-next-line lwc/no-set-timeout
        setTimeout(() => {
            this.privateTooltipHidden = false;
            this.setTooltipPosition(step);
        }, 0);
    }

    hideTooltip() {
        this.privateTooltipHidden = true;
    }

    setTooltipPosition(button) {
        const tooltip = this.tooltip;

        if (tooltip) {
            tooltip.style.left = 0;
            const tooltipRect = tooltip.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();
            tooltip.style.left =
                buttonRect.left +
                buttonRect.width / 2 -
                tooltipRect.left -
                tooltipRect.width / 2 +
                'px';
            tooltip.style.top = -tooltipRect.height - 20 + 'px';
            tooltip.style.width = tooltipRect.width + 'px';
        }
    }

    get tooltip() {
        if (!this.privateTooltipElement) {
            this.privateTooltipElement = this.template.querySelector(
                'div[role="tooltip"]'
            );
        }
        return this.privateTooltipElement;
    }

    updateActiveStepStatus(activeStep) {
        if (this.currentStep !== activeStep) {
            this.updateSteps(activeStep.value);
        }
    }

    get isBase() {
        return this.type === 'base';
    }

    render() {
        if (this.isBase) {
            return base;
        }
        return path;
    }
}
