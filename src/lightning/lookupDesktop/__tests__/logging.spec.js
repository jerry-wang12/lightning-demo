import { log } from '../logging.js';
import {
    LOG_EVENT_CLICK,
    LOG_SCOPE_INPUT_LOOKUP_DESKTOP,
    LOG_TARGET_MRU_ITEM,
} from '../constants.js';

jest.mock(
    'aura-instrumentation',
    () => {
        return {
            interaction: jest.fn(),
        };
    },
    { virtual: true }
);

import { interaction } from 'aura-instrumentation';

describe('lookup-desktop:logging', () => {
    const ailtnEventSource = LOG_EVENT_CLICK;
    const ailtnScope = LOG_SCOPE_INPUT_LOOKUP_DESKTOP;
    const ailtnTarget = LOG_TARGET_MRU_ITEM;
    let ailtnContext;
    let expected;
    let actual;

    interaction.mockImplementation((target, scope, context, eventSource) => {
        context.time = !!context.time;
        actual = {
            eventSource,
            scope,
            target,
            context,
        };
    });

    beforeEach(() => {
        ailtnContext = {};
        actual = null;
        expected = null;
    });

    it('Calls aura-instrumentation method', () => {
        ailtnContext = { key: 'value' };
        log(ailtnEventSource, ailtnScope, ailtnTarget, ailtnContext);
        expect(interaction.mock.calls).toHaveLength(1);
    });

    it('Handles empty configs', () => {
        const tests = [
            {
                params: [undefined, undefined, undefined, undefined],
                expected: null,
            },
            {
                params: [null, null, null, null],
                expected: null,
            },
            {
                params: [null, ailtnScope, ailtnTarget, ailtnContext],
                expected: null,
            },
            {
                params: [ailtnEventSource, null, ailtnTarget, ailtnContext],
                expected: null,
            },
            {
                params: [ailtnEventSource, ailtnScope, null, ailtnContext],
                expected: null,
            },
            {
                params: [ailtnEventSource, ailtnScope, ailtnTarget, null],
                expected: {
                    eventSource: LOG_EVENT_CLICK,
                    scope: LOG_SCOPE_INPUT_LOOKUP_DESKTOP,
                    target: LOG_TARGET_MRU_ITEM,
                    context: {
                        sourceCmp: 'lightning:lookup-desktop',
                        time: true,
                    },
                },
            },
        ];

        tests.forEach(test => {
            actual = null;
            log(test.params[0], test.params[1], test.params[2], test.params[3]);
            expect(test.expected).toEqual(actual);
        });
    });

    it('Logs interaction', () => {
        ailtnContext = {
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
        };

        expected = {
            eventSource: LOG_EVENT_CLICK,
            scope: LOG_SCOPE_INPUT_LOOKUP_DESKTOP,
            target: LOG_TARGET_MRU_ITEM,
            context: {
                key1: 'value1',
                key2: 'value2',
                key3: 'value3',
                sourceCmp: 'lightning:lookup-desktop',
                time: true,
            },
        };

        log(ailtnEventSource, ailtnScope, ailtnTarget, ailtnContext);
        expect(expected).toEqual(actual);
    });
});
