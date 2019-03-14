import labelA11yTriggerText from '@salesforce/label/LightningColorPicker.a11yTriggerText';
import labelInputFileBodyText from '@salesforce/label/LightningInputFile.bodyText';
import labelInputFileButtonLabel from '@salesforce/label/LightningInputFile.buttonLabel';
import labelMessageToggleActive from '@salesforce/label/LightningControl.activeCapitalized';
import labelMessageToggleInactive from '@salesforce/label/LightningControl.inactiveCapitalized';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelClearInput from '@salesforce/label/LightningControl.clear';
import labelLoadingIndicator from '@salesforce/label/LightningControl.loading';
import { LightningElement, unwrap, track, api } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    assert,
    normalizeBoolean,
    normalizeString,
    normalizeAriaAttribute,
    keyCodes,
    synchronizeAttrs,
    isIE11,
    ContentMutation,
    getRealDOMId,
} from 'lightning/utilsPrivate';
// eslint-disable-next-line lwc/no-aura-libs
import { numberFormat } from 'lightning:IntlLibrary';
import { getLocale, getFormFactor } from 'lightning/configProvider';
import {
    normalizeInput,
    normalizeDate,
    normalizeTime,
    normalizeUTCDateTime,
    normalizeDateTimeToUTC,
} from './normalize';
import {
    isEmptyString,
    InteractingState,
    FieldConstraintApiWithProxyInput,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    a11yTriggerText: labelA11yTriggerText,
    inputFileBodyText: labelInputFileBodyText,
    inputFileButtonLabel: labelInputFileButtonLabel,
    messageToggleActive: labelMessageToggleActive,
    messageToggleInactive: labelMessageToggleInactive,
    required: labelRequired,
    clear: labelClearInput,
    loading: labelLoadingIndicator,
};

const ARIA_CONTROLS = 'aria-controls';
const ARIA_LABEL = 'aria-label';
const ARIA_LABELEDBY = 'aria-labelledby';
const ARIA_DESCRIBEDBY = 'aria-describedby';

/*
* This component supports the regular native input types, with the addition of toggle, checkbox-button and color.
* Furthermore the file type supports a droppable zone, search has a clear button, number has formatting.
* Input changes (native oninput event) triggers an onchange event,
*     the native even is stopped, the dispatched custom event has a value that points to the state of the component
*     in case of files it's the files uploaded (via droppable zone or through the upload button),
*     checked for radio and checkbox, checkbox-button, and just straight input's value for everything else
*
*
* _Toggle_ (always has an aria-describedby, on error has an additional one, default label text for active and inactive
* states)
* _File_ (as it has a droppable zone, the validity returned would have to be valid - unless a custom error message was
*    passed)
* _Search_ (it has the clear button and the icon)
* _Number_ (formatting when not in focus, when in focus shows raw value)
*
* */

const VALID_NUMBER_FORMATTERS = [
    'decimal',
    'percent',
    'percent-fixed',
    'currency',
];
const DEFAULT_COLOR = '#000000';
const DEFAULT_FORMATTER = VALID_NUMBER_FORMATTERS[0];

/**
 * Returns an aria string with all the non-autolinked values removed
 * @param {String} values space sperated list of ids
 * @returns {String} The aria values with the non-auto linked ones removed
 */
function filterNonAutoLink(values) {
    const ariaValues = values.split(/\s+/);
    return ariaValues
        .filter(val => {
            if (val.match(/^auto-link/)) {
                return true;
            }
            return false;
        })
        .join(' ');
}

/**
 * Represents interactive controls that accept user input depending on the type attribute.
 */
export default class LightningInput extends LightningElement {
    /**
     * Text that is displayed when the field is empty, to prompt the user for a valid entry.
     * @type {string}
     *
     */
    @api placeholder;

    /**
     * Specifies the name of an input element.
     * @type {string}
     *
     */
    @api name;

    /**
     * Text label for the input.
     * @type {string}
     * @required
     *
     */
    @api label;

    /**
     * Reserved for internal use.
     * @type {number}
     *
     */
    @api formatFractionDigits;

    /**
     * Error message to be displayed when a bad input is detected.
     * @type {string}
     *
     */
    @api messageWhenBadInput;

    /**
     * Error message to be displayed when a pattern mismatch is detected.
     * @type {string}
     *
     */
    @api messageWhenPatternMismatch;

    /**
     * Error message to be displayed when a range overfolow is detected.
     * @type {string}
     *
     */
    @api messageWhenRangeOverflow;

    /**
     * Error message to be displayed when a range underflow is detected.
     * @type {string}
     *
     */
    @api messageWhenRangeUnderflow;

    /**
     * Error message to be displayed when a step mismatch is detected.
     * @type {string}
     *
     */
    @api messageWhenStepMismatch;

    /**
     * Error message to be displayed when the value is too short.
     * @type {string}
     *
     */
    @api messageWhenTooShort;

    /**
     * Error message to be displayed when the value is too long.
     * @type {string}
     *
     */
    @api messageWhenTooLong;

    /**
     * Error message to be displayed when a type mismatch is detected.
     * @type {string}
     *
     */
    @api messageWhenTypeMismatch;

    /**
     * Error message to be displayed when the value is missing.
     * @type {string}
     *
     */
    @api messageWhenValueMissing;

    /**
     * Text shown for the active state of a toggle. The default is "Active".
     * @type {string}
     */
    @api messageToggleActive = i18n.messageToggleActive;

