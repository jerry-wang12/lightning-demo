import {
    getDefaultState,
    getActions,
    handleTriggeredAction,
} from '../wrapText';

describe('datatable wrap-text-actions', () => {
    describe('getActions', () => {
        it('should not return actions for all types', () => {
            const state = getDefaultState();
            const columnDefinfition = {
                colKeyValue: 'text-name-1',
                type: 'actions',
            };

            const actions = getActions(state, columnDefinfition);

            expect(actions).toHaveLength(0);
        });

        it('should return wrap and clip text actions', () => {
            const state = getDefaultState();
            const columnDefinfition = {
                colKeyValue: 'text-name-1',
                type: 'text',
            };

            const actions = getActions(state, columnDefinfition);

            expect(state.wrapText['text-name-1']).toBe(false);
            expect(actions).toHaveLength(2);
            expect(actions[0].label).toBe('Wrap text');
            expect(actions[1].label).toBe('Clip text');

            expect(actions[0].checked).toBe(false);
            expect(actions[1].checked).toBe(true);

            expect(actions[0].name).toBe('wrap_text');
            expect(actions[1].name).toBe('clip_text');
        });

        it('should use previous saved state', () => {
            const state = getDefaultState();
            const columnDefinfition = {
                colKeyValue: 'text-name-1',
                type: 'text',
            };
            state.wrapText['text-name-1'] = true;

            const actions = getActions(state, columnDefinfition);

            expect(actions[0].label).toBe('Wrap text');
            expect(actions[1].label).toBe('Clip text');

            expect(actions[0].checked).toBe(true);
            expect(actions[1].checked).toBe(false);

            expect(actions[0].name).toBe('wrap_text');
            expect(actions[1].name).toBe('clip_text');
        });
    });

    describe('handleTriggeredAction', () => {
        const defaultState = Object.assign({}, getDefaultState(), {
            headerIndexes: { 'text-name-1': 0 },
            rows: [
                {
                    cells: [
                        {
                            wrapText: false,
                        },
                    ],
                },
            ],
        });

        it('should change wrapper text', () => {
            const state = Object.assign({}, defaultState);
            const columnDefinfition = {
                colKeyValue: 'text-name-1',
                type: 'text',
            };

            let actions = getActions(state, columnDefinfition);
            state.columns = [{ actions: { internalActions: actions } }];

            handleTriggeredAction(state, actions[0], 'text-name-1');

            expect(state.wrapText['text-name-1']).toBe(true);

            actions = state.columns[0].actions.internalActions;

            expect(actions[0].checked).toBe(true);
            expect(actions[1].checked).toBe(false);

            expect(state.rows[0].cells[0].wrapText).toBe(true);
        });

        it('should change wrapper text on clip text', () => {
            const state = Object.assign({}, defaultState);
            const columnDefinfition = {
                colKeyValue: 'text-name-1',
                type: 'text',
            };
            state.wrapText['text-name-1'] = true;

            let actions = getActions(state, columnDefinfition);
            state.columns = [{ actions: { internalActions: actions } }];

            handleTriggeredAction(state, actions[1], 'text-name-1');

            expect(state.wrapText['text-name-1']).toBe(false);

            actions = state.columns[0].actions.internalActions;

            expect(actions[0].checked).toBe(false);
            expect(actions[1].checked).toBe(true);

            expect(state.rows[0].cells[0].wrapText).toBe(false);
        });
    });
});
