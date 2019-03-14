const URL_CHECK_REGEX = /^(\/+|\.+|ftp|http(s?):\/\/)/i;

export function isAbsoluteUrl(url) {
    return URL_CHECK_REGEX.test(url);
}
