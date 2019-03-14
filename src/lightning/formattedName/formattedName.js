import { LightningElement, api, track } from 'lwc';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
// eslint-disable-next-line lwc/no-aura-libs
import { utils as localeUtils, nameFormat } from 'lightning:IntlLibrary';

const DEFAULT_FORMAT = 'long';

/**
 * Displays a formatted name that can include a salutation and suffix.
 */
export default class LightningFormattedName extends LightningElement {
    /**
     * The format to use to display the name. Valid values include short, medium, and long. This value defaults to long.
     * @type {string}
     *
     */
    @api format = DEFAULT_FORMAT;

    @track _salutation;
    @track _firstName;
    @track _lastName;
    @track _middleName;
    @track _suffix;
    @track _informalName;

    /**
     * The value for the salutation, such as Dr. or Mrs.
     * @type {string}
     *
     */
    @api
    get salutation() {
        return this._salutation;
    }

    set salutation(value) {
        this._salutation = value;
    }

    /**
     * The value for the first name.
     * @type {string}
     *
     */
    @api
    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    /**
     * The value for the last name.
     * @type {string}
     *
     */
    @api
    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    /**
     * The value for the middle name.
     * @type {string}
     *
     */
    @api
    get middleName() {
        return this._middleName;
    }

    set middleName(value) {
        this._middleName = value;
    }

    /**
     * The value for the suffix, such as Jr. or Esq.
     * @type {string}
     *
     */
    @api
    get suffix() {
        return this._suffix;
    }

    set suffix(value) {
        this._suffix = value;
    }

    /**
     * The value for the informal name.
     * @type {string}
     *
     */
    @api
    get informalName() {
        return this._informalName;
    }

    set informalName(value) {
        this._informalName = value;
    }

    get normalizedFormat() {
        return normalize(this.format, {
            fallbackValue: DEFAULT_FORMAT,
            validValues: ['short', 'medium', 'long'],
        });
    }

    get hasValue() {
        return !!(
            this.salutation ||
            this.firstName ||
            this.lastName ||
            this.middleName ||
            this.suffix ||
            this.informalName
        );
    }

    get formattedName() {
        const { normalizedFormat } = this;
        const nameObject = {
            first: this.firstName,
            middle: this.middleName,
            last: this.lastName,
            salutation: this.salutation,
            suffix: this.suffix,
            informal: this.informalName,
        };
        let formattedName = '';
        const locale = localeUtils.getLocaleTag().replace(/-/g, '_');
        switch (normalizedFormat) {
            case 'short':
                formattedName = nameFormat.formatNameShort(locale, nameObject);
                break;
            case 'medium':
                formattedName = nameFormat.formatNameMedium(locale, nameObject);
                break;
            case 'long':
            default:
                formattedName = nameFormat.formatNameLong(locale, nameObject);
        }
        return formattedName;
    }
}
