import {
    handleLoadDynamicActions,
    handleRowActionTriggered,
} from '../rowLevelActions';

const state = {
    indexes: {
        'row-0': {
            'col-0': [0, 0],
        },
        'row-1': {
            'col-0': [1, 0],
        },
        'row-2': {
            'col-0': [0, 0], // the row here its modified intentionally.
        },
    },
    data: [
        { name: 'name-0', desc: 'desc-0' },
        { name: 'name-1', desc: 'desc-1' },
        { name: 'name-2', desc: 'desc-2' },
    ],
};

function getDtMock(overrides) {
    const dt = {
        state,
        getViewableRect: jest
            .fn()
            .mockReturnValue({ left: 0, bottom: 10, right: 10, top: 0 }),
    };
    return Object.assign({}, dt, overrides);
}

describe('row level actions', () => {
    describe('handleRowActionTriggered', () => {
        it('should trigger a rowaction event', () => {
            const dtMock = getDtMock({ dispatchEvent: jest.fn() });
            const action = { label: 'some stub action' };
            const evtMock = {
                stopPropagation: jest.fn(),
                detail: {
                    rowKeyValue: 'row-1',
                    colKeyValue: 'col-0',
                    action,
                },
            };

            handleRowActionTriggered.call(dtMock, evtMock);

            expect(dtMock.dispatchEvent.mock.calls).toHaveLength(1);
            expect(evtMock.stopPropagation.mock.calls).toHaveLength(1);

            const triggeredEvent = dtMock.dispatchEvent.mock.calls[0][0];

            expect(triggeredEvent.detail.row).toBe(state.data[1]);
            expect(triggeredEvent.detail.action).toBe(action);
        });
    });

    describe('handleLoadDynamicActions', () => {
        it('should call the actionsProviderFunction', () => {
            const dtMock = getDtMock({});
            const actionsProviderFunction = jest.fn();
            const saveContainerPosition = jest.fn();
            const doneCallback = 'mock-function-value';
            const evtMock = {
                stopPropagation: jest.fn(),
                detail: {
                    rowKeyValue: 'row-1',
                    colKeyValue: 'col-0',
                    actionsProviderFunction,
                    doneCallback,
                    saveContainerPosition,
                },
            };

            handleLoadDynamicActions.call(dtMock, evtMock);

            expect(actionsProviderFunction.mock.calls).toHaveLength(1);
            expect(evtMock.stopPropagation.mock.calls).toHaveLength(1);

            expect(actionsProviderFunction.mock.calls[0][0]).toBe(
                state.data[1]
            );
            expect(actionsProviderFunction.mock.calls[0][1]).toBe(doneCallback);

            expect(saveContainerPosition.mock.calls).toHaveLength(1);
        });
    });
});