    /**
     * Text shown for then inactive state of a toggle. The default is "Inactive".
     * @type {string}
     */
    @api messageToggleInactive = i18n.messageToggleInactive;

    /**
     * Describes the input to assistive technologies.
     * @type {string}
     */
    @api ariaLabel;

    @track _timeAriaDescribedBy;
    @track _timeAriaLabelledBy;
    @track _timeAriaControls;
    @track _dateAriaControls;
    @track _dateAriaDescribedBy;
    @track _dateAriaLabelledBy;

    set timeAriaControls(refs) {
        this._timeAriaControls = refs;
        this.ariaObserver.connectLiveIdRef(refs, ref => {
            this._timeAriaControls = ref;
        });
    }

    /**
     * A space-separated list of element IDs whose presence or content is controlled by the
     * time input when type='datetime'. On mobile devices, this is merged with aria-controls
     * and date-aria-controls to describe the native date time input.
     * @type {string}
     */
    @api
    get timeAriaControls() {
        return this._timeAriaControls;
    }

    /**
     * Describes the date input to assistive technologies when type='datetime'. On mobile devices,
     * this label is merged with aria-label and time-aria-label to describe the native date time input.
     * @type {string}
     *
     */
    @api dateAriaLabel;

    set dateAriaLabelledBy(refs) {
        this._dateAriaLabelledBy = refs;
        this.ariaObserver.connectLiveIdRef(refs, ref => {
            this._dateAriaLabelledBy = ref;
        });
    }

    /**
     * A space-separated list of element IDs that provide labels for the date input when type='datetime'.
     * On mobile devices, this is merged with aria-labelled-by and time-aria-labelled-by to describe
     * the native date time input.
     * @type {string}
     */
    @api
    get dateAriaLabelledBy() {
        return this._dateAriaLabelledBy;
    }

    set timeAriaLabelledBy(refs) {
        this._timeAriaLabelledBy = refs;
        this.ariaObserver.connectLiveIdRef(refs, ref => {
            this._timeAriaLabelledBy = ref;
        });
    }

    /**
     * A space-separated list of element IDs that provide labels for the time input when type='datetime'.
     * On mobile devices, this is merged with aria-labelled-by and date-aria-labelled-by to describe
     * the native date time input.
     * @type {string}
     *
     */
    @api
    get timeAriaLabelledBy() {
        return this._timeAriaLabelledBy;
    }

    set timeAriaDescribedBy(refs) {
        this._timeAriaDescribedBy = refs;
        this.ariaObserver.connectLiveIdRef(refs, ref => {
            this._timeAriaDescribedBy = ref;
        });
    }

    /**
     * A space-separated list of element IDs that provide descriptive labels for the time input when
     * type='datetime'. On mobile devices, this is merged with aria-described-by and date-aria-described-by
     * to describe the native date time input.
     *  @type {string}
     *
     */
    @api
    get timeAriaDescribedBy() {
        return this._timeAriaDescribedBy;
    }

    set dateAriaControls(refs) {
        this._dateAriaControls = refs;
        this.ariaObserver.connectLiveIdRef(refs, ref => {
            this._dateAriaControls = ref;
        });
    }

    /**
     * A space-separated list of element IDs whose presence or content is controlled by the
     * date input when type='datetime'. On mobile devices, this is merged with aria-controls
     * and time-aria-controls to describe the native date time input.
     * @type {string}
     *
     */
    @api
    get dateAriaControls() {
        return this._dateAriaControls;
    }

    set dateAriaDescribedBy(refs) {
        this._dateAriaDescribedBy = refs;
        this.ariaObserver.connectLiveIdRef(refs, ref => {
            this._dateAriaDescribedBy = ref;
        });
    }

    /**
     * A space-separated list of element IDs that provide descriptive labels for the date input when
     * type='datetime'. On mobile devices, this is merged with aria-described-by and time-aria-described-by
     * to describe the native date time input.
     * @type {string}
     */
    @api
    get dateAriaDescribedBy() {
        return this._dateAriaDescribedBy;
    }

    @track _value = '';
    @track _type = 'text';
    @track _pattern;
    @track _max;
    @track _min;
    @track _step;
    @track _disabled = false;
    @track _readOnly = false;
    @track _required = false;
    @track _checked = false;
    @track _formatter = DEFAULT_FORMATTER;
    @track _isLoading = false;
    @track _multiple = false;
    @track _timezone = false;
    @track _helpMessage = null;
    @track _isColorPickerPanelOpen = false;
    @track _fieldLevelHelp;
    @track _accesskey;
    @track _tabindex;
    @track _maxLength;
    @track _minLength;
    @track _accept;
    @track _variant;
    @track _connected;

    _initialChecked = false;
    _initialValue = '';
    _showFormattedNumber = true;
    _files = null;

    constructor() {
        super();
        this.ariaObserver = new ContentMutation(this);

        // Native Shadow Root will return [native code].
        // Our synthetic method will return the function source.
        this.isNative = this.template.querySelector
            .toString()
            .match(/\[native code\]/);
    }

    set ariaControls(refs) {
        this._ariaControls = refs;
        this.ariaObserver.link('input', 'aria-controls', refs, '[data-aria]');
    }

    /**
     * A space-separated list of element IDs whose presence or content is controlled by the input.
     * @type {string}
     */
    @api
    get ariaControls() {
        return this._ariaControls;
    }

