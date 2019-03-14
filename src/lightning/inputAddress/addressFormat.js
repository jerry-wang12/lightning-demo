// eslint-disable-next-line lwc/no-aura-libs
import { addressFormat } from 'lightning:IntlLibrary';

const FORMAT_CODE_MAP = {
    A: 'street',
    C: 'city',
    S: 'province',
    Z: 'postalCode',
    K: 'country',
};

export const parseLocaleFormat = function(format) {
    if (isValidFieldFormat(format)) {
        return format
            .toUpperCase()
            .split(/(?=[A-Z])/)
            .map(formatCode => FORMAT_CODE_MAP[formatCode]);
    }
    return [];
};

export function getInputOrder(langCode, countryCode, hasCountryPicklist) {
    let inputOrder = addressFormat.getAddressInputOrderAllField(
        langCode,
        countryCode
    );
    // always show country picklist as the first field
    // to match aloha behavior
    if (hasCountryPicklist) {
        inputOrder = 'K' + inputOrder.replace('K', '');
    }
    return parseLocaleFormat(inputOrder);
}

export function getRequiredFields(langCode, countryCode) {
    const requireFields = addressFormat.getAddressRequireFields(
        langCode,
        countryCode
    );
    return parseLocaleFormat(requireFields);
}

function isValidFieldFormat(value) {
    return typeof value === 'string' && /^[ACSZK]+$/i.test(value);
}
