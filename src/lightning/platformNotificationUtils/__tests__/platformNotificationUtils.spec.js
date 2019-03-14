import { showToast } from 'lightning/platformNotificationUtils';

const TEST_TITLE = 'test-title';
const TEST_MESSAGE = 'test-message';

let toastDefinition = null;
let callbackCalls = 0;

const callback = toast => {
    toastDefinition = toast;
    callbackCalls += 1;
};

describe('toast()', () => {
    beforeEach(() => {
        callbackCalls = 0;
        toastDefinition = null;
    });

    it('should not fire event for invalid values', () => {
        expect(showToast(null, callback)).toBe(false);
        expect(showToast('invalid object', callback)).toBe(false);
        expect(showToast({}, callback)).toBe(false);
        expect(showToast({ title: {} }, callback)).toBe(false);
        expect(showToast({ message: 4 }, callback)).toBe(false);

        expect(callbackCalls).toBe(0);
    });

    it('should provide default values', () => {
        expect(showToast({ title: TEST_TITLE }, callback)).toBe(true);

        expect(toastDefinition.type).toBe('info');
        expect(toastDefinition.mode).toBe('dismissible');
        expect(toastDefinition.duration).toBe(3000);
    });

    describe('variant', () => {
        const assertVariantItsCorrect = (variant, expected) => {
            return () => {
                expect(
                    showToast(
                        {
                            variant,
                            title: TEST_TITLE,
                        },
                        callback
                    )
                ).toBe(true);

                expect(toastDefinition.type).toBe(expected);
            };
        };

        ['info', 'success', 'warning', 'error'].forEach(variant => {
            it(
                `should send variant '${variant}' as type`,
                assertVariantItsCorrect(variant, variant)
            );
        });
    });

    describe('mode', () => {
        const assertVariantItsCorrect = (mode, expected) => {
            return () => {
                expect(
                    showToast(
                        {
                            mode,
                            title: TEST_TITLE,
                        },
                        callback
                    )
                ).toBe(true);

                expect(toastDefinition.mode).toBe(expected);
            };
        };

        ['dismissible', 'sticky', 'pester'].forEach(mode => {
            it(
                `should send '${mode}' as mode`,
                assertVariantItsCorrect(mode, mode)
            );
        });
    });

    describe('title', () => {
        it('should map title into message', () => {
            expect(showToast({ title: TEST_TITLE }, callback)).toBe(true);

            expect(toastDefinition.message).toBe(TEST_TITLE);
        });

        it('should map title into title', () => {
            expect(
                showToast(
                    {
                        title: TEST_TITLE,
                        message: TEST_MESSAGE,
                    },
                    callback
                )
            ).toBe(true);

            expect(toastDefinition.title).toBe(TEST_TITLE);
            expect(toastDefinition.message).toBe(TEST_MESSAGE);
        });
    });

    describe('messageData', () => {
        it('should not send template data on invalid', () => {
            expect(
                showToast(
                    {
                        title: TEST_TITLE,
                        messageData: {},
                    },
                    callback
                )
            ).toBe(true);

            expect(toastDefinition.message).toBe(TEST_TITLE);
            expect(toastDefinition.messageTemplateData).toBe(undefined);
        });

        it('should send template data', () => {
            const msgData = [{ test: 'data' }];
            expect(
                showToast(
                    {
                        title: TEST_TITLE,
                        message: TEST_MESSAGE,
                        messageData: msgData,
                    },
                    callback
                )
            ).toBe(true);

            expect(toastDefinition.title).toBe(TEST_TITLE);
            expect(toastDefinition.message).toBe(TEST_MESSAGE);
            expect(toastDefinition.messageTemplate).toBe(TEST_MESSAGE);
            expect(toastDefinition.messageTemplateData).toBe(msgData);
        });
    });
});
