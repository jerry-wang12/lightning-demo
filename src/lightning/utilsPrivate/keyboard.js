export const keyCodes = {
    tab: 9,
    backspace: 8,
    enter: 13,
    escape: 27,
    space: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 46,
    shift: 16,
};

const buffer = {};

/**
 * Runs an action and passes the string of buffered keys typed within a short time period.
 * Use for type-ahead like functionality in menus, lists, comboboxes, and similar components.
 *
 * @param {CustomEvent} event A keyboard event
 * @param {Function} action function to run, it's passed the buffered text
 */
export function runActionOnBufferedTypedCharacters(event, action) {
    // If we were going to clear what keys were typed, don't yet.
    if (buffer._clearBufferId) {
        clearTimeout(buffer._clearBufferId);
    }

    // Store the letter.
    const letter = String.fromCharCode(event.keyCode);
    buffer._keyBuffer = buffer._keyBuffer || [];
    buffer._keyBuffer.push(letter);

    const matchText = buffer._keyBuffer.join('').toLowerCase();

    action(matchText);

    // eslint-disable-next-line lwc/no-set-timeout
    buffer._clearBufferId = setTimeout(() => {
        buffer._keyBuffer = [];
    }, 700);
}
