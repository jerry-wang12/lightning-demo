import {
    getInfiniteLoadingDefaultState,
    handleLoadMoreCheck,
    getLoadMoreOffset,
    setLoadMoreOffset,
    isLoading,
    setLoading,
    handlePrefetch,
} from '../infiniteLoading';

describe('infinite loading', () => {
    describe('load more offset', () => {
        const defaultOffset = getInfiniteLoadingDefaultState().loadMoreOffset;

        it('should accept a number', () => {
            const state = {};
            setLoadMoreOffset(state, 5);
            expect(getLoadMoreOffset(state)).toEqual(5);
        });

        it('should accept string numbers and normalize it to number type', () => {
            const state = {};
            setLoadMoreOffset(state, '10');
            expect(getLoadMoreOffset(state)).toEqual(10);
        });

        it('should return default when value is undefined', () => {
            const state = {};
            setLoadMoreOffset(state);
            expect(getLoadMoreOffset(state)).toEqual(defaultOffset);
        });

        it('should return default when value is random characters', () => {
            const state = {};
            setLoadMoreOffset(state, 'fdas');
            expect(getLoadMoreOffset(state)).toEqual(defaultOffset);
        });

        it('should return default when value is negative', () => {
            const state = {};
            setLoadMoreOffset(state, -5);
            expect(getLoadMoreOffset(state)).toEqual(defaultOffset);
        });
    });

    describe('loading', () => {
        it('should default loading to false', () => {
            expect(isLoading({})).toBeFalsy();
        });

        it('should set loading', () => {
            const state = {};

            setLoading(state, true);
            expect(isLoading(state)).toBeTruthy();

            setLoading(state, false);
            expect(isLoading(state)).toBeFalsy();
        });

        it('should see "false" string as truthy', () => {
            const state = {};
            setLoading(state, 'false');
            expect(isLoading(state)).toBeTruthy();
        });

        it('should set false for null', () => {
            const state = {};
            setLoading(state, null);
            expect(isLoading(state)).toBeFalsy();
        });
    });

    describe('handleLoadMoreCheck', () => {
        function getMockEvent() {
            const mockEvent = {
                target: {
                    offsetParent: {},
                    scrollTop: 500,
                    clientHeight: 496,
                    firstChild: {
                        scrollHeight: 1000,
                    },
                },
            };
            mockEvent.target.firstChild.parentNode = mockEvent.target;
            return mockEvent;
        }

        it('should dispatch loadmore event when threshold is reached', () => {
            const state = {};
            setLoadMoreOffset(state, 5);
            setLoading(state, false);

            const dispatchEvent = jest.fn(event => {
                expect(event.type).toBe('loadmore');
            });
            handleLoadMoreCheck.call({ state, dispatchEvent }, getMockEvent());
            expect(dispatchEvent).toHaveBeenCalledTimes(1);
        });

        it('should not dispatch loadmore event when it is still loading', () => {
            const state = {};
            setLoadMoreOffset(state, 5);
            setLoading(state, true);

            const dispatchEvent = jest.fn();
            handleLoadMoreCheck.call({ state, dispatchEvent }, getMockEvent());
            expect(dispatchEvent).not.toBeCalled();
        });

        it('should not dispatch loadmore event when threshold is not reached', () => {
            const state = {};
            setLoadMoreOffset(state, 0);
            setLoading(state, false);

            const dispatchEvent = jest.fn();
            handleLoadMoreCheck.call({ state, dispatchEvent }, getMockEvent());
            expect(dispatchEvent).not.toBeCalled();
        });
    });

    describe('handlePrefetch', () => {
        it('should not dispatch loadmore event when it is still loading', () => {
            const state = {
                enableInfiniteLoading: true,
            };
            setLoading(state, true);

            const dispatchEvent = jest.fn(event => {
                expect(event.type).toBe('loadmore');
            });
            const dtMock = {};
            handlePrefetch.call({ state, dispatchEvent }, dtMock, state);
            expect(dispatchEvent).not.toBeCalled();
        });

        it('should not dispatch loadmore event there is no data set yet', () => {
            const state = {
                enableInfiniteLoading: true,
            };
            setLoading(state, false);

            const dispatchEvent = jest.fn(event => {
                expect(event.type).toBe('loadmore');
            });
            const dtMock = {
                querySelectorAll: () => {
                    return [];
                },
            };
            handlePrefetch.call({ state, dispatchEvent }, dtMock, state);
            expect(dispatchEvent).not.toBeCalled();
        });

        it('should dispatch loadmore event when the table doesnt have enough data to fill the container', () => {
            const state = {
                enableInfiniteLoading: true,
            };
            setLoading(state, false);

            const dispatchEvent = jest.fn(event => {
                expect(event.type).toBe('loadmore');
            });
            const container = {
                offsetParent: {},
                scrollHeight: 300,
                clientHeight: 400,
            };
            const dtMock = {
                querySelectorAll: () => {
                    return [1, 2, 3];
                },
                querySelector: () => {
                    return container;
                },
            };
            handlePrefetch.call({ state, dispatchEvent }, dtMock, state);
            expect(dispatchEvent).toHaveBeenCalledTimes(1);
        });
        it('should not dispatch loadmore event when the table has enough data to cause scrolling', () => {
            const state = {
                data: ['a', 'b'],
                enableInfiniteLoading: true,
            };
            setLoading(state, false);

            const dispatchEvent = jest.fn(event => {
                expect(event.type).toBe('loadmore');
            });
            const container = {
                scrollHeight: 400,
                clientHeight: 300,
            };
            const dtMock = {
                querySelectorAll: () => {
                    return [1, 2, 3];
                },
                querySelector: () => {
                    return container;
                },
            };
            handlePrefetch.call({ state, dispatchEvent }, dtMock, state);
            expect(dispatchEvent).not.toBeCalled();
        });
    });
});
