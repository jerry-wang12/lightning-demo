const DISPATCH_EVENT_MESSAGE_TYPE = 'dispatch_global_bus_event_message';

/**
 * This class is used to tie together the "global" event buses which live in different windows.
 * When an event is dispatched on the "global" bus of one window, this class sends the event
 * to the other windows to be dispatched on the "global" buses of the other window.
 **/
export class WindowMessengerGlobal {
    constructor(globalEventBus) {
        this.globalEventBus = globalEventBus;
        this.registeredMessengers = new Map();
    }

    /**
     * Relays the event to the other WindowManagers to be dispatched on the global buses
     * of the other windows.
     *
     * @param {String} eventName - Name of event being dispatched.
     * @param {Object} payload - Payload associated with the global event.
     * @param {String} windowMessengerId - Optional id of the window messenger that triggered this method being call.
     */
    sendGlobalBusEvent(eventName, payload, windowMessengerId) {
        for (const windowMessenger of this.registeredMessengers.keys()) {
            // Send to all known windowMessengers except the one that received the dispatch message we are responding to.
            if (
                typeof windowMessengerId === 'undefined' ||
                windowMessengerId !== windowMessenger.getId()
            ) {
                windowMessenger.sendMessage(
                    DISPATCH_EVENT_MESSAGE_TYPE,
                    JSON.stringify({
                        eventName,
                        payload,
                    })
                );
            }
        }
    }

    /**
     * Register the provided windowMessenger.  Allowing dispatched events to be relayed to
     * all connected messengers.
     *
     * A windowMessenger may only be connected once, and subsequent connection attempts will be a no-op
     *
     * @param {windowMessenger} windowMessenger - windowMessenger to register for global events
     */
    connect(windowMessenger) {
        if (!windowMessenger) {
            throw new Error('Must provide a WindowMessenger');
        }

        if (!this.registeredMessengers.has(windowMessenger)) {
            // Add a shutdown handler so that all listeners/handlers no longer talk to
            // the shutdown messenger.
            windowMessenger.addOnShutdown(() => {
                this._unregister(windowMessenger);
            });

            const dispatchGlobalEvent = (
                eventName,
                payload,
                windowMessengerId
            ) => {
                this.globalEventBus.dispatchGlobalEvent(
                    eventName,
                    payload,
                    windowMessengerId
                );
            };

            this.registeredMessengers.set(windowMessenger, {
                dispatchGlobalEvent,
            });

            this._addDispatchEventHandler(windowMessenger);
        }
    }

    /**
     * Remove the windowMessenger from window-messenger-global so that
     * no more messages will be sent to the disconnected WindowMessenger.
     *
     * @param {WindowMessenger} windowMessenger - WindowMessenger to disconnect
     */
    _unregister(windowMessenger) {
        if (this.registeredMessengers.has(windowMessenger)) {
            this.registeredMessengers.delete(windowMessenger);
        }
    }

    /**
     * Add a messageHandler to the specified windowMessenger
     * to handle dispatching of global events.
     *
     * @param {WindowMessenger} windowMessenger - WindowMessenger to register handler with
     */
    _addDispatchEventHandler(windowMessenger) {
        windowMessenger.addMessageHandler(
            DISPATCH_EVENT_MESSAGE_TYPE,
            message => {
                const parsedMessage = JSON.parse(message);
                const { dispatchGlobalEvent } = this.registeredMessengers.get(
                    windowMessenger
                );

                if (dispatchGlobalEvent) {
                    dispatchGlobalEvent(
                        parsedMessage.eventName,
                        parsedMessage.payload,
                        windowMessenger.getId()
                    );
                }
            }
        );
    }
}
