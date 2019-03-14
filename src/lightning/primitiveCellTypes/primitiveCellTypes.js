import { LightningElement, api } from 'lwc';
import { classSet, queryFocusable } from 'lightning/utils';

// types
import action from './action.html';
import button from './button.html';
import currency from './currency.html';
import date from './date.html';
import email from './email.html';
import location from './location.html';
import number from './number.html';
import percent from './percent.html';
import phone from './phone.html';
import rowNumber from './rowNumber.html';
import text from './text.html';
import url from './url.html';
import boolean from './boolean.html';
import dateLocal from './dateLocal.html';
import buttonIcon from './buttonIcon.html';

const typesMap = {
    action,
    button,
    currency,
    date,
    email,
    location,
    number,
    percent,
    phone,
    rowNumber,
    text,
    url,
    boolean,
    'date-local': dateLocal,
    'button-icon': buttonIcon,
};

export default class PrimitiveTypes extends LightningElement {
    @api types;
    @api columnType;
    @api value;
    @api columnLabel;
    @api rowKeyValue;
    @api colKeyValue;
    @api columnSubType;
    @api typeAttribute0;
    @api typeAttribute1;
    @api typeAttribute2;
    @api typeAttribute3;
    @api typeAttribute4;
    @api typeAttribute5;
    @api typeAttribute6;
    @api typeAttribute7;
    @api typeAttribute8;
    @api typeAttribute9;
    @api typeAttribute10;
    // typeAttribute21 and typeAttribute21 used by treegrid
    @api typeAttribute21;
    @api typeAttribute22;
    @api internalTabIndex;
    @api keyboardMode;

    get type() {
        const type = this.types.getType(this.columnType);
        if (type.type === 'custom') {
            return type.template;
        }
        if (this.columnType === 'tree' && typesMap[this.columnSubType]) {
            return typesMap[this.columnSubType];
        }
        if (typesMap[this.columnType]) {
            return typesMap[this.columnType];
        }
        return typesMap.text;
    }

    render() {
        return this.type;
    }

    get hasTreeData() {
        return this.columnType === 'tree';
    }

    get urlTarget() {
        return this.typeAttribute1 || '_blank';
    }

    get urlTooltip() {
        return this.typeAttribute2 || this.value;
    }

    get isChecked() {
        return !!this.value;
    }

    get typeAttributes() {
        const typeAttributes = this.types.getType(this.columnType)
            .typeAttributes;
        if (Array.isArray(typeAttributes)) {
            return typeAttributes.reduce((seed, attrName, index) => {
                seed[attrName] = this[`typeAttribute${index}`];
                return seed;
            }, {});
        }
        return {};
    }

    get dateValue() {
        // new Date(null) returns new Date(0), which is not expected.
        // for undefined, '', or any other invalid values, formatted-date-time
        // just displays ''
        if (this.value === null) {
            return '';
        }

        // this is temporary, formatted-date-time should accept
        // date time string formats like '2017-03-01 08:45:12Z'
        // it's accepting only timestamp and Date objects
        return new Date(this.value);
    }

    get computedDateLocalDay() {
        return this.typeAttribute0 || 'numeric';
    }

    get computedDateLocalMonth() {
        return this.typeAttribute1 || 'short';
    }

    get computedDateLocalYear() {
        return this.typeAttribute2 || 'numeric';
    }

    get rowNumberErrorClass() {
        const classes = classSet('slds-m-horizontal_xxx-small');
        const error = this.typeAttribute0;
        if (error) {
            classes.add({ 'slds-hidden': !error.title && !error.messages });
        }
        return classes.toString();
    }

    @api
    getActionableElements() {
        return queryFocusable(this.template);
    }
}
