import { interaction } from 'aura-instrumentation';

/**
 * Requests a log entry for tracking user interactions.
 * @param {String} ailtnEventSource - The synthetic event source for the interaction.
 * @param {String} ailtnScope - The component that handles the action. Effectively it's an ancestor of the target component.
 * @param {String} ailtnTarget - The component that handles the event.
 * @param {Object} ailtnContext - The composite of the context from the target and scope. This needs to be a flat map.
 */
export function log(ailtnEventSource, ailtnScope, ailtnTarget, ailtnContext) {
    if (!ailtnEventSource || !ailtnScope || !ailtnTarget) {
        return;
    }
    const _ailtnContext = ailtnContext || {};
    _ailtnContext.sourceCmp = 'lightning:lookup-desktop';
    _ailtnContext.time = Date.now();

    interaction(ailtnTarget, ailtnScope, _ailtnContext, ailtnEventSource);
}
