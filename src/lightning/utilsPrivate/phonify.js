const NA_PHONE_NUMBER = '($1) $2-$3';
const IS_TEN_DIGITS = /^\d{10}$/;
const TEN_TO_NA = /(\d{3})(\d{3})(\d{4})/;
const IS_ELEVEN_DIGITS = /^1\d{10}/;
const ELEVEN_TO_NA = /1(\d{3})(\d{3})(\d{4})$/;

export function toNorthAmericanPhoneNumber(value) {
    if (IS_TEN_DIGITS.test(value)) {
        return value.replace(TEN_TO_NA, NA_PHONE_NUMBER);
    } else if (IS_ELEVEN_DIGITS.test(value)) {
        return value.replace(ELEVEN_TO_NA, NA_PHONE_NUMBER);
    }
    return value || '';
}
