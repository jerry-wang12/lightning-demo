// eslint-disable-next-line lwc/no-aura-libs
import { utils as localeUtils, nameFormat } from 'lightning:IntlLibrary';

const FORMAT_CODE_MAP = {
    L: 'lastName',
    M: 'middleName',
    F: 'firstName',
    S: 'salutation',
    X: 'suffix',
    I: 'informalName',
};

export const parseFieldsFormat = function(format) {
    if (isValidLocaleFormat(format)) {
        return format
            .toUpperCase()
            .split(/(?=[A-Z])/)
            .map(formatCode => FORMAT_CODE_MAP[formatCode]);
    }
    return [];
};

export const getFieldsOrder = function() {
    const locale = localeUtils.getLocaleTag().replace(/-/g, '_');
    const inputOrder = parseFieldsFormat(nameFormat.getNameInputOrder(locale));
    return inputOrder;
};

function isValidLocaleFormat(value) {
    return typeof value === 'string' && /^[LMFSXI]+$/i.test(value);
}
