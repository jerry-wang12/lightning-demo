import { getNubbinShiftAmount, getBubbleAlignAndPosition } from '../utils';

describe('helptext utils', () => {
    describe('getNubbinShiftAmount', () => {
        it('should use left horizontal shift', () => {
            const nubbinBoundingRect = {
                left: 10,
                right: 20,
                height: 20,
            };

            const actual = getNubbinShiftAmount(nubbinBoundingRect, 10);

            expect(actual.horizontal).toBe(5);
            expect(actual.vertical).toBe(20);
        });

        it('should use right horizontal shift', () => {
            const nubbinBoundingRect = {
                left: 20,
                right: 10,
                height: 20,
            };

            const actual = getNubbinShiftAmount(nubbinBoundingRect, 10);

            expect(actual.horizontal).toBe(5);
            expect(actual.vertical).toBe(20);
        });

        it('should use left horizontal shift on right undefined', () => {
            const nubbinBoundingRect = {
                left: 10,
                right: undefined,
                height: 20,
            };

            const actual = getNubbinShiftAmount(nubbinBoundingRect, 10);

            expect(actual.horizontal).toBe(5);
            expect(actual.vertical).toBe(20);
        });

        it('should use right horizontal shift on left undefined', () => {
            const nubbinBoundingRect = {
                left: undefined,
                right: 10,
                height: 20,
            };

            const actual = getNubbinShiftAmount(nubbinBoundingRect, 10);

            expect(actual.horizontal).toBe(5);
            expect(actual.vertical).toBe(20);
        });

        it('should use any of them', () => {
            const nubbinBoundingRect = {
                left: 10,
                right: 10,
                height: 20,
            };

            const actual = getNubbinShiftAmount(nubbinBoundingRect, 10);

            expect(actual.horizontal).toBe(5);
            expect(actual.vertical).toBe(20);
        });
    });

    describe('getBubbleAlignAndPosition', () => {
        const defaultAlign = { horizontal: 'left', vertical: 'bottom' };
        const shiftAmounts = { horizontal: 16, vertical: 16 };
        const xOffset = 0;
        const yOffset = 0;

        const assertAlign = (expected, actual) => {
            expect(actual.horizontal).toBe(expected.horizontal);
            expect(actual.vertical).toBe(expected.vertical);
        };

        const assertPosition = (expected, actual) => {
            expect(actual.top).toBe(expected.top);
            expect(actual.right).toBe(expected.right);
            expect(actual.bottom).toBe(expected.bottom);
            expect(actual.left).toBe(expected.left);
        };

        describe('no overflow in any direction', () => {
            const triggerBoundingClientRect = {
                bottom: 200,
                height: 19,
                left: 704,
                right: 720,
                top: 181,
                width: 16,
            };
            const bubbleBoundingClientRect = {
                bottom: 70,
                height: 70,
                left: 0,
                right: 320,
                top: 0,
                width: 320,
            };
            const availableHeight = 360;
            const availableWidth = 1440;
            const expectedAlign = { horizontal: 'left', vertical: 'bottom' };

            it('should default to bottom left align', () => {
                const actual = getBubbleAlignAndPosition(
                    triggerBoundingClientRect,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    xOffset,
                    yOffset
                );

                const expectedPosition = {
                    top: null,
                    right: null,
                    bottom: '195px',
                    left: '688px',
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });
        });

        describe('overflows all but top right', () => {
            const triggerBoundingClientRect = {
                bottom: 20,
                height: 19,
                left: 1424,
                right: 1440,
                top: 1,
                width: 16,
            };
            const bubbleBoundingClientRect = {
                bottom: 34,
                height: 34,
                left: 0,
                right: 95.59375,
                top: 0,
                width: 95.59375,
            };
            const availableHeight = 360;
            const availableWidth = 1440;
            const expectedAlign = { horizontal: 'right', vertical: 'top' };

            it('should use top right align (edge case)', () => {
                const actual = getBubbleAlignAndPosition(
                    triggerBoundingClientRect,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    xOffset,
                    yOffset
                );

                const expectedPosition = {
                    top: '36px',
                    right: 0,
                    bottom: null,
                    left: null,
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });

            it('should use top right align (with space case)', () => {
                const modifiedTriggerBounding = Object.assign(
                    {},
                    triggerBoundingClientRect,
                    { right: 1420, left: 1404 }
                );
                const actual = getBubbleAlignAndPosition(
                    modifiedTriggerBounding,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    xOffset,
                    yOffset
                );

                const expectedPosition = {
                    top: '36px',
                    right: '4px',
                    bottom: null,
                    left: null,
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });

            it('should use top right align (with scroller)', () => {
                const actual = getBubbleAlignAndPosition(
                    triggerBoundingClientRect,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    7,
                    11
                );

                const expectedPosition = {
                    top: '47px',
                    right: 0,
                    bottom: null,
                    left: null,
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });
        });

        describe('overflows all but top left', () => {
            const triggerBoundingClientRect = {
                bottom: 20,
                height: 19,
                left: 0,
                right: 16,
                top: 1,
                width: 16,
            };
            const bubbleBoundingClientRect = {
                bottom: 70,
                height: 70,
                left: 0,
                right: 320,
                top: 0,
                width: 320,
            };
            const availableHeight = 360;
            const availableWidth = 1440;
            const expectedAlign = { horizontal: 'left', vertical: 'top' };

            it('should use top left align (edge case)', () => {
                const actual = getBubbleAlignAndPosition(
                    triggerBoundingClientRect,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    xOffset,
                    yOffset
                );

                const expectedPosition = {
                    top: '36px',
                    right: null,
                    bottom: null,
                    left: 0,
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });

            it('should use top left align (with space case)', () => {
                const modifiedTriggerBounding = Object.assign(
                    {},
                    triggerBoundingClientRect,
                    { bottom: 40, top: 21, left: 20, right: 36 }
                );
                const actual = getBubbleAlignAndPosition(
                    modifiedTriggerBounding,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    xOffset,
                    yOffset
                );

                const expectedPosition = {
                    top: '56px',
                    right: null,
                    bottom: null,
                    left: '4px',
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });

            it('should use top left align (with scroller)', () => {
                const actual = getBubbleAlignAndPosition(
                    triggerBoundingClientRect,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    7,
                    11
                );

                const expectedPosition = {
                    top: '47px',
                    right: null,
                    bottom: null,
                    left: 0,
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });
        });

        describe('overflows all but bottom right', () => {
            const triggerBoundingClientRect = {
                bottom: 362,
                height: 19,
                left: 1424,
                right: 1440,
                top: 343,
                width: 16,
            };
            const bubbleBoundingClientRect = {
                bottom: 34,
                height: 34,
                left: 0,
                right: 95.59375,
                top: 0,
                width: 95.59375,
            };
            const availableHeight = 362;
            const availableWidth = 1440;
            const expectedAlign = { horizontal: 'right', vertical: 'bottom' };

            it('should use bottom right align (edge case)', () => {
                const actual = getBubbleAlignAndPosition(
                    triggerBoundingClientRect,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    xOffset,
                    yOffset
                );

                const expectedPosition = {
                    top: null,
                    right: 0,
                    bottom: '35px',
                    left: null,
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });

            it('should use bottom right align (with space case)', () => {
                const modifiedTriggerBounding = Object.assign(
                    {},
                    triggerBoundingClientRect,
                    { right: 1420, top: 333 }
                );
                const actual = getBubbleAlignAndPosition(
                    modifiedTriggerBounding,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    xOffset,
                    yOffset
                );

                const expectedPosition = {
                    top: null,
                    right: '4px',
                    bottom: '45px',
                    left: null,
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });

            it('should use bottom right align (with scroller)', () => {
                const actual = getBubbleAlignAndPosition(
                    triggerBoundingClientRect,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    7,
                    11
                );

                const expectedPosition = {
                    top: null,
                    right: 0,
                    bottom: '24px',
                    left: null,
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });
        });
        describe('overflows all but bottom left', () => {
            const triggerBoundingClientRect = {
                bottom: 315,
                height: 19,
                left: 260,
                right: 276,
                top: 296,
                width: 16,
            };
            const bubbleBoundingClientRect = {
                bottom: 70,
                height: 70,
                left: 0,
                right: 320,
                top: 0,
                width: 320,
            };
            const availableHeight = 315;
            const availableWidth = 1440;
            const expectedAlign = { horizontal: 'left', vertical: 'bottom' };

            it('should use bottom left align (edge case)', () => {
                const actual = getBubbleAlignAndPosition(
                    triggerBoundingClientRect,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    xOffset,
                    yOffset
                );

                const expectedPosition = {
                    top: null,
                    right: null,
                    bottom: '35px',
                    left: '244px',
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });

            it('should use bottom left align (with space case)', () => {
                const modifiedTriggerBounding = Object.assign(
                    {},
                    triggerBoundingClientRect,
                    { left: 280, top: 286 }
                );
                const actual = getBubbleAlignAndPosition(
                    modifiedTriggerBounding,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    xOffset,
                    yOffset
                );

                const expectedPosition = {
                    top: null,
                    right: null,
                    bottom: '45px',
                    left: '264px',
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });

            it('should use bottom left align (with scroller)', () => {
                const actual = getBubbleAlignAndPosition(
                    triggerBoundingClientRect,
                    bubbleBoundingClientRect,
                    defaultAlign,
                    shiftAmounts,
                    availableHeight,
                    availableWidth,
                    7,
                    11
                );

                const expectedPosition = {
                    top: null,
                    right: null,
                    bottom: '24px',
                    left: '251px',
                };

                assertAlign(expectedAlign, actual.align);
                assertPosition(expectedPosition, actual);
            });
        });
    });
});
