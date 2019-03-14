import { LightningElement, api, track } from 'lwc';
import { assert } from 'lightning/utilsPrivate';

import TextTpl from './text.html';
import PhoneTpl from './phone.html';
import EmailTpl from './email.html';
import PercentTpl from './percent.html';
import UrlTpl from './url.html';
import CurrencyTpl from './currency.html';
import NumberTpl from './number.html';
import BooleanTpl from './boolean.html';
import DateLocalTpl from './dateLocal.html';
import DateTpl from './date.html';
import DefaultTpl from './default.html';

const TYPE_TPL_MAPPINGS = {
    text: TextTpl,
    phone: PhoneTpl,
    email: EmailTpl,
    percent: PercentTpl,
    url: UrlTpl,
    currency: CurrencyTpl,
    number: NumberTpl,
    boolean: BooleanTpl,
    'date-local': DateLocalTpl,
    date: DateTpl,
};
const INVALID_TYPE_FOR_EDIT = 'column type not supported for inline edit';

export default class LightningPrimitiveDatatableIeditTypeFactory extends LightningElement {
    @track columnLabel;
    @api editedValue;
    @api required;

    @api
    get columnDef() {
        return this._columnDef;
    }

    set columnDef(value) {
        assert(
            TYPE_TPL_MAPPINGS.hasOwnProperty(value.type),
            INVALID_TYPE_FOR_EDIT
        );

        this._columnDef = value;
        this.columnLabel = value.label;
    }

    get columnType() {
        return this._columnDef.type;
    }

    render() {
        return TYPE_TPL_MAPPINGS[this.columnType] || DefaultTpl;
    }

    connectedCallback() {
        this._blurHandler = this.handleComponentBlur.bind(this);
        this._focusHandler = this.handleComponentFocus.bind(this);
        this._changeHandler = this.handleComponentChange.bind(this);
    }

    renderedCallback() {
        this.concreteComponent.addEventListener('blur', this._blurHandler);
        this.concreteComponent.addEventListener('focus', this._focusHandler);
        this.concreteComponent.addEventListener('change', this._changeHandler);
    }

    get concreteComponent() {
        return this.template.querySelector('[data-inputable="true"]');
    }

    @api
    focus() {
        if (this.concreteComponent) {
            this.concreteComponent.focus();
        }
    }

    @api
    get value() {
        if (this.columnDef.type === 'boolean') {
            return this.concreteComponent.checked;
        }
        return this.concreteComponent.value;
    }

    @api
    get validity() {
        return this.concreteComponent.validity;
    }

    @api
    showHelpMessageIfInvalid() {
        this.concreteComponent.showHelpMessageIfInvalid();
    }

    get editedDateValue() {
        const dateValue = new Date(this.editedValue);

        if (this.editedValue === null || isNaN(dateValue.getTime())) {
            return '';
        }

        return dateValue.toISOString();
    }

    handleComponentFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleComponentBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleComponentChange() {
        this.showHelpMessageIfInvalid();
    }
}