    set ariaLabelledBy(refs) {
        this._ariaLabelledBy = refs;
        this.ariaObserver.link('input', 'aria-labelledby', refs, '[data-aria]');
    }

    /**
     * A space-separated list of element IDs that provide labels for the input.
     * @type {string}
     */
    @api
    get ariaLabelledBy() {
        // native version returns the auto linked value
        if (this.isNative) {
            const ariaValues = this.template
                .querySelector('input')
                .getAttribute('aria-labelledby');
            return filterNonAutoLink(ariaValues);
        }
        return this._ariaLabelledBy;
    }

    set ariaDescribedBy(refs) {
        this._ariaDescribedBy = refs;
        this.ariaObserver.link(
            'input',
            'aria-describedby',
            refs,
            '[data-aria]'
        );
    }

    /**
     * A space-separated list of element IDs that provide descriptive labels for the input.
     * @type {string}
     */
    @api
    get ariaDescribedBy() {
        if (this.isNative) {
            // in native case return the linked value
            const ariaValues = this.template
                .querySelector('input')
                .getAttribute('aria-describedby');
            return filterNonAutoLink(ariaValues);
        }
        return this._ariaDescribedBy;
    }

    synchronizeA11y() {
        const input = this.template.querySelector('input');
        const datepicker = this.template.querySelector('lightning-datepicker');
        const timepicker = this.template.querySelector('lightning-timepicker');

        if (datepicker) {
            synchronizeAttrs(datepicker, {
                ariaLabelledByElement: this.ariaLabelledBy,
                ariaDescribedByElements: this.ariaDescribedBy,
                ariaControlsElement: this.ariaControls,
                [ARIA_LABEL]: this.computedAriaLabel,
            });
            return;
        }

        if (timepicker) {
            synchronizeAttrs(timepicker, {
                ariaLabelledByElement: this.ariaLabelledBy,
                ariaDescribedByElements: this.ariaDescribedBy,
                ariaControlsElement: this.ariaControls,
                [ARIA_LABEL]: this.computedAriaLabel,
            });
            return;
        }

        if (!input) {
            return;
        }

        synchronizeAttrs(input, {
            [ARIA_LABELEDBY]: this.computedAriaLabelledBy,
            [ARIA_DESCRIBEDBY]: this.computedAriaDescribedBy,
            [ARIA_CONTROLS]: this.computedAriaControls,
            [ARIA_LABEL]: this.computedAriaLabel,
        });
    }

    connectedCallback() {
        this.classList.add('slds-form-element');
        this.validateRequiredAttributes();

        this._connected = true;

        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => this.reportValidity());

