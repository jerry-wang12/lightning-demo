// eslint-disable-next-line lwc/no-aura-libs
import { utils as localeUtils } from 'lightning:IntlLibrary';

export function setLocaleTagMock(locale) {
    Object.assign(localeUtils, {
        getLocaleTag: jest.fn(() => locale),
    });
}
