import { LightningElement, api } from 'lwc';
import { numberFormat } from 'lightning/numberFormat';

/**
 * Displays formatted numbers for decimals, currency, and percentages.
 */
export default class LightningFormattedNumber extends LightningElement {
    /**
     * The value to be formatted.
     * @type {number}
     * @required
     */
    @api value;

    /**
     * The number formatting style to use. Possible values are decimal, currency,
     * and percent. This value defaults to decimal.
     * @type {string}
     * @default decimal
     */
    @api formatStyle = 'decimal';

    /**
     * Only used if format-style='currency', this attribute determines which currency is
     * displayed. Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar.
     * @type {string}
     *
     */
    @api currencyCode;

    /**
     * Determines how currency is displayed. Possible values are symbol, code, and name. This value defaults to symbol.
     * @type {string}
     * @default symbol
     */
    @api currencyDisplayAs = 'symbol';

    /**
     * The minimum number of integer digits that are required. Possible values are from 1 to 21.
     * @type {number}
     *
     */
    @api minimumIntegerDigits;

    /**
     * The minimum number of fraction digits that are required.
     * @type {number}
     *
     */
    @api minimumFractionDigits;

    /**
     * The maximum number of fraction digits that are allowed.
     * @type {number}
     *
     */
    @api maximumFractionDigits;

    /**
     * The minimum number of significant digits that are required. Possible values are from 1 to 21.
     * @type {number}
     *
     */
    @api minimumSignificantDigits;

    /**
     * The maximum number of significant digits that are allowed. Possible values are from 1 to 21.
     * @type {number}
     *
     */
    @api maximumSignificantDigits;

    get formattedNumber() {
        const value = this.value;
        const options = {
            style: this.formatStyle,
            currency: this.currencyCode,
            currencyDisplay: this.currencyDisplayAs,
            minimumIntegerDigits: this.minimumIntegerDigits,
            minimumFractionDigits: this.minimumFractionDigits,
            maximumFractionDigits: this.maximumFractionDigits,
            minimumSignificantDigits: this.minimumSignificantDigits,
            maximumSignificantDigits: this.maximumSignificantDigits,
        };

        const canReturnValue =
            value !== undefined &&
            value !== null &&
            value !== '' &&
            isFinite(value);

        if (canReturnValue) {
            let valueToFormat = value;

            // percent-fixed just divides the value by 100
            // before passing to the library, this is to deal with the
            // fact that percentages in salesforce are 0-100, not 0-1
            if (this.formatStyle === 'percent-fixed') {
                options.style = 'percent';
                valueToFormat = parseFloat(value) / 100;
            }
            return numberFormat(options).format(valueToFormat);
        }

        return '';
    }
}

LightningFormattedNumber.interopMap = {
    props: {
        formatStyle: 'style',
    },
};
