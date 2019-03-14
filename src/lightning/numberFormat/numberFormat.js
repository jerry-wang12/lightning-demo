import { numberFormatFallback } from './numberFormatFallback';
import utils from './utils';

export function numberFormat(options) {
    const normalizedOpts = Object.assign({}, utils.normalizeOptions(options));
    if (!('Intl' in window)) {
        return numberFormatFallback(normalizedOpts);
    }

    return {
        format: value => {
            if (
                value &&
                utils.exceedsSafeLength(
                    value,
                    normalizedOpts.maximumFractionDigits
                )
            ) {
                return numberFormatFallback(normalizedOpts).format(value);
            }
            const numberFormatInstance = utils.getFromCache(normalizedOpts);
            return numberFormatInstance.format(value);
        },
    };
}