        this._initialChecked = this.checked;
        this._initialValue = this.displayedValue;
    }

    renderedCallback() {
        this.ariaObserver.sync();
        this.synchronizeA11y();
    }

    disconnectedCallback() {
        this._connected = false;
        this._inputElement = undefined;
    }

    /**
     * String value with the formatter to be used for number input. Valid values include
     * decimal, percent, percent-fixed, and currency.
     * @type {string}
     */
    @api
    get formatter() {
        return this._formatter;
    }

    set formatter(value) {
        this._formatter = normalizeString(value, {
            fallbackValue: DEFAULT_FORMATTER,
            validValues: VALID_NUMBER_FORMATTERS,
        });
    }

    /**
     * The type of the input. This value defaults to text.
     * @type {string}
     * @default text
     */
    @api
    get type() {
        return this._type;
    }

    set type(value) {
        const normalizedValue = normalizeString(value);
        this._type =
            normalizedValue === 'datetime' ? 'datetime-local' : normalizedValue;

        this.validateType(normalizedValue);

        this._inputElementRefreshNeeded = true;

        this._updateProxyInputAttributes([
            'type',
            'value',
            'max',
            'min',
            'required',
            'pattern',
        ]);
    }

    /**
     * If present, a spinner is displayed to indicate that data is loading.
     * @type {boolean}
     * @default false
     */
    @api
    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        this._isLoading = normalizeBoolean(value);
    }

    /**
     * Specifies the regular expression that the input's value is checked against.
     * This attribute is supported for text, search, url, tel, email, and password types.
     * @type {string}
     *
     */
    @api
    get pattern() {
        if (this.isTypeColor) {
            return '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
        }
        return this._pattern;
    }

    set pattern(value) {
        this._pattern = value;
        this._updateProxyInputAttributes('pattern');
    }

    /**
     * The maximum number of characters allowed in the field.
     * @type {number}
     */
    @api
    get maxLength() {
        return this._maxLength;
    }

    set maxLength(value) {
        this._maxLength = value;
        this._updateProxyInputAttributes('maxlength');
    }

    /**
     * Specifies the types of files that the server accepts. This attribute can be used only when type='file'.
     * @type {string}
     */
    @api
    get accept() {
        return this._accept;
    }

    set accept(value) {
        this._accept = value;
        this._updateProxyInputAttributes('accept');
    }

    /**
     * The minimum number of characters allowed in the field.
     * @type {number}
     */
    @api
    get minLength() {
        return this._minLength;
    }

    set minLength(value) {
        this._minLength = value;
        this._updateProxyInputAttributes('minlength');
    }

    // number and date/time
    /**
     * The maximum acceptable value for the input.  This attribute can be used only with number,
     * range, date, time, and datetime input types. For number and range type, the max value is a
     * decimal number. For the date, time, and datetime types, the max value must use a valid string for the type.
     * @type {decimal|string}
     */
    @api
    get max() {
        return this._max;
    }

    set max(value) {
        this._max = value;
        this._updateProxyInputAttributes('max');
    }

    /**
     * The minimum acceptable value for the input. This attribute can be used only with number,
     * range, date, time, and datetime input types. For number and range types, the min value
     * is a decimal number. For the date, time, and datetime types, the min value must use a valid string for the type.
     * @type {decimal|string}
     */
    @api
    get min() {
        return this._min;
    }

    set min(value) {
        this._min = value;
        this._updateProxyInputAttributes('min');
    }

    /**
     * Granularity of the value, specified as a positive floating point number.
     * Use 'any' when granularity is not a concern. This value defaults to 1.
     * @type {decimal|string}
     * @default 1
     */
    @api
    get step() {
        const stepNotSupportedYet = this.isTypeDateTime || this.isTypeTime;
        // The step attribute is broken on IE11; e.g. 123.45 with step=0.01 returns stepMismatch. See W-5356698 for details.
        const nativeStepBroken = this.isTypeNumber && isIE11;
        if (stepNotSupportedYet || nativeStepBroken) {
            return 'any';
        }
        return this._step;
    }

    set step(value) {
        this._step = normalizeInput(value);
        this._updateProxyInputAttributes('step');
        this._calculateFractionDigitsFromStep(value);
    }

    /**
     * If present, the checkbox is selected.
     * @type {boolean}
     * @default false
     */
    @api
    get checked() {
        return this._checked;
    }

    set checked(value) {
        this._checked = normalizeBoolean(value);
        this._updateProxyInputAttributes('checked');
        if (this._connected) {
            this.inputElement.checked = this._checked;
        }
    }

    /**
     * Specifies that a user can enter more than one value. This attribute can be used only when type='file' or type='email'.
     * @type {boolean}
     * @default false
     */
    @api
    get multiple() {
        return this._multiple;
    }

    set multiple(value) {
        this._multiple = normalizeBoolean(value);
        this._updateProxyInputAttributes('multiple');
    }

    /**
     * Specifies the value of an input element.
     * @type {object}
     */
    @api
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = normalizeInput(value);
        this._updateProxyInputAttributes('value');
        // do not reset to the same value because it causes IE11 to push the cursor to the end
        // in a re-render see W-5091299
        if (
            this._connected &&
            this.inputElement.value !== this.displayedValue
        ) {
            this.inputElement.value = this.displayedValue;
        }
    }

    /**
     * The variant changes the appearance of an input field. Accepted variants include standard and label-hidden. This value defaults to standard.
     * @type {string}
     * @default standard
     */
    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
    }

    /**
     * If present, the input field is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
        this._updateProxyInputAttributes('disabled');
    }

    /**
     * If present, the input field is read-only and cannot be edited by users.
     * @type {boolean}
     * @default false
     */
    @api
    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = normalizeBoolean(value);
        this._updateProxyInputAttributes('readonly');
    }

    /**
     * If present, the input field must be filled out before the form is submitted.
     * @type {boolean}
     * @default false
     */
    @api
    get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
        this._updateProxyInputAttributes('required');
    }

    /**
     * Specifies the time zone used when type='datetime' only. This value defaults to the user's Salesforce time zone setting.
     * @type {string}
     *
     */
    @api
    get timezone() {
        return this._timezone || getLocale().timezone;
    }

    set timezone(value) {
        this._timezone = value;
        // mobile date/time normalization of value/max/min depends on timezone, so we need to update here as well
        this._updateProxyInputAttributes(['value', 'max', 'min']);
    }

    /**
     * A FileList that contains selected files. This attribute can be used only when type='file'.
     * @type {object}
     *
     */
    @api
    get files() {
        if (this.isTypeFile) {
            return unwrap(this._files);
        }
        return null;
    }

    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     *
     */
    @api
    get validity() {
        return this._constraint.validity;
    }

    /**
     * Checks if the input is valid.
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Sets a custom error message to be displayed when a form is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */
    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */
    @api
    reportValidity() {
        if (this._connected && !this.isNativeInput) {
            // We let the date components handle their own error messaging for now
            let customValidity = '';
            if (this.validity.customError) {
                customValidity = this._constraint.validationMessage;
            }
            this.inputElement.setCustomValidity(customValidity);
            this.inputElement.showHelpMessageIfInvalid();
            return this.checkValidity();
        }

        return this._constraint.reportValidity(message => {
            this._helpMessage = message;
        });
    }

    get isNativeInput() {
        return !(
            this.isTypeDesktopDate ||
            this.isTypeDesktopDateTime ||
            this.isTypeDesktopTime
        );
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    /**
     * Help text detailing the purpose and function of the input.
     * @type {string}
     *
     */
    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    /**
     * Sets focus on the input element.
     */
    @api
    focus() {
        if (this._connected) {
            this.inputElement.focus();
        }
    }

    /**
     * Removes keyboard focus from the input element.
     */
    @api
    blur() {
        if (this._connected) {
            this.inputElement.blur();
        }
    }

    /**
     * Displays error messages on invalid fields.
     * An invalid field fails at least one constraint validation and returns false when checkValidity() is called.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    get computedAriaControls() {
        const ariaValues = [];

        // merge all date & time arias on mobile since it's displayed as a single field
        if (this.isTypeMobileDateTime) {
            ariaValues.push(this.dateAriaControls);
            ariaValues.push(this.timeAriaControls);
        }
        if (this.ariaControls) {
            ariaValues.push(this.ariaControls);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    get computedAriaLabel() {
        const ariaValues = [];

        // merge all date & time arias on mobile since it's displayed as a single field
        if (this.isTypeMobileDateTime) {
            ariaValues.push(this.dateAriaLabel);
            ariaValues.push(this.timeAriaLabel);
        }
        if (this.ariaLabel) {
            ariaValues.push(this.ariaLabel);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    get computedAriaLabelledBy() {
        const ariaValues = [];

        if (this.isTypeFile) {
            ariaValues.push(this.computedUniqueFileElementLabelledById);
        }
        // merge all date & time arias on mobile since it's displayed as a single field
        if (this.isTypeMobileDateTime) {
            ariaValues.push(this.dateAriaLabelledBy);
            ariaValues.push(this.timeAriaLabelledBy);
        }
        if (this.ariaLabelledBy) {
            ariaValues.push(this.ariaLabelledBy);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    get computedAriaDescribedBy() {
        const ariaValues = [];

        if (this._helpMessage) {
            ariaValues.push(this.computedUniqueHelpElementId);
        }
        // The toggle type is described by a secondary element
        if (this.isTypeToggle) {
            ariaValues.push(this.computedUniqueToggleElementDescribedById);
        }
        // merge all date & time arias on mobile since it's displayed as a single field
        if (this.isTypeMobileDateTime) {
            ariaValues.push(this.dateAriaDescribedBy);
            ariaValues.push(this.timeAriaDescribedBy);
        }
        if (this.ariaDescribedBy) {
            ariaValues.push(this.ariaDescribedBy);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * A value of 0 means that the element is focusable and
     * participates in sequential keyboard navigation. A value of -1 means
     * that the element is focusable but does not participate in keyboard navigation.
     * @type {number}
     *
     */
    @api
    get tabIndex() {
        return this._tabindex;
    }

    set tabIndex(newValue) {
        this._tabindex = newValue;
    }

    /**
     * Specifies a shortcut key to activate or focus an element.
     * @type {string}
     *
     */
    @api
    get accessKey() {
        return this._accesskey;
    }

    set accessKey(newValue) {
        this._accesskey = newValue;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get isLabelStacked() {
        return this.variant === VARIANT.LABEL_STACKED;
    }

    get accesskey() {
        return this._accesskey;
    }

    get internalTabIndex() {
        return this._tabindex;
    }

    get isTypeCheckable() {
        return (
            this.isTypeCheckbox ||
            this.isTypeCheckboxButton ||
            this.isTypeRadio ||
            this.isTypeToggle
        );
    }

    get colorInputElementValue() {
        return this.validity.valid && this.value ? this.value : DEFAULT_COLOR;
    }

    get colorInputStyle() {
        return `background: ${this.value || '#5679C0'};`;
    }

    get computedUniqueHelpElementId() {
        return getRealDOMId(this.template.querySelector('[data-help-message]'));
    }

    get computedUniqueToggleElementDescribedById() {
        if (this.isTypeToggle) {
            const toggle = this.template.querySelector(
                '[data-toggle-description]'
            );
            return getRealDOMId(toggle);
        }
        return null;
    }

    get computedUniqueFormLabelId() {
        if (this.isTypeFile) {
            const formLabel = this.template.querySelector('[data-form-label]');
            return getRealDOMId(formLabel);
        }
        return null;
    }

    get computedUniqueFileSelectorLabelId() {
        if (this.isTypeFile) {
            const fileBodyLabel = this.template.querySelector(
                '[data-file-selector-label]'
            );
            return getRealDOMId(fileBodyLabel);
        }
        return null;
    }

    get computedUniqueFileElementLabelledById() {
        if (this.isTypeFile) {
            const labelIds = [
                this.computedUniqueFormLabelId,
                this.computedUniqueFileSelectorLabelId,
            ];
            return labelIds.join(' ');
        }
        return null;
    }

    get computedFormElementClass() {
        const classes = classSet('slds-form-element__control slds-grow');

        if (this.isTypeSearch) {
            classes.add('slds-input-has-icon slds-input-has-icon_left-right');
        }

        return classes.toString();
    }

    get i18n() {
        return i18n;
    }

    get computedLabelClass() {
        const classnames = classSet('slds-form-element__label');
        if (this.isTypeCheckable || this.isTypeFile) {
            // do nothing
        } else if (this.isTypeToggle) {
            classnames.add('slds-m-bottom_none');
        } else {
            classnames.add('slds-no-flex');
        }
        return classnames
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get computedNumberClass() {
        return classSet('slds-input')
            .add({ 'slds-is-disabled': this.disabled })
            .toString();
    }

    get computedColorLabelClass() {
        return classSet('slds-color-picker__summary-label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get computedCheckboxClass() {
        return classSet('slds-checkbox')
            .add({ 'slds-checkbox_stacked': this.isLabelStacked })
            .toString();
    }

    get normalizedMax() {
        return this.normalizeDateTimeString(this.max);
    }

    get normalizedMin() {
        return this.normalizeDateTimeString(this.min);
    }

    get isTypeNumber() {
        return this.type === 'number';
    }

    get isTypeSearch() {
        return this.type === 'search';
    }

    get isTypeToggle() {
        return this.type === 'toggle';
    }

    get isTypeText() {
        return this.type === 'text';
    }

    get isTypeCheckbox() {
        return this.type === 'checkbox';
    }

    get isTypeRadio() {
        return this.type === 'radio';
    }

    get isTypeCheckboxButton() {
        return this.type === 'checkbox-button';
    }

    get isTypeFile() {
        return this.type === 'file';
    }

    get isTypeColor() {
        return this.type === 'color';
    }

    get isTypeDate() {
        return this.type === 'date';
    }

    get isTypeDateTime() {
        return this.type === 'datetime' || this.type === 'datetime-local';
    }

    get isTypeTime() {
        return this.type === 'time';
    }

    get isTypeMobileDate() {
        return this.isTypeDate && !this.isDesktopBrowser();
    }

    get isTypeDesktopDate() {
        return this.isTypeDate && this.isDesktopBrowser();
    }

    get isTypeMobileDateTime() {
        return this.isTypeDateTime && !this.isDesktopBrowser();
    }

    get isTypeDesktopDateTime() {
        return this.isTypeDateTime && this.isDesktopBrowser();
    }

    get isTypeMobileTime() {
        return this.isTypeTime && !this.isDesktopBrowser();
    }

    get isTypeDesktopTime() {
        return this.isTypeTime && this.isDesktopBrowser();
    }

    get isTypeSimple() {
        return (
            !this.isTypeCheckbox &&
            !this.isTypeCheckboxButton &&
            !this.isTypeToggle &&
            !this.isTypeRadio &&
            !this.isTypeFile &&
            !this.isTypeColor &&
            !this.isTypeDesktopDate &&
            !this.isTypeDesktopDateTime &&
            !this.isTypeDesktopTime
        );
    }

    get inputElement() {
        if (!this._connected) {
            return undefined;
        }
        if (!this._inputElement || this._inputElementRefreshNeeded) {
            let inputElement;
            if (this.isTypeDesktopDate) {
                inputElement = this.template.querySelector(
                    'lightning-datepicker'
                );
            } else if (this.isTypeDesktopDateTime) {
                inputElement = this.template.querySelector(
                    'lightning-datetimepicker'
                );
            } else if (this.isTypeDesktopTime) {
                inputElement = this.template.querySelector(
                    'lightning-timepicker'
                );
            } else {
                inputElement = this.template.querySelector('input');
            }
            this._inputElementRefreshNeeded = false;
            this._inputElement = inputElement;
        }
        return this._inputElement;
    }

    get nativeInputType() {
        let inputType = 'text';

        if (this.isTypeSimple) {
            inputType = this.type;
        } else if (
            this.isTypeToggle ||
            this.isTypeCheckboxButton ||
            this.isTypeCheckbox
        ) {
            inputType = 'checkbox';
        } else if (this.isTypeRadio) {
            inputType = 'radio';
        } else if (this.isTypeFile) {
            inputType = 'file';
        } else if (this.isTypeDateTime) {
            inputType = 'datetime-local';
        } else if (this.isTypeTime) {
            inputType = 'time';
        } else if (this.isTypeDate) {
            inputType = 'date';
        }
        return inputType;
    }

    clearAndSetFocusOnInput(clickEvent) {
        this.interactingState.enter();

        this.inputElement.value = '';
        this._updateValueAndValidityAttribute('');

        this.dispatchChangeEventWithDetail({
            value: this._value,
        });

        this.inputElement.focus();

        // LWC dynamically retargets events for performance reasons. In the case
        // that the original target--in this case, button--is no longer part of
        // the document when a listener receives an event, LWC bails retargeting
        // and returns the original target. By relaying this click, we avoid
        // leaking internals by manually changing the target from the detached
        // button to the host element.
        clickEvent.stopPropagation();
        // eslint-disable-next-line lightning-global/no-custom-event-bubbling
        const retargetedEvent = new CustomEvent('click', {
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(retargetedEvent);
    }

    dispatchChangeEventWithDetail(detail) {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail,
            })
        );
    }

    getFormattedValue(value) {
        if (!this.isTypeNumber) {
            return value;
        }

        if (isEmptyString(value)) {
            return '';
        }

        let formattedValue = value;
        let inputValue = value;

        // set formatter style & default options
        const formatStyle = this.formatter;
        const formatOptions = { style: formatStyle };

        // Use the min/max fraction digits from the formatFractionDigits provided by the user if available.
        // Otherwise, use the number of digits calculated from step
        if (this.formatFractionDigits !== undefined) {
            formatOptions.minimumFractionDigits = this.formatFractionDigits;
            formatOptions.maximumFractionDigits = this.formatFractionDigits;
        } else if (this._calculatedFractionDigits !== undefined) {
            formatOptions.minimumFractionDigits = this._calculatedFractionDigits;
            formatOptions.maximumFractionDigits = this._calculatedFractionDigits;
        }

        if (formatStyle === 'percent-fixed') {
            // percent-fixed just uses percent format and divides the value by 100
            // before passing to the library, this is to deal with the
            // fact that percentages in salesforce are 0-100, not 0-1
            formatOptions.style = 'percent';
            inputValue = parseFloat(inputValue) / 100;
        }

        try {
            formattedValue =
                numberFormat(formatOptions).format(inputValue) ||
                this.placeholder ||
                '';
        } catch (ignore) {
            // ignore any errors
        }
        return formattedValue;
    }

    validateType(type) {
        assert(
            type !== 'hidden',
            `<lightning-input> The type attribute value "hidden" is invalid. Use a regular <input type="hidden"> instead.`
        );
        assert(
            type !== 'submit' &&
                type !== 'reset' &&
                type !== 'image' &&
                type !== 'button',
            `<lightning-input> The type attribute value "${type}" is invalid. Use <lightning:button> instead.`
        );
        if (this.isTypeRadio) {
            assert(
                !this.required,
                `<lightning-input> The required attribute is not supported on radio inputs directly. It should be implemented at the radio group level.`
            );
        }
    }

    validateRequiredAttributes() {
        const { label } = this;
        assert(
            typeof label === 'string' && label.length,
            `<lightning-input> The required label attribute value "${label}" is invalid.`
        );
    }

    handleFileClick() {
        this.inputElement.value = null;
        this._updateValueAndValidityAttribute(null);
    }

    handleDropFiles(event) {
        // drop doesn't trigger focus nor blur, so set state to interacting
        // and auto leave when there's no more action
        this.interactingState.interacting();

        this.fileUploadedViaDroppableZone = true;
        this._files = event.dataTransfer && event.dataTransfer.files;

        this._updateProxyInputAttributes('required');

        this.dispatchChangeEventWithDetail({
            files: unwrap(this._files),
        });
    }

    handleFocus() {
        this.interactingState.enter();

        if (this.isTypeColor) {
            this._isColorPickerPanelOpen = false;
        }

        if (this._connected && this.isTypeNumber) {
            this._showFormattedNumber = false;
            this.inputElement.value = this.displayedValue;
            // The below check is needed due to a bug in Firefox with switching the
            // type to/from 'number'.
            // Remove the check once https://bugzilla.mozilla.org/show_bug.cgi?id=981248 is fixed
            const isFirefox = navigator.userAgent.indexOf('Firefox') >= 0;
            if (isFirefox) {
                if (this.validity.badInput) {
                    // reset value manually for Firefox to emulate the behaviour of
                    // a native input type number
                    this.inputElement.value = '';
                }
            } else {
                this.inputElement.type = 'number';
            }
        }

        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur(event) {
        this.interactingState.leave();

        if (this._connected && this.isTypeNumber) {
            // Don't need to change type to text and show the formatted number when value is empty.
            // This also fixes the issue where the component resets to empty string when
            // there's invalid value since input in badInput validity state gives us back an empty
            // string instead of the invalid value.
            this._showFormattedNumber = !isEmptyString(this._value);
            if (this._showFormattedNumber) {
                this.inputElement.type = 'text';
                this.inputElement.value = this.displayedValue;
            }
        }

        if (
            !event.relatedTarget ||
            !this.template.contains(event.relatedTarget)
        ) {
            this.dispatchEvent(new CustomEvent('blur'));
        }
    }

    handleChange(event) {
        event.stopPropagation();

        // For text and search we want every character typed to trigger a change event, so we ignore the native
        // input's 'change' event and respond to the 'input' event instead.
        const shouldIgnoreChangeEvent = this.isTypeText || this.isTypeSearch;
        if (shouldIgnoreChangeEvent) {
            return;
        }

        this.dispatchChangeEvent(this.isTypeNumber);
    }

    handleInput(event) {
        event.stopPropagation();

        if (this.isTypeSimple && this.value === event.target.value) {
            return;
        }

        this.dispatchChangeEvent();
    }

    handleKeyPress(event) {
        if (
            this.isTypeNumber &&
            !this.isFunctionKeyStroke(event) &&
            !this.isValidNumericKeyStroke(event)
        ) {
            event.preventDefault();
        }
    }

    dispatchChangeEvent(ignoreDispatchEvent) {
        this.interactingState.enter();

        const detail = {};

        if (this.isTypeCheckable) {
            this._updateCheckedAndValidityAttribute(this.inputElement.checked);
            detail.checked = this._checked;
        } else if (this.isTypeFile) {
            this._files = this.inputElement.files;
            // this.template.querySelector returns a proxy, and .files would also be proxied
            // we're unwrapping it here so that native apis can be used on it
            detail.files = unwrap(this._files);

            this._updateProxyInputAttributes('required');
        }

        if (!this.isTypeCheckable) {
            detail.value = this.inputElement.value;

            if (this.isTypeMobileDateTime) {
                detail.value = normalizeDateTimeToUTC(
                    detail.value,
                    this.timezone
                );
            } else if (this.isTypeMobileTime) {
                detail.value = normalizeTime(detail.value);
            }

            this._updateValueAndValidityAttribute(detail.value);
        }

        if (!ignoreDispatchEvent) {
            this.dispatchChangeEventWithDetail(detail);
        }
    }

    get _showClearButton() {
        return (
            this.isTypeSearch &&
            this._value !== undefined &&
            this._value !== null &&
            this._value !== ''
        );
    }

    handleColorPickerToggleClick(event) {
        event.preventDefault();

        // Don't want error state inside panel
        if (!this.validity.valid) {
            this.inputElement.value = DEFAULT_COLOR;
            this._updateValueAndValidityAttribute(DEFAULT_COLOR);
            this._helpMessage = null;
            this.classList.remove('slds-has-error');
            this.dispatchChangeEventWithDetail({ value: DEFAULT_COLOR });
        }
    }

    handleColorChange(event) {
        const selectedColor = event.detail.color;
        if (selectedColor !== this.inputElement.value) {
            this.inputElement.value = selectedColor;
            this._updateValueAndValidityAttribute(selectedColor);
            this.focus();
            this.dispatchChangeEventWithDetail({ value: selectedColor });
        }
        this.template
            .querySelector('lightning-primitive-colorpicker-button')
            .focus();
    }

    isNonPrintableKeyStroke(keyCode) {
        return Object.keys(keyCodes).some(code => keyCodes[code] === keyCode);
    }

    isFunctionKeyStroke(event) {
        return (
            event.ctrlKey ||
            event.metaKey ||
            this.isNonPrintableKeyStroke(event.keyCode)
        );
    }

    isValidNumericKeyStroke(event) {
        return /^[0-9eE.,+-]$/.test(event.key);
    }

    isDesktopBrowser() {
        return getFormFactor() === 'DESKTOP';
    }

    normalizeDateTimeString(value) {
        let result = value;
        if (this.isTypeDate) {
            result = normalizeDate(value);
        } else if (this.isTypeTime) {
            result = normalizeTime(value);
        } else if (this.isTypeDateTime) {
            result = normalizeUTCDateTime(value, this.timezone);
        }
        return result;
    }

    get displayedValue() {
        if (this.isTypeNumber && this._showFormattedNumber) {
            return this.getFormattedValue(this._value);
        }

        if (this.isTypeSimple) {
            return this.normalizeDateTimeString(this._value);
        }

        return this._value;
    }

    get _internalType() {
        if (this.isTypeNumber) {
            return 'text';
        }
        return this._type;
    }

    _updateValueAndValidityAttribute(value) {
        this._value = value;
        this._updateProxyInputAttributes('value');
    }

    _updateCheckedAndValidityAttribute(value) {
        this._checked = value;
        this._updateProxyInputAttributes('checked');
    }

    _calculateFractionDigitsFromStep(step) {
        // clear any previous value if set
        this._calculatedFractionDigits = undefined;

        if (step && step !== 'any') {
            let numDecimals = 0;
            // calculate number of decimals using step
            const decimals = String(step).split('.')[1];
            // we're parsing the decimals to account for cases where the step is
            // '1.0'
            if (decimals && parseInt(decimals, 10) > 0) {
                numDecimals = decimals.length;
            }

            this._calculatedFractionDigits = numDecimals;
        }
    }

    get _ignoreRequired() {
        // If uploading via the drop zone or via the input directly, we should
        // ignore the required flag as a file has been uploaded
        return (
            this.isTypeFile &&
            this._required &&
            (this.fileUploadedViaDroppableZone ||
                (this._files && this._files.length > 0))
        );
    }

    _updateProxyInputAttributes(attributes) {
        if (this._constraintApiProxyInputUpdater) {
            this._constraintApiProxyInputUpdater(attributes);
        }
    }

    get _constraint() {
        if (!this._constraintApi) {
            const overrides = {
                badInput: () => {
                    if (!this._connected) {
                        return false;
                    }

                    if (
                        this.isTypeNumber &&
                        this.getFormattedValue(this._value) === 'NaN'
                    ) {
                        return true;
                    }

                    return this.inputElement.validity.badInput;
                },
                tooLong: () =>
                    // since type=number is type=text in the dom when not in focus
                    // we should always return false as maxlength doesn't apply
                    !this.isTypeNumber &&
                    this._connected &&
                    this.inputElement.validity.tooLong,
                tooShort: () =>
                    // since type=number is type=text in the dom when not in focus
                    // we should always return false as minlength doesn't apply
                    !this.isTypeNumber &&
                    this._connected &&
                    this.inputElement.validity.tooShort,
                patternMismatch: () =>
                    this._connected &&
                    this.inputElement.validity.patternMismatch,
            };
            // FF, IE and Safari don't support datetime-local,
            // IE and Safari don't support time
            // we need to defer to the base component to check rangeOverflow/rangeUnderflow.
            // Due to the custom override, changing the type to or from datetime/time would affect the validation
            if (this.isTypeDesktopDateTime || this.isTypeDesktopTime) {
                overrides.rangeOverflow = () =>
                    this._connected && this.inputElement.validity.rangeOverflow;
                overrides.rangeUnderflow = () =>
                    this._connected &&
                    this.inputElement.validity.rangeUnderflow;
            }

            this._constraintApi = new FieldConstraintApiWithProxyInput(
                () => this,
                overrides
            );

            this._constraintApiProxyInputUpdater = this._constraint.setInputAttributes(
                {
                    type: () => this.nativeInputType,
                    // We need to normalize value so that it's consumable by the proxy input (otherwise the value
                    // will be invalid for the native input)
                    value: () => this.normalizeDateTimeString(this.value),
                    checked: () => this.checked,
                    maxlength: () => this.maxLength,
                    minlength: () => this.minLength,
                    // 'pattern' depends on type
                    pattern: () => this.pattern,
                    // 'max' and 'min' depend on type and timezone
                    max: () => this.normalizedMax,
                    min: () => this.normalizedMin,
                    step: () => this.step,
                    accept: () => this.accept,
                    multiple: () => this.multiple,
                    disabled: () => this.disabled,
                    readonly: () => this.readOnly,
                    // depends on type and whether an upload has been made
                    required: () => this.required && !this._ignoreRequired,
                }
            );
        }
        return this._constraintApi;
    }
}

LightningInput.interopMap = {
    exposeNativeEvent: {
        change: true,
        focus: true,
        blur: true,
    },
};
