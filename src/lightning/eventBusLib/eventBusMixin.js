import {
    addGlobalEventListener,
    removeGlobalEventListener,
    dispatchGlobalEvent,
} from './eventBus';

const DispatchGlobalEvent = Symbol('dispatchGlobalEvent');
const AddGlobalEventListener = Symbol('addGlobalEventListener');
const RemoveGlobalEventListener = Symbol('removeGlobalEventListener');
const AddEventListenerHistory = Symbol('addEventListenerHistory');

const EventBusMixin = base => {
    return class extends base {
        [DispatchGlobalEvent](name, payload) {
            dispatchGlobalEvent(name, payload);
        }

        [AddGlobalEventListener](name, listener) {
            addGlobalEventListener(name, listener);
            if (!this[AddEventListenerHistory]) {
                this[AddEventListenerHistory] = [];
            }
            this[AddEventListenerHistory].push({ name, listener });
        }

        [RemoveGlobalEventListener](name, listener) {
            removeGlobalEventListener(name, listener);
        }

        disconnectedCallback() {
            if (super.disconnectedCallback) {
                super.disconnectedCallback();
            }

            let historyItem;
            let i =
                this[AddEventListenerHistory] !== undefined
                    ? this[AddEventListenerHistory].length
                    : 0;
            while (i-- > 0) {
                historyItem = this[AddEventListenerHistory].pop();
                removeGlobalEventListener(
                    historyItem.name,
                    historyItem.listener
                );
            }
        }
    };
};

EventBusMixin.DispatchGlobalEvent = DispatchGlobalEvent;
EventBusMixin.AddGlobalEventListener = AddGlobalEventListener;
EventBusMixin.RemoveGlobalEventListener = RemoveGlobalEventListener;

export { EventBusMixin };
