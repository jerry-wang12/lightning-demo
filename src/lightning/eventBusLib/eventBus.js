import { EventEmitter } from 'lightning/utilsPrivate';
import { WindowMessengerGlobal } from './windowMessengerGlobal';
import { logError } from 'logger';

const eventBus = new EventEmitter();
const windowMessengerGlobal = new WindowMessengerGlobal({
    dispatchGlobalEvent: internalDispatchGlobalEvent,
});

/**
 * Registers a window messenger with the global event bus.  When events are emitted
 * they will be relayed to registered window messengers.
 *
 * @param {WindowMessenger} windowMessenger - WindowMessenger to register for global events
 */
export function connectMessengerToBus(windowMessenger) {
    windowMessengerGlobal.connect(windowMessenger);
}

/**
 * Registers a listener which will be invoked when the event is dispatched.
 *
 * @param {String} eventName - The name of the event
 * @param {Function} listener - The callback function
 */
export function addGlobalEventListener(eventName, listener) {
    eventBus.on(eventName, listener);
}

/**
 * Removes the listener so that it will no longer be invoked when the
 * event is dispatched.
 *
 * @param {String} eventName - The name of the event
 * @param {Function} listener - The callback function
 */
export function removeGlobalEventListener(eventName, listener) {
    eventBus.removeListener(eventName, listener);
}

/**
 * Call all listeners which are registered for the given event type.  Then send the
 * event to all windows to have it dispatched on the global event bus of each window.
 *
 * @param {String} eventName - Name of event being dispatched.
 * @param {String} payload - Payload associated with the global event.
 */
export function dispatchGlobalEvent(eventName, payload) {
    if (typeof payload === 'string') {
        internalDispatchGlobalEvent(eventName, payload);
    } else {
        logError(
            '[globalEventBus]: dispatchGlobalEvent API supports only string datatype for payload param.'
        );
    }
}

/**
 * Not exported, while providing a means for windowMessengerGlobal to dispatch events and include
 * the window messenger ID that triggered dispatching.  Avoiding a loop where we dispatch to the
 * originating window messenger.
 * @param {String} eventName - Name of event being dispatched.
 * @param {String} payload - Payload associated with the global event.
 * @param {String} windowMessengerId - Optional id of the window messenger that triggered this method being call.
 */
function internalDispatchGlobalEvent(eventName, payload, windowMessengerId) {
    eventBus.emit(eventName, payload);
    windowMessengerGlobal.sendGlobalBusEvent(
        eventName,
        payload,
        windowMessengerId
    );
}
