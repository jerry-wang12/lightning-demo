export { assert } from './assert';
export { EventEmitter } from './eventEmitter';
export { toNorthAmericanPhoneNumber } from './phonify';
export * from './linkUtils';
export { deepCopy, arraysEqual } from './utility';
export { guid } from './guid';
export { classListMutation } from './classListMutation';
export {
  normalizeBoolean,
  normalizeString,
  normalizeArray,
  normalizeAriaAttribute
} from './normalize';
export { keyCodes, runActionOnBufferedTypedCharacters } from './keyboard';
export { raf } from './scroll';
export { isChrome, isIE11 } from './browser';
export { ContentMutation } from './contentMutation';
export { observePosition } from './observers';
import { smartSetAttribute } from './smartSetAttribute';

/**
 * @param {HTMLElement} element Element to act on
 * @param {Object} values values and attributes to set, if the value is
 *                        falsy it the attribute will be removed
 */
export function synchronizeAttrs(element, values) {
  if (!element) {
    return;
  }
  const attributes = Object.keys(values);
  attributes.forEach(attribute => {
    smartSetAttribute(element, attribute, values[attribute]);
  });
}

/**
 * Get the actual DOM id for an element
 * @param {HTMLElement|String} el The element to get the id for (string will just be returned)
 *
 * @returns {String} The DOM id or null
 */
export function getRealDOMId(el) {
  if (el && typeof el === 'string') {
    return el;
  } else if (el) {
    return el.getAttribute('id');
  }
  return null;
}
