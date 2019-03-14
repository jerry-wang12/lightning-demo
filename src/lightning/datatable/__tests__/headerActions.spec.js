import {
    updateHeaderActions,
    handleHeaderActionTriggered,
} from './../headerActions';

describe('datatable header-actions', () => {
    describe('updateHeaderActions when columns change', () => {
        const state = {
            columns: [
                {
                    colKeyValue: 'text-name-0',
                    actions: [{ label: 'label1' }, { label: 'label2' }],
                },
                { colKeyValue: 'text-lastname-1' },
            ],
            wrapText: {},
        };

        it('should set the the _actions in the column state', () => {
            const testState = JSON.parse(JSON.stringify(state));
            updateHeaderActions(testState);

            expect(testState.columns[0].actions).toBeTruthy();
            expect(testState.columns[1].actions).toBeTruthy();

            expect(
                JSON.stringify(testState.columns[0].actions.customerActions)
            ).toBe(JSON.stringify(state.columns[0].actions));
        });
    });

    describe('handleHeaderActionTriggered', () => {
        it('should trigger a headeraction event', () => {
            const col1 = {
                colKeyValue: 'text-name-0',
                actions: [{ label: 'label1' }, { label: 'label2' }],
            };
            const col2 = { colKeyValue: 'text-lastname-1' };
            const columnDef = [
                Object.assign({}, col1),
                Object.assign({}, col2),
            ];
            const state = {
                headerIndexes: {
                    'text-name-0': 0,
                    'text-lastname-1': 1,
                },
                columns: [Object.assign({}, col1), Object.assign({}, col2)],
            };
            const dtMock = {
                columns: columnDef,
                state,
                dispatchEvent: jest.fn(),
            };
            const action = { label: 'some stub action' };
            const evtMock = {
                stopPropagation: jest.fn(),
                detail: {
                    actionType: 'customer',
                    colKeyValue: 'text-name-0',
                    action,
                },
            };

            handleHeaderActionTriggered.call(dtMock, evtMock);

            expect(dtMock.dispatchEvent.mock.calls).toHaveLength(1);
            expect(evtMock.stopPropagation.mock.calls).toHaveLength(1);

            const triggeredEvent = dtMock.dispatchEvent.mock.calls[0][0];

            expect(triggeredEvent.detail.action).toBe(action);
            expect(triggeredEvent.detail.columnDefinition).toBe(columnDef[0]);
        });
    });
});
