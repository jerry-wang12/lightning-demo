/* eslint eslint-comments/no-use: off */
/* eslint-disable lwc/no-aura */
describe('lightning-configProvider', () => {
    beforeEach(() => {
        // needed to reset module variables.
        jest.resetModules(true);
    });

    describe('default config', () => {
        it('should provide a default config using $A when is present', () => {
            const _A = {
                get: jest.fn(),
                localizationService: 'localization-service',
                getContext: () => {
                    return {
                        getPathPrefix: () => 'aura-path-prefix',
                    };
                },
                getToken: jest.fn(),
                util: {
                    sanitizeDOM: jest.fn(),
                },
            };
            global.$A = _A;

            const configProviderModule = require('../configProvider');
            const {
                getFormFactor,
                getLocale,
                getPathPrefix,
                getToken,
                getLocalizationService,
                getCoreInfo,
                sanitizeDOM,
            } = configProviderModule;

            getFormFactor();
            expect(_A.get).toBeCalledTimes(1);
            expect(_A.get.mock.calls[0][0]).toBe('$Browser.formFactor');

            getLocale();
            expect(_A.get).toBeCalledTimes(2);
            expect(_A.get.mock.calls[1][0]).toBe('$Locale');

            expect(getPathPrefix()).toBe('aura-path-prefix');

            getToken('test-token');
            expect(_A.getToken).toBeCalled();
            expect(_A.getToken.mock.calls[0][0]).toBe('test-token');

            expect(getLocalizationService()).toBe('localization-service');

            expect(getCoreInfo()).toEqual({
                localhostPort: '',
                securePort: '',
                untrustedContentDomain: '.a.forceusercontent.com',
            });

            const sanitizeStringConfig = { testConfig: true };
            const stringToSanitize = 'string to sanitize';
            sanitizeDOM(stringToSanitize, sanitizeStringConfig);

            expect(_A.util.sanitizeDOM).toBeCalled();
            expect(_A.util.sanitizeDOM.mock.calls[0][0]).toBe(stringToSanitize);
            expect(_A.util.sanitizeDOM.mock.calls[0][1]).toBe(
                sanitizeStringConfig
            );

            global.$A = undefined;
        });

        it('should have a default config when $A is missing', () => {
            const configProviderModule = require('../configProvider');
            const {
                getFormFactor,
                getLocale,
                getPathPrefix,
                getToken,
                getLocalizationService,
                getCoreInfo,
                sanitizeDOM,
            } = configProviderModule;

            expect(getFormFactor()).toBe('DESKTOP');

            const {
                userLocaleCountry,
                userLocaleLang,
                timezone,
                langLocale,
                language,
                country,
                currency,
                currencyCode,
                dateFormat,
                datetimeFormat,
            } = getLocale();
            expect(userLocaleCountry).toBe('US');
            expect(userLocaleLang).toBe('en');
            expect(timezone).toBe('America/Los_Angeles');
            expect(langLocale).toBe('en_US');
            expect(language).toBe('en');
            expect(country).toBe('US');
            expect(currency).toBe('$');
            expect(currencyCode).toBe('USD');
            expect(dateFormat).toBe('MMM d, yyyy');
            expect(datetimeFormat).toBe('MMM d, yyyy h:mm:ss a');

            expect(getPathPrefix()).toBe('');
            expect(getToken('test')).toBe('test');
            expect(getLocalizationService()).not.toBeNull();
            expect(getCoreInfo()).toEqual({
                localhostPort: '',
                securePort: '',
                untrustedContentDomain: '.a.forceusercontent.com',
            });
            expect(sanitizeDOM('str', { testConfig: true })).toBe('');
        });
    });

    describe('providing a configProvider', () => {
        const configProviderMock = {
            getFormFactor() {
                return 'form-factor';
            },
            getLocale() {
                return 'locale-us';
            },
            getLocalizationService() {
                return 'localization-service';
            },
            getPathPrefix() {
                return 'path-prefix';
            },
            getToken(name) {
                return `token-${name}`;
            },
            sanitizeDOM(dirty, config) {
                return `sanitize-dom: ${dirty}, ${config}`;
            },
            getInitializer(info) {
                expect(info).toBe('coreInfoConfig');

                return 'core-info';
            },
        };

        it('should override with provided values', () => {
            const configProviderModule = require('../configProvider');
            const configProviderService = configProviderModule.default;
            const {
                getFormFactor,
                getLocale,
                getPathPrefix,
                getToken,
                getLocalizationService,
                getCoreInfo,
                sanitizeDOM,
            } = configProviderModule;

            expect(getFormFactor()).not.toBe(
                configProviderMock.getFormFactor()
            );

            configProviderService(configProviderMock);

            expect(getFormFactor()).toBe(configProviderMock.getFormFactor());
            expect(getLocale()).toBe(configProviderMock.getLocale());
            expect(getPathPrefix()).toBe(configProviderMock.getPathPrefix());
            expect(getToken('test')).toBe(configProviderMock.getToken('test'));
            expect(getLocalizationService()).toBe(
                configProviderMock.getLocalizationService()
            );
            expect(getCoreInfo()).toBe('core-info');
            expect(sanitizeDOM(true, { testConfig: true })).toBe(
                configProviderMock.sanitizeDOM(true, { testConfig: true })
            );
        });

        it('should throw if a provider has been already set', () => {
            const configProviderModule = require('../configProvider');
            const configProviderService = configProviderModule.default;

            let expeptionThrown = false;
            configProviderService(configProviderMock);

            try {
                configProviderService({});
            } catch (e) {
                expeptionThrown = true;
                expect(e.message).toBe(
                    'ConfigProvider can only be set once at initilization time'
                );
            }

            expect(expeptionThrown).toBe(true);
        });
    });
});
