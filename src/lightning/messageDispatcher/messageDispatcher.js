// Closure to hold the APIs if and when available
let DispatcherCount = 1;
const Dispatchers = {};

function generateDispatchId() {
    return `lightningIframeMessage-${DispatcherCount++}`;
}

export function registerMessageHandler(handler) {
    const dispatchId = generateDispatchId();
    Dispatchers[dispatchId] = handler;

    return dispatchId;
}
export function unregisterMessageHandler(dispatchId) {
    delete Dispatchers[dispatchId];
}

export function dispatchEvent(event) {
    try {
        const data = event.data ? JSON.parse(event.data) : {};
        const dispatchId = data.arguments ? data.arguments.cmpId : null;
        if (dispatchId && Dispatchers[dispatchId]) {
            Dispatchers[dispatchId](data);
            return true;
        }
    } catch (e) {
        // Catch JSON parse exception.
    }
    return false;
}

export function createMessage(dispatcherId, event, params) {
    params.cmpId = dispatcherId;
    return {
        event,
        arguments: params,
    };
}

export function postMessage(handler, message, domain, useObject) {
    if (handler) {
        handler(useObject ? message : JSON.stringify(message || {}), domain);
    }
}
