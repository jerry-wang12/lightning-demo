import { getLocalizationService } from 'lightning/configProvider';
import NumberOptions from './numberOptions';

const localizationService = getLocalizationService();

export function numberFormatFallback(options) {
    const skeleton = new NumberOptions(options).getSkeleton();
    return {
        format: value => {
            return localizationService.getNumberFormat(skeleton).format(value);
        },
    };
}
