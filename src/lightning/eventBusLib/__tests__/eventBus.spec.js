jest.mock(
    'logger',
    () => {
        return {
            logError: jest.fn(),
        };
    },
    { virtual: true }
);

jest.mock('../../utilsPrivate/eventEmitter');
jest.mock('../windowMessengerGlobal');

import {
    addGlobalEventListener,
    removeGlobalEventListener,
    dispatchGlobalEvent,
    connectMessengerToBus,
} from '../eventBus';
import { logError } from 'logger';
import { EventEmitter } from 'lightning/utilsPrivate';
import { WindowMessengerGlobal } from '../windowMessengerGlobal';

describe('eventBusLib APIs', () => {
    describe('addGlobalEventListener()', () => {
        it('call EventEmitter.on() with correct arguments', () => {
            addGlobalEventListener('test-event-name', 'test-listener');

            const mockEventEmitterInstance = EventEmitter.mock.instances[0];
            const mockOn = mockEventEmitterInstance.on;

            expect(mockOn).toHaveBeenCalledWith(
                'test-event-name',
                'test-listener'
            );
            expect(mockOn).toHaveBeenCalledTimes(1);
            expect.assertions(2);
        });
    });

    describe('removeGlobalEventListener API', () => {
        it('call EventEmitter.removeListener() with correct arguments', () => {
            removeGlobalEventListener('test-event-name', 'test-listener');

            const mockEventEmitterInstance = EventEmitter.mock.instances[0];
            const mockRemoveListener = mockEventEmitterInstance.removeListener;

            expect(mockRemoveListener).toHaveBeenCalledWith(
                'test-event-name',
                'test-listener'
            );
            expect(mockRemoveListener).toHaveBeenCalledTimes(1);
            expect.assertions(2);
        });
    });

    describe('dispatchGlobalEvent()', () => {
        beforeEach(() => {
            EventEmitter.mock.instances[0].emit.mockClear();
            WindowMessengerGlobal.mock.instances[0].sendGlobalBusEvent.mockClear();
        });

        it('calls EventEmitter.emit() with correct arguments', () => {
            dispatchGlobalEvent('test-event-name', 'payload-data');

            const mockEventEmitterInstance = EventEmitter.mock.instances[0];
            const mockEmit = mockEventEmitterInstance.emit;

            expect(mockEmit).toHaveBeenCalledWith(
                'test-event-name',
                'payload-data'
            );
            expect(mockEmit).toHaveBeenCalledTimes(1);
            expect.assertions(2);
        });

        it('log an error when called with a non-string payload argument', () => {
            dispatchGlobalEvent('test-event-name', { test: '123' });
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenCalledWith(
                '[globalEventBus]: dispatchGlobalEvent API supports only string datatype for payload param.'
            );
            expect.assertions(2);
        });

        it('call WindowMessengerGlobalInstance.sendGlobalBusEvent() with valid arguments', () => {
            dispatchGlobalEvent('test-event-name', 'payload-data');

            const mockWindowMessengerGlobalInstance =
                WindowMessengerGlobal.mock.instances[0];
            const mockSendGlobalBusEvent =
                mockWindowMessengerGlobalInstance.sendGlobalBusEvent;

            expect(mockSendGlobalBusEvent).toHaveBeenCalledWith(
                'test-event-name',
                'payload-data',
                undefined
            );
            expect(mockSendGlobalBusEvent).toHaveBeenCalledTimes(1);
            expect.assertions(2);
        });
    });

    describe('connectMessengerToBus()', () => {
        it('call WindowMessengerGlobal.connect() with the correct arguments', () => {
            connectMessengerToBus('test-window-messenger');
            const mockWindowMessengerGlobalInstance =
                WindowMessengerGlobal.mock.instances[0];
            const mockConnect = mockWindowMessengerGlobalInstance.connect;
            expect(mockConnect).toHaveBeenCalledWith('test-window-messenger');
            expect(mockConnect).toHaveBeenCalledTimes(1);
            expect.assertions(2);
        });
    });
});
