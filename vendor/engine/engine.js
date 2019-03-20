/* proxy-compat-disable */
typeof process === 'undefined' && (process = { env: { NODE_ENV: 'dev' } });
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Engine = {})));
}(this, (function (exports) { 'use strict';

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const { freeze, seal, keys, create, assign, defineProperty, getPrototypeOf, setPrototypeOf, getOwnPropertyDescriptor, getOwnPropertyNames, defineProperties, getOwnPropertySymbols, hasOwnProperty, preventExtensions, isExtensible, } = Object;
    const { isArray } = Array;
    const { concat: ArrayConcat, filter: ArrayFilter, slice: ArraySlice, splice: ArraySplice, unshift: ArrayUnshift, indexOf: ArrayIndexOf, push: ArrayPush, map: ArrayMap, join: ArrayJoin, forEach, reduce: ArrayReduce, reverse: ArrayReverse, } = Array.prototype;
    const { replace: StringReplace, toLowerCase: StringToLowerCase, indexOf: StringIndexOf, charCodeAt: StringCharCodeAt, slice: StringSlice, split: StringSplit, } = String.prototype;
    function isUndefined(obj) {
        return obj === undefined;
    }
    function isNull(obj) {
        return obj === null;
    }
    function isTrue(obj) {
        return obj === true;
    }
    function isFalse(obj) {
        return obj === false;
    }
    function isFunction(obj) {
        return typeof obj === 'function';
    }
    function isObject(obj) {
        return typeof obj === 'object';
    }
    function isString(obj) {
        return typeof obj === 'string';
    }
    function isNumber(obj) {
        return typeof obj === 'number';
    }
    const OtS = {}.toString;
    function toString(obj) {
        if (obj && obj.toString) {
            return obj.toString();
        }
        else if (typeof obj === 'object') {
            return OtS.call(obj);
        }
        else {
            return obj + '';
        }
    }
    function getPropertyDescriptor(o, p) {
        do {
            const d = getOwnPropertyDescriptor(o, p);
            if (!isUndefined(d)) {
                return d;
            }
            o = getPrototypeOf(o);
        } while (o !== null);
    }
    const emptyString = '';

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const { hasAttribute, getAttribute, getAttributeNS, setAttribute, setAttributeNS, removeAttribute, removeAttributeNS, querySelector, querySelectorAll, getBoundingClientRect, getElementsByTagName, getElementsByClassName, getElementsByTagNameNS, } = Element.prototype;
    let { addEventListener, removeEventListener, } = Element.prototype;
    /**
     * This trick to try to pick up the __lwcOriginal__ out of the intrinsic is to please
     * jsdom, who usually reuse intrinsic between different document.
     */
    // @ts-ignore jsdom
    addEventListener = addEventListener.__lwcOriginal__ || addEventListener;
    // @ts-ignore jsdom
    removeEventListener = removeEventListener.__lwcOriginal__ || removeEventListener;
    const innerHTMLSetter = hasOwnProperty.call(Element.prototype, 'innerHTML') ?
        getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set :
        getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML').set; // IE11
    const tagNameGetter = getOwnPropertyDescriptor(Element.prototype, 'tagName').get;
    const tabIndexGetter = getOwnPropertyDescriptor(HTMLElement.prototype, 'tabIndex').get;
    const matches = hasOwnProperty.call(Element.prototype, 'matches') ?
        Element.prototype.matches :
        Element.prototype.msMatchesSelector; // IE11
    const childrenGetter = hasOwnProperty.call(Element.prototype, 'children') ?
        getOwnPropertyDescriptor(Element.prototype, 'children').get :
        getOwnPropertyDescriptor(HTMLElement.prototype, 'children').get; // IE11

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const { DOCUMENT_POSITION_CONTAINED_BY, DOCUMENT_POSITION_CONTAINS, DOCUMENT_POSITION_PRECEDING, DOCUMENT_POSITION_FOLLOWING, DOCUMENT_FRAGMENT_NODE, } = Node;
    const { insertBefore, removeChild, appendChild, hasChildNodes, replaceChild, compareDocumentPosition, cloneNode, } = Node.prototype;
    const parentNodeGetter = getOwnPropertyDescriptor(Node.prototype, 'parentNode').get;
    const parentElementGetter = hasOwnProperty.call(Node.prototype, 'parentElement') ?
        getOwnPropertyDescriptor(Node.prototype, 'parentElement').get :
        getOwnPropertyDescriptor(HTMLElement.prototype, 'parentElement').get; // IE11
    const textContextSetter = getOwnPropertyDescriptor(Node.prototype, 'textContent').set;
    const childNodesGetter = hasOwnProperty.call(Node.prototype, 'childNodes') ?
        getOwnPropertyDescriptor(Node.prototype, 'childNodes').get :
        getOwnPropertyDescriptor(HTMLElement.prototype, 'childNodes').get; // IE11
    const nodeValueDescriptor = getOwnPropertyDescriptor(Node.prototype, 'nodeValue');
    const nodeValueSetter = nodeValueDescriptor.set;
    const nodeValueGetter = nodeValueDescriptor.get;

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const ShadowRootHostGetter = typeof window.ShadowRoot !== "undefined" ?
        getOwnPropertyDescriptor(window.ShadowRoot.prototype, 'host').get :
        () => {
            throw new Error('Internal Error: Missing ShadowRoot');
        };
    const ShadowRootInnerHTMLSetter = typeof window.ShadowRoot !== "undefined" ? getOwnPropertyDescriptor(window.ShadowRoot.prototype, 'innerHTML').set : () => {
        throw new Error('Internal Error: Missing ShadowRoot');
    };
    const dispatchEvent = 'EventTarget' in window ?
        EventTarget.prototype.dispatchEvent :
        Node.prototype.dispatchEvent; // IE11
    const isNativeShadowRootAvailable = typeof window.ShadowRoot !== "undefined";
    const iFrameContentWindowGetter = getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
    const eventTargetGetter = getOwnPropertyDescriptor(Event.prototype, 'target').get;
    const eventCurrentTargetGetter = getOwnPropertyDescriptor(Event.prototype, 'currentTarget').get;
    const focusEventRelatedTargetGetter = getOwnPropertyDescriptor(FocusEvent.prototype, 'relatedTarget').get;

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const StringSplit$1 = String.prototype.split;
    function isLWC(element) {
        return (element instanceof Element) && (tagNameGetter.call(element).indexOf('-') !== -1);
    }
    function isShadowRoot(elmOrShadow) {
        return !(elmOrShadow instanceof Element) && ('host' in elmOrShadow);
    }
    function getFormattedComponentStack(elm) {
        const componentStack = [];
        const indentationChar = '\t';
        let indentation = '';
        let currentElement = elm;
        do {
            if (isLWC(currentElement)) {
                ArrayPush.call(componentStack, `${indentation}<${StringToLowerCase.call(tagNameGetter.call(currentElement))}>`);
                indentation = indentation + indentationChar;
            }
            if (isShadowRoot(currentElement)) {
                // if at some point we find a ShadowRoot, it must be a native shadow root.
                currentElement = ShadowRootHostGetter.call(currentElement);
            }
            else {
                currentElement = parentNodeGetter.call(currentElement);
            }
        } while (!isNull(currentElement));
        return ArrayJoin.call(componentStack, '\n');
    }
    const assert = {
        invariant(value, msg) {
            if (!value) {
                throw new Error(`Invariant Violation: ${msg}`);
            }
        },
        isTrue(value, msg) {
            if (!value) {
                throw new Error(`Assert Violation: ${msg}`);
            }
        },
        isFalse(value, msg) {
            if (value) {
                throw new Error(`Assert Violation: ${msg}`);
            }
        },
        fail(msg) {
            throw new Error(msg);
        },
        logError(message, elm) {
            let msg = `[LWC error]: ${message}`;
            if (elm) {
                msg = `${msg}\n${getFormattedComponentStack(elm)}`;
            }
            if (process.env.NODE_ENV === 'test') {
                console.error(msg); // tslint:disable-line
                return;
            }
            try {
                throw new Error(msg);
            }
            catch (e) {
                console.error(e); // tslint:disable-line
            }
        },
        logWarning(message, elm) {
            let msg = `[LWC warning]: ${message}`;
            if (elm) {
                msg = `${msg}\n${getFormattedComponentStack(elm)}`;
            }
            if (process.env.NODE_ENV === 'test') {
                console.warn(msg); // tslint:disable-line
                return;
            }
            try {
                throw new Error('error to get stacktrace');
            }
            catch (e) {
                // first line is the dummy message and second this function (which does not need to be there)
                const stackTraceLines = StringSplit$1.call(e.stack, '\n').splice(2);
                console.group(msg); // tslint:disable-line
                forEach.call(stackTraceLines, (trace) => {
                    // We need to format this as a string,
                    // because Safari will detect that the string
                    // is a stack trace line item and will format it as so
                    console.log('%s', trace.trim()); // tslint:disable-line
                });
                console.groupEnd(); // tslint:disable-line
            }
        },
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    /**
     * In IE11, symbols are expensive.
     * Due to the nature of the symbol polyfill. This method abstract the
     * creation of symbols, so we can fallback to string when native symbols
     * are not supported. Note that we can't use typeof since it will fail when transpiling.
     */
    const hasNativeSymbolsSupport = Symbol('x').toString() === 'Symbol(x)';
    function createFieldName(key) {
        // @ts-ignore: using a string as a symbol for perf reasons
        return hasNativeSymbolsSupport ? Symbol(key) : `$$lwc-${key}$$`;
    }
    function setInternalField(o, fieldName, value) {
        // TODO: improve this to use  or a WeakMap
        defineProperty(o, fieldName, {
            value,
        });
    }
    function getInternalField(o, fieldName) {
        return o[fieldName];
    }
    /**
     * Store fields that should be hidden from outside world
     * hiddenFieldsMap is a WeakMap.
     * It stores a hash of any given objects associative relationships.
     * The hash uses the fieldName as the key, the value represents the other end of the association.
     *
     * For example, if the association is
     *              ViewModel
     * Component-A --------------> VM-1
     * then,
     * hiddenFieldsMap : (Component-A, { Symbol(ViewModel) : VM-1 })
     *
     */
    const hiddenFieldsMap = new WeakMap();
    const setHiddenField = hasNativeSymbolsSupport
        ? (o, fieldName, value) => {
            let valuesByField = hiddenFieldsMap.get(o);
            if (isUndefined(valuesByField)) {
                valuesByField = create(null);
                hiddenFieldsMap.set(o, valuesByField);
            }
            valuesByField[fieldName] = value;
        }
        : setInternalField; // Fall back to symbol based approach in compat mode
    const getHiddenField = hasNativeSymbolsSupport
        ? (o, fieldName) => {
            const valuesByField = hiddenFieldsMap.get(o);
            return !isUndefined(valuesByField) && valuesByField[fieldName];
        }
        : getInternalField; // Fall back to symbol based approach in compat mode

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function detect(propName) {
        return Object.getOwnPropertyDescriptor(Element.prototype, propName) === undefined;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // this regular expression is used to transform aria props into aria attributes because
    // that doesn't follow the regular transformation process. e.g.: `aria-labeledby` <=> `ariaLabelBy`
    const ARIA_REGEX = /^aria/;
    const nodeToAriaPropertyValuesMap = new WeakMap();
    const { hasOwnProperty: hasOwnProperty$1 } = Object.prototype;
    const { replace: StringReplace$1, toLowerCase: StringToLowerCase$1, } = String.prototype;
    function getAriaPropertyMap(elm) {
        let map = nodeToAriaPropertyValuesMap.get(elm);
        if (map === undefined) {
            map = { host: {}, sr: {} };
            nodeToAriaPropertyValuesMap.set(elm, map);
        }
        return map;
    }
    function getNormalizedAriaPropertyValue(propName, value) {
        return value == null ? null : value + '';
    }
    function createAriaPropertyPropertyDescriptor(propName, attrName) {
        return {
            get() {
                const map = getAriaPropertyMap(this);
                if (hasOwnProperty$1.call(map, propName)) {
                    return map[propName];
                }
                // otherwise just reflect what's in the attribute
                return hasAttribute.call(this, attrName) ? getAttribute.call(this, attrName) : null;
            },
            set(newValue) {
                newValue = getNormalizedAriaPropertyValue(propName, newValue);
                const map = getAriaPropertyMap(this);
                map[propName] = newValue;
                // reflect into the corresponding attribute
                if (newValue === null) {
                    removeAttribute.call(this, attrName);
                }
                else {
                    setAttribute.call(this, attrName, newValue);
                }
            },
            configurable: true,
            enumerable: true,
        };
    }
    function patch(propName) {
        const attrName = StringToLowerCase$1.call(StringReplace$1.call(propName, ARIA_REGEX, 'aria-'));
        const descriptor = createAriaPropertyPropertyDescriptor(propName, attrName);
        Object.defineProperty(Element.prototype, propName, descriptor);
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // Global Aria and Role Properties derived from ARIA and Role Attributes.
    // https://wicg.github.io/aom/spec/aria-reflection.html
    const ElementPrototypeAriaPropertyNames = [
        'ariaAutoComplete',
        'ariaChecked',
        'ariaCurrent',
        'ariaDisabled',
        'ariaExpanded',
        'ariaHasPopUp',
        'ariaHidden',
        'ariaInvalid',
        'ariaLabel',
        'ariaLevel',
        'ariaMultiLine',
        'ariaMultiSelectable',
        'ariaOrientation',
        'ariaPressed',
        'ariaReadOnly',
        'ariaRequired',
        'ariaSelected',
        'ariaSort',
        'ariaValueMax',
        'ariaValueMin',
        'ariaValueNow',
        'ariaValueText',
        'ariaLive',
        'ariaRelevant',
        'ariaAtomic',
        'ariaBusy',
        'ariaActiveDescendant',
        'ariaControls',
        'ariaDescribedBy',
        'ariaFlowTo',
        'ariaLabelledBy',
        'ariaOwns',
        'ariaPosInSet',
        'ariaSetSize',
        'ariaColCount',
        'ariaColIndex',
        'ariaDetails',
        'ariaErrorMessage',
        'ariaKeyShortcuts',
        'ariaModal',
        'ariaPlaceholder',
        'ariaRoleDescription',
        'ariaRowCount',
        'ariaRowIndex',
        'ariaRowSpan',
        'role',
    ];
    for (let i = 0, len = ElementPrototypeAriaPropertyNames.length; i < len; i += 1) {
        const propName = ElementPrototypeAriaPropertyNames[i];
        if (detect(propName)) {
            patch(propName);
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // These properties get added to LWCElement.prototype publicProps automatically
    const defaultDefHTMLPropertyNames = ['dir', 'id', 'accessKey', 'title', 'lang', 'hidden', 'draggable', 'tabIndex'];
    // Few more exceptions that are using the attribute name to match the property in lowercase.
    // this list was compiled from https://msdn.microsoft.com/en-us/library/ms533062(v=vs.85).aspx
    // and https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
    // Note: this list most be in sync with the compiler as well.
    const HTMLPropertyNamesWithLowercasedReflectiveAttributes = [
        'accessKey',
        'readOnly',
        'tabIndex',
        'bgColor',
        'colSpan',
        'rowSpan',
        'contentEditable',
        'dateTime',
        'formAction',
        'isMap',
        'maxLength',
        'useMap',
    ];
    const OffsetPropertiesError = 'This property will round the value to an integer, and it is considered an anti-pattern. Instead, you can use \`this.getBoundingClientRect()\` to obtain `left`, `top`, `right`, `bottom`, `x`, `y`, `width`, and `height` fractional values describing the overall border-box in pixels.';
    // Global HTML Attributes & Properties
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
    function getGlobalHTMLPropertiesInfo() {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        return {
            id: {
                attribute: 'id',
                reflective: true,
            },
            accessKey: {
                attribute: 'accesskey',
                reflective: true,
            },
            accessKeyLabel: {
                readOnly: true,
            },
            className: {
                attribute: 'class',
                error: `Using property "className" is an anti-pattern because of slow runtime behavior and conflicting with classes provided by the owner element. Instead use property "classList".`,
            },
            contentEditable: {
                attribute: 'contenteditable',
                reflective: true,
            },
            isContentEditable: {
                readOnly: true,
            },
            contextMenu: {
                attribute: 'contextmenu',
            },
            dataset: {
                readOnly: true,
                error: 'Using property "dataset" is an anti-pattern. Components should not rely on dataset to implement its internal logic, nor use that as a communication channel.',
            },
            dir: {
                attribute: 'dir',
                reflective: true,
            },
            draggable: {
                attribute: 'draggable',
                experimental: true,
                reflective: true,
            },
            dropzone: {
                attribute: 'dropzone',
                readOnly: true,
                experimental: true,
            },
            hidden: {
                attribute: 'hidden',
                reflective: true,
            },
            itemScope: {
                attribute: 'itemscope',
                experimental: true,
            },
            itemType: {
                attribute: 'itemtype',
                readOnly: true,
                experimental: true,
            },
            itemId: {
                attribute: 'itemid',
                experimental: true,
            },
            itemRef: {
                attribute: 'itemref',
                readOnly: true,
                experimental: true,
            },
            itemProp: {
                attribute: 'itemprop',
                readOnly: true,
                experimental: true,
            },
            itemValue: {
                experimental: true,
            },
            lang: {
                attribute: 'lang',
                reflective: true,
            },
            offsetHeight: {
                readOnly: true,
                error: OffsetPropertiesError,
            },
            offsetLeft: {
                readOnly: true,
                error: OffsetPropertiesError,
            },
            offsetParent: {
                readOnly: true,
            },
            offsetTop: {
                readOnly: true,
                error: OffsetPropertiesError,
            },
            offsetWidth: {
                readOnly: true,
                error: OffsetPropertiesError,
            },
            properties: {
                readOnly: true,
                experimental: true,
            },
            spellcheck: {
                experimental: true,
                reflective: true,
            },
            style: {
                attribute: 'style',
                error: `Using property or attribute "style" is an anti-pattern. Instead use property "classList".`,
            },
            tabIndex: {
                attribute: 'tabindex',
                reflective: true,
            },
            title: {
                attribute: 'title',
                reflective: true,
            },
            translate: {
                experimental: true,
            },
            // additional global attributes that are not present in the link above.
            role: {
                attribute: 'role',
            },
            slot: {
                attribute: 'slot',
                experimental: true,
                error: `Using property or attribute "slot" is an anti-pattern.`
            }
        };
    }
    // TODO: complete this list with Element properties
    // https://developer.mozilla.org/en-US/docs/Web/API/Element
    // TODO: complete this list with Node properties
    // https://developer.mozilla.org/en-US/docs/Web/API/Node
    const AttrNameToPropNameMap = create(null);
    const PropNameToAttrNameMap = create(null);
    // Synthetic creation of all AOM property descriptors for Custom Elements
    forEach.call(ElementPrototypeAriaPropertyNames, (propName) => {
        const attrName = StringToLowerCase.call(StringReplace.call(propName, /^aria/, 'aria-'));
        AttrNameToPropNameMap[attrName] = propName;
        PropNameToAttrNameMap[propName] = attrName;
    });
    forEach.call(defaultDefHTMLPropertyNames, (propName) => {
        const attrName = StringToLowerCase.call(propName);
        AttrNameToPropNameMap[attrName] = propName;
        PropNameToAttrNameMap[propName] = attrName;
    });
    forEach.call(HTMLPropertyNamesWithLowercasedReflectiveAttributes, (propName) => {
        const attrName = StringToLowerCase.call(propName);
        AttrNameToPropNameMap[attrName] = propName;
        PropNameToAttrNameMap[propName] = attrName;
    });
    const CAMEL_REGEX = /-([a-z])/g;
    /**
     * This method maps between attribute names
     * and the corresponding property name.
     */
    function getPropNameFromAttrName(attrName) {
        if (isUndefined(AttrNameToPropNameMap[attrName])) {
            AttrNameToPropNameMap[attrName] = StringReplace.call(attrName, CAMEL_REGEX, (g) => g[1].toUpperCase());
        }
        return AttrNameToPropNameMap[attrName];
    }
    const CAPS_REGEX = /[A-Z]/g;
    /**
     * This method maps between property names
     * and the corresponding attribute name.
     */
    function getAttrNameFromPropName(propName) {
        if (isUndefined(PropNameToAttrNameMap[propName])) {
            PropNameToAttrNameMap[propName] = StringReplace.call(propName, CAPS_REGEX, (match) => '-' + match.toLowerCase());
        }
        return PropNameToAttrNameMap[propName];
    }
    let controlledElement = null;
    let controlledAttributeName;
    function isAttributeLocked(elm, attrName) {
        return elm !== controlledElement || attrName !== controlledAttributeName;
    }
    function lockAttribute(elm, key) {
        controlledElement = null;
        controlledAttributeName = undefined;
    }
    function unlockAttribute(elm, key) {
        controlledElement = elm;
        controlledAttributeName = key;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    let nextTickCallbackQueue = [];
    const SPACE_CHAR = 32;
    const EmptyObject = seal(create(null));
    const EmptyArray = seal([]);
    const ViewModelReflection = createFieldName('ViewModel');
    function flushCallbackQueue() {
        if (process.env.NODE_ENV !== 'production') {
            if (nextTickCallbackQueue.length === 0) {
                throw new Error(`Internal Error: If callbackQueue is scheduled, it is because there must be at least one callback on this pending queue.`);
            }
        }
        const callbacks = nextTickCallbackQueue;
        nextTickCallbackQueue = []; // reset to a new queue
        for (let i = 0, len = callbacks.length; i < len; i += 1) {
            callbacks[i]();
        }
    }
    function addCallbackToNextTick(callback) {
        if (process.env.NODE_ENV !== 'production') {
            if (!isFunction(callback)) {
                throw new Error(`Internal Error: addCallbackToNextTick() can only accept a function callback`);
            }
        }
        if (nextTickCallbackQueue.length === 0) {
            Promise.resolve().then(flushCallbackQueue);
        }
        // TODO: eventually, we might want to have priority when inserting callbacks
        ArrayPush.call(nextTickCallbackQueue, callback);
    }
    function isCircularModuleDependency(value) {
        return hasOwnProperty.call(value, '__circular__');
    }
    /**
     * When LWC is used in the context of an Aura application, the compiler produces AMD
     * modules, that doesn't resolve properly circular dependencies between modules. In order
     * to circumvent this issue, the module loader returns a factory with a symbol attached
     * to it.
     *
     * This method returns the resolved value if it received a factory as argument. Otherwise
     * it returns the original value.
     */
    function resolveCircularModuleDependency(fn) {
        if (process.env.NODE_ENV !== 'production') {
            if (!isFunction(fn)) {
                throw new ReferenceError(`Circular module dependency must be a function.`);
            }
        }
        return fn();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function handleEvent(event, vnode) {
        const { type } = event;
        const { data: { on } } = vnode;
        const handler = on && on[type];
        // call event handler if exists
        if (handler) {
            handler.call(undefined, event);
        }
    }
    function createListener() {
        return function handler(event) {
            handleEvent(event, handler.vnode);
        };
    }
    function updateAllEventListeners(oldVnode, vnode) {
        if (isUndefined(oldVnode.listener)) {
            createAllEventListeners(vnode);
        }
        else {
            vnode.listener = oldVnode.listener;
            vnode.listener.vnode = vnode;
        }
    }
    function createAllEventListeners(vnode) {
        const { data: { on } } = vnode;
        if (isUndefined(on)) {
            return;
        }
        const elm = vnode.elm;
        const listener = vnode.listener = createListener();
        listener.vnode = vnode;
        let name;
        for (name in on) {
            elm.addEventListener(name, listener);
        }
    }
    var modEvents = {
        update: updateAllEventListeners,
        create: createAllEventListeners,
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const xlinkNS = 'http://www.w3.org/1999/xlink';
    const xmlNS = 'http://www.w3.org/XML/1998/namespace';
    const ColonCharCode = 58;
    function updateAttrs(oldVnode, vnode) {
        const { data: { attrs } } = vnode;
        if (isUndefined(attrs)) {
            return;
        }
        let { data: { attrs: oldAttrs } } = oldVnode;
        if (oldAttrs === attrs) {
            return;
        }
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(isUndefined(oldAttrs) || keys(oldAttrs).join(',') === keys(attrs).join(','), `vnode.data.attrs cannot change shape.`);
        }
        const elm = vnode.elm;
        let key;
        oldAttrs = isUndefined(oldAttrs) ? EmptyObject : oldAttrs;
        // update modified attributes, add new attributes
        // this routine is only useful for data-* attributes in all kind of elements
        // and aria-* in standard elements (custom elements will use props for these)
        for (key in attrs) {
            const cur = attrs[key];
            const old = oldAttrs[key];
            if (old !== cur) {
                unlockAttribute(elm, key);
                if (StringCharCodeAt.call(key, 3) === ColonCharCode) {
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                }
                else if (StringCharCodeAt.call(key, 5) === ColonCharCode) {
                    // Assume xlink namespace
                    elm.setAttributeNS(xlinkNS, key, cur);
                }
                else if (isNull(cur)) {
                    elm.removeAttribute(key);
                }
                else {
                    elm.setAttribute(key, cur);
                }
                lockAttribute(elm, key);
            }
        }
    }
    const emptyVNode = { data: {} };
    var modAttrs = {
        create: (vnode) => updateAttrs(emptyVNode, vnode),
        update: updateAttrs
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const TargetToReactiveRecordMap = new WeakMap();
    function notifyMutation(target, key) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(!isRendering, `Mutating property ${toString(key)} of ${toString(target)} is not allowed during the rendering life-cycle of ${vmBeingRendered}.`);
        }
        const reactiveRecord = TargetToReactiveRecordMap.get(target);
        if (!isUndefined(reactiveRecord)) {
            const value = reactiveRecord[key];
            if (value) {
                const len = value.length;
                for (let i = 0; i < len; i += 1) {
                    const vm = value[i];
                    if (process.env.NODE_ENV !== 'production') {
                        assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                    }
                    if (!vm.isDirty) {
                        markComponentAsDirty(vm);
                        scheduleRehydration(vm);
                    }
                }
            }
        }
    }
    function observeMutation(target, key) {
        if (isNull(vmBeingRendered)) {
            return; // nothing to subscribe to
        }
        const vm = vmBeingRendered;
        let reactiveRecord = TargetToReactiveRecordMap.get(target);
        if (isUndefined(reactiveRecord)) {
            const newRecord = create(null);
            reactiveRecord = newRecord;
            TargetToReactiveRecordMap.set(target, newRecord);
        }
        let value = reactiveRecord[key];
        if (isUndefined(value)) {
            value = [];
            reactiveRecord[key] = value;
        }
        else if (value[0] === vm) {
            return; // perf optimization considering that most subscriptions will come from the same vm
        }
        if (ArrayIndexOf.call(value, vm) === -1) {
            ArrayPush.call(value, vm);
            // we keep track of the sets that vm is listening from to be able to do some clean up later on
            ArrayPush.call(vm.deps, value);
        }
    }

    /**
     * Copyright (C) 2017 salesforce.com, inc.
     */
    const { isArray: isArray$1 } = Array;
    const { getPrototypeOf: getPrototypeOf$1, create: ObjectCreate, defineProperty: ObjectDefineProperty, defineProperties: ObjectDefineProperties, isExtensible: isExtensible$1, getOwnPropertyDescriptor: getOwnPropertyDescriptor$1, getOwnPropertyNames: getOwnPropertyNames$1, getOwnPropertySymbols: getOwnPropertySymbols$1, preventExtensions: preventExtensions$1, } = Object;
    const { push: ArrayPush$1, concat: ArrayConcat$1, map: ArrayMap$1, } = Array.prototype;
    const ObjectDotPrototype = Object.prototype;
    const OtS$1 = {}.toString;
    function toString$1(obj) {
        if (obj && obj.toString) {
            return obj.toString();
        }
        else if (typeof obj === 'object') {
            return OtS$1.call(obj);
        }
        else {
            return obj + '';
        }
    }
    function isUndefined$1(obj) {
        return obj === undefined;
    }
    const TargetSlot = Symbol();
    // TODO: we are using a funky and leaky abstraction here to try to identify if
    // the proxy is a compat proxy, and define the unwrap method accordingly.
    // @ts-ignore
    const { getKey } = Proxy;
    const unwrap = getKey ?
        (replicaOrAny) => (replicaOrAny && getKey(replicaOrAny, TargetSlot)) || replicaOrAny
        : (replicaOrAny) => (replicaOrAny && replicaOrAny[TargetSlot]) || replicaOrAny;
    function isObservable(value) {
        // intentionally checking for null and undefined
        if (value == null) {
            return false;
        }
        if (isArray$1(value)) {
            return true;
        }
        const proto = getPrototypeOf$1(value);
        return (proto === ObjectDotPrototype || proto === null || getPrototypeOf$1(proto) === null);
    }
    function isObject$1(obj) {
        return typeof obj === 'object';
    }
    // Unwrap property descriptors
    // We only need to unwrap if value is specified
    function unwrapDescriptor(descriptor) {
        if ('value' in descriptor) {
            descriptor.value = unwrap(descriptor.value);
        }
        return descriptor;
    }
    function wrapDescriptor(membrane, descriptor) {
        if ('value' in descriptor) {
            descriptor.value = isObservable(descriptor.value) ? membrane.getProxy(descriptor.value) : descriptor.value;
        }
        return descriptor;
    }
    function lockShadowTarget(membrane, shadowTarget, originalTarget) {
        const targetKeys = ArrayConcat$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
        targetKeys.forEach((key) => {
            let descriptor = getOwnPropertyDescriptor$1(originalTarget, key);
            // We do not need to wrap the descriptor if not configurable
            // Because we can deal with wrapping it when user goes through
            // Get own property descriptor. There is also a chance that this descriptor
            // could change sometime in the future, so we can defer wrapping
            // until we need to
            if (!descriptor.configurable) {
                descriptor = wrapDescriptor(membrane, descriptor);
            }
            ObjectDefineProperty(shadowTarget, key, descriptor);
        });
        preventExtensions$1(shadowTarget);
    }
    class ReactiveProxyHandler {
        constructor(membrane, value, options) {
            this.originalTarget = value;
            this.membrane = membrane;
            if (!isUndefined$1(options)) {
                this.valueMutated = options.valueMutated;
                this.valueObserved = options.valueObserved;
            }
        }
        get(shadowTarget, key) {
            const { originalTarget, membrane } = this;
            if (key === TargetSlot) {
                return originalTarget;
            }
            const value = originalTarget[key];
            const { valueObserved } = this;
            if (!isUndefined$1(valueObserved)) {
                valueObserved(originalTarget, key);
            }
            return membrane.getProxy(value);
        }
        set(shadowTarget, key, value) {
            const { originalTarget, valueMutated } = this;
            const oldValue = originalTarget[key];
            if (oldValue !== value) {
                originalTarget[key] = value;
                if (!isUndefined$1(valueMutated)) {
                    valueMutated(originalTarget, key);
                }
            }
            else if (key === 'length' && isArray$1(originalTarget)) {
                // fix for issue #236: push will add the new index, and by the time length
                // is updated, the internal length is already equal to the new length value
                // therefore, the oldValue is equal to the value. This is the forking logic
                // to support this use case.
                if (!isUndefined$1(valueMutated)) {
                    valueMutated(originalTarget, key);
                }
            }
            return true;
        }
        deleteProperty(shadowTarget, key) {
            const { originalTarget, valueMutated } = this;
            delete originalTarget[key];
            if (!isUndefined$1(valueMutated)) {
                valueMutated(originalTarget, key);
            }
            return true;
        }
        apply(shadowTarget, thisArg, argArray) {
            /* No op */
        }
        construct(target, argArray, newTarget) {
            /* No op */
        }
        has(shadowTarget, key) {
            const { originalTarget, valueObserved } = this;
            if (!isUndefined$1(valueObserved)) {
                valueObserved(originalTarget, key);
            }
            return key in originalTarget;
        }
        ownKeys(shadowTarget) {
            const { originalTarget } = this;
            return ArrayConcat$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
        }
        isExtensible(shadowTarget) {
            const shadowIsExtensible = isExtensible$1(shadowTarget);
            if (!shadowIsExtensible) {
                return shadowIsExtensible;
            }
            const { originalTarget, membrane } = this;
            const targetIsExtensible = isExtensible$1(originalTarget);
            if (!targetIsExtensible) {
                lockShadowTarget(membrane, shadowTarget, originalTarget);
            }
            return targetIsExtensible;
        }
        setPrototypeOf(shadowTarget, prototype) {
            if (process.env.NODE_ENV !== 'production') {
                throw new Error(`Invalid setPrototypeOf invocation for reactive proxy ${toString$1(this.originalTarget)}. Prototype of reactive objects cannot be changed.`);
            }
        }
        getPrototypeOf(shadowTarget) {
            const { originalTarget } = this;
            return getPrototypeOf$1(originalTarget);
        }
        getOwnPropertyDescriptor(shadowTarget, key) {
            const { originalTarget, membrane, valueObserved } = this;
            // keys looked up via hasOwnProperty need to be reactive
            if (!isUndefined$1(valueObserved)) {
                valueObserved(originalTarget, key);
            }
            let desc = getOwnPropertyDescriptor$1(originalTarget, key);
            if (isUndefined$1(desc)) {
                return desc;
            }
            const shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);
            if (!desc.configurable && !shadowDescriptor) {
                // If descriptor from original target is not configurable,
                // We must copy the wrapped descriptor over to the shadow target.
                // Otherwise, proxy will throw an invariant error.
                // This is our last chance to lock the value.
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
                desc = wrapDescriptor(membrane, desc);
                ObjectDefineProperty(shadowTarget, key, desc);
            }
            return shadowDescriptor || desc;
        }
        preventExtensions(shadowTarget) {
            const { originalTarget, membrane } = this;
            lockShadowTarget(membrane, shadowTarget, originalTarget);
            preventExtensions$1(originalTarget);
            return true;
        }
        defineProperty(shadowTarget, key, descriptor) {
            const { originalTarget, membrane, valueMutated } = this;
            const { configurable } = descriptor;
            // We have to check for value in descriptor
            // because Object.freeze(proxy) calls this method
            // with only { configurable: false, writeable: false }
            // Additionally, method will only be called with writeable:false
            // if the descriptor has a value, as opposed to getter/setter
            // So we can just check if writable is present and then see if
            // value is present. This eliminates getter and setter descriptors
            if ('writable' in descriptor && !('value' in descriptor)) {
                const originalDescriptor = getOwnPropertyDescriptor$1(originalTarget, key);
                descriptor.value = originalDescriptor.value;
            }
            ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));
            if (configurable === false) {
                ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor));
            }
            if (!isUndefined$1(valueMutated)) {
                valueMutated(originalTarget, key);
            }
            return true;
        }
    }
    function wrapDescriptor$1(membrane, descriptor) {
        if ('value' in descriptor) {
            descriptor.value = isObservable(descriptor.value) ? membrane.getReadOnlyProxy(descriptor.value) : descriptor.value;
        }
        return descriptor;
    }
    class ReadOnlyHandler {
        constructor(membrane, value, options) {
            this.originalTarget = value;
            this.membrane = membrane;
            if (!isUndefined$1(options)) {
                this.valueObserved = options.valueObserved;
            }
        }
        get(shadowTarget, key) {
            const { membrane, originalTarget } = this;
            if (key === TargetSlot) {
                return originalTarget;
            }
            const value = originalTarget[key];
            const { valueObserved } = this;
            if (!isUndefined$1(valueObserved)) {
                valueObserved(originalTarget, key);
            }
            return membrane.getReadOnlyProxy(value);
        }
        set(shadowTarget, key, value) {
            if (process.env.NODE_ENV !== 'production') {
                const { originalTarget } = this;
                throw new Error(`Invalid mutation: Cannot set "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
            }
            return false;
        }
        deleteProperty(shadowTarget, key) {
            if (process.env.NODE_ENV !== 'production') {
                const { originalTarget } = this;
                throw new Error(`Invalid mutation: Cannot delete "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
            }
            return false;
        }
        apply(shadowTarget, thisArg, argArray) {
            /* No op */
        }
        construct(target, argArray, newTarget) {
            /* No op */
        }
        has(shadowTarget, key) {
            const { originalTarget } = this;
            const { valueObserved } = this;
            if (!isUndefined$1(valueObserved)) {
                valueObserved(originalTarget, key);
            }
            return key in originalTarget;
        }
        ownKeys(shadowTarget) {
            const { originalTarget } = this;
            return ArrayConcat$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
        }
        setPrototypeOf(shadowTarget, prototype) {
            if (process.env.NODE_ENV !== 'production') {
                const { originalTarget } = this;
                throw new Error(`Invalid prototype mutation: Cannot set prototype on "${originalTarget}". "${originalTarget}" prototype is read-only.`);
            }
        }
        getOwnPropertyDescriptor(shadowTarget, key) {
            const { originalTarget, membrane, valueObserved } = this;
            // keys looked up via hasOwnProperty need to be reactive
            if (!isUndefined$1(valueObserved)) {
                valueObserved(originalTarget, key);
            }
            let desc = getOwnPropertyDescriptor$1(originalTarget, key);
            if (isUndefined$1(desc)) {
                return desc;
            }
            const shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);
            if (!desc.configurable && !shadowDescriptor) {
                // If descriptor from original target is not configurable,
                // We must copy the wrapped descriptor over to the shadow target.
                // Otherwise, proxy will throw an invariant error.
                // This is our last chance to lock the value.
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
                desc = wrapDescriptor$1(membrane, desc);
                ObjectDefineProperty(shadowTarget, key, desc);
            }
            return shadowDescriptor || desc;
        }
        preventExtensions(shadowTarget) {
            if (process.env.NODE_ENV !== 'production') {
                const { originalTarget } = this;
                throw new Error(`Invalid mutation: Cannot preventExtensions on ${originalTarget}". "${originalTarget} is read-only.`);
            }
            return false;
        }
        defineProperty(shadowTarget, key, descriptor) {
            if (process.env.NODE_ENV !== 'production') {
                const { originalTarget } = this;
                throw new Error(`Invalid mutation: Cannot defineProperty "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
            }
            return false;
        }
    }
    function getTarget(item) {
        return item && item[TargetSlot];
    }
    function extract(objectOrArray) {
        if (isArray$1(objectOrArray)) {
            return objectOrArray.map((item) => {
                const original = getTarget(item);
                if (original) {
                    return extract(original);
                }
                return item;
            });
        }
        const obj = ObjectCreate(getPrototypeOf$1(objectOrArray));
        const names = getOwnPropertyNames$1(objectOrArray);
        return ArrayConcat$1.call(names, getOwnPropertySymbols$1(objectOrArray))
            .reduce((seed, key) => {
            const item = objectOrArray[key];
            const original = getTarget(item);
            if (original) {
                seed[key] = extract(original);
            }
            else {
                seed[key] = item;
            }
            return seed;
        }, obj);
    }
    const formatter = {
        header: (plainOrProxy) => {
            const originalTarget = plainOrProxy[TargetSlot];
            if (!originalTarget) {
                return null;
            }
            const obj = extract(plainOrProxy);
            return ['object', { object: obj }];
        },
        hasBody: () => {
            return false;
        },
        body: () => {
            return null;
        }
    };
    function init() {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        // Custom Formatter for Dev Tools
        // To enable this, open Chrome Dev Tools
        // Go to Settings,
        // Under console, select "Enable custom formatters"
        // For more information, https://docs.google.com/document/d/1FTascZXT9cxfetuPRT2eXPQKXui4nWFivUnS_335T3U/preview
        const devWindow = window;
        const devtoolsFormatters = devWindow.devtoolsFormatters || [];
        ArrayPush$1.call(devtoolsFormatters, formatter);
        devWindow.devtoolsFormatters = devtoolsFormatters;
    }
    if (process.env.NODE_ENV !== 'production') {
        init();
    }
    function createShadowTarget(value) {
        let shadowTarget = undefined;
        if (isArray$1(value)) {
            shadowTarget = [];
        }
        else if (isObject$1(value)) {
            shadowTarget = {};
        }
        return shadowTarget;
    }
    class ReactiveMembrane {
        constructor(options) {
            this.objectGraph = new WeakMap();
            if (!isUndefined$1(options)) {
                this.valueDistortion = options.valueDistortion;
                this.valueMutated = options.valueMutated;
                this.valueObserved = options.valueObserved;
            }
        }
        getProxy(value) {
            const { valueDistortion } = this;
            const distorted = isUndefined$1(valueDistortion) ? value : valueDistortion(value);
            if (isObservable(distorted)) {
                const o = this.getReactiveState(distorted);
                // when trying to extract the writable version of a readonly
                // we return the readonly.
                return o.readOnly === value ? value : o.reactive;
            }
            return distorted;
        }
        getReadOnlyProxy(value) {
            const { valueDistortion } = this;
            const distorted = isUndefined$1(valueDistortion) ? value : valueDistortion(value);
            if (isObservable(distorted)) {
                return this.getReactiveState(distorted).readOnly;
            }
            return distorted;
        }
        unwrapProxy(p) {
            return unwrap(p);
        }
        getReactiveState(value) {
            const membrane = this;
            const { objectGraph, valueMutated, valueObserved, } = membrane;
            value = unwrap(value);
            let reactiveState = objectGraph.get(value);
            if (reactiveState) {
                return reactiveState;
            }
            reactiveState = ObjectDefineProperties(ObjectCreate(null), {
                reactive: {
                    get() {
                        const reactiveHandler = new ReactiveProxyHandler(membrane, value, {
                            valueMutated,
                            valueObserved,
                        });
                        // caching the reactive proxy after the first time it is accessed
                        const proxy = new Proxy(createShadowTarget(value), reactiveHandler);
                        ObjectDefineProperty(this, 'reactive', { value: proxy });
                        return proxy;
                    },
                    configurable: true,
                },
                readOnly: {
                    get() {
                        const readOnlyHandler = new ReadOnlyHandler(membrane, value, {
                            valueObserved,
                        });
                        // caching the readOnly proxy after the first time it is accessed
                        const proxy = new Proxy(createShadowTarget(value), readOnlyHandler);
                        ObjectDefineProperty(this, 'readOnly', { value: proxy });
                        return proxy;
                    },
                    configurable: true,
                }
            });
            objectGraph.set(value, reactiveState);
            return reactiveState;
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function valueDistortion(value) {
        return value;
    }
    const reactiveMembrane = new ReactiveMembrane({
        valueObserved: observeMutation,
        valueMutated: notifyMutation,
        valueDistortion,
    });
    // TODO: REMOVE THIS https://github.com/salesforce/lwc/issues/129
    function dangerousObjectMutation(obj) {
        if (process.env.NODE_ENV !== 'production') {
            assert.logWarning(`Dangerously Mutating Object ${toString(obj)}. This object was passed to you from a parent component, and should not be mutated here. This will be removed in the near future.`);
        }
        return reactiveMembrane.getProxy(unwrap$1(obj));
    }
    // Universal unwrap mechanism that works for observable membrane
    // and wrapped iframe contentWindow
    const unwrap$1 = function (value) {
        const unwrapped = reactiveMembrane.unwrapProxy(value);
        if (unwrapped !== value) {
            return unwrapped;
        }
        return value;
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function track(target, prop, descriptor) {
        if (arguments.length === 1) {
            return reactiveMembrane.getProxy(target);
        }
        if (process.env.NODE_ENV !== 'production') {
            if (arguments.length !== 3) {
                assert.fail(`@track decorator can only be used with one argument to return a trackable object, or as a decorator function.`);
            }
            if (!isUndefined(descriptor)) {
                const { get, set, configurable, writable } = descriptor;
                assert.isTrue(!get && !set, `Compiler Error: A @track decorator can only be applied to a public field.`);
                assert.isTrue(configurable !== false, `Compiler Error: A @track decorator can only be applied to a configurable property.`);
                assert.isTrue(writable !== false, `Compiler Error: A @track decorator can only be applied to a writable property.`);
            }
        }
        return createTrackedPropertyDescriptor(target, prop, isUndefined(descriptor) ? true : descriptor.enumerable === true);
    }
    function createTrackedPropertyDescriptor(Ctor, key, enumerable) {
        return {
            get() {
                const vm = getComponentVM(this);
                if (process.env.NODE_ENV !== 'production') {
                    assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                }
                observeMutation(this, key);
                return vm.cmpTrack[key];
            },
            set(newValue) {
                const vm = getComponentVM(this);
                if (process.env.NODE_ENV !== 'production') {
                    assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                    assert.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${String(key)}`);
                }
                const reactiveOrAnyValue = reactiveMembrane.getProxy(newValue);
                if (reactiveOrAnyValue !== vm.cmpTrack[key]) {
                    if (process.env.NODE_ENV !== 'production') {
                        // reactiveMembrane.getProxy(newValue) will return a different value (proxy)
                        // Then newValue if newValue is observable (plain object or array)
                        const isObservable = reactiveOrAnyValue !== newValue;
                        if (!isObservable && newValue !== null && (isObject(newValue) || isArray(newValue))) {
                            assert.logWarning(`Property "${toString(key)}" of ${vm} is set to a non-trackable object, which means changes into that object cannot be observed.`, vm.elm);
                        }
                    }
                    vm.cmpTrack[key] = reactiveOrAnyValue;
                    if (vm.idx > 0) {
                        // perf optimization to skip this step if not in the DOM
                        notifyMutation(this, key);
                    }
                }
            },
            enumerable,
            configurable: true,
        };
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function wireDecorator(target, prop, descriptor) {
        if (process.env.NODE_ENV !== 'production') {
            if (!isUndefined(descriptor)) {
                const { get, set, configurable, writable } = descriptor;
                assert.isTrue(!get && !set, `Compiler Error: A @wire decorator can only be applied to a public field.`);
                assert.isTrue(configurable !== false, `Compiler Error: A @wire decorator can only be applied to a configurable property.`);
                assert.isTrue(writable !== false, `Compiler Error: A @wire decorator can only be applied to a writable property.`);
            }
        }
        // TODO: eventually this decorator should have its own logic
        return createTrackedPropertyDescriptor(target, prop, isObject(descriptor) ? descriptor.enumerable === true : true);
    }
    // @wire is a factory that when invoked, returns the wire decorator
    function wire(adapter, config) {
        const len = arguments.length;
        if (len > 0 && len < 3) {
            return wireDecorator;
        }
        else {
            if (process.env.NODE_ENV !== 'production') {
                assert.fail("@wire(adapter, config?) may only be used as a decorator.");
            }
            throw new TypeError();
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function decorate(Ctor, decorators) {
        // intentionally comparing decorators with null and undefined
        if (!isFunction(Ctor) || decorators == null) {
            throw new TypeError();
        }
        const props = getOwnPropertyNames(decorators);
        // intentionally allowing decoration of classes only for now
        const target = Ctor.prototype;
        for (let i = 0, len = props.length; i < len; i += 1) {
            const propName = props[i];
            const decorator = decorators[propName];
            if (!isFunction(decorator)) {
                throw new TypeError();
            }
            const originalDescriptor = getOwnPropertyDescriptor(target, propName);
            const descriptor = decorator(Ctor, propName, originalDescriptor);
            if (!isUndefined(descriptor)) {
                defineProperty(target, propName, descriptor);
            }
        }
        return Ctor; // chaining
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const signedDecoratorToMetaMap = new Map();
    function registerDecorators(Ctor, meta) {
        const decoratorMap = create(null);
        const props = getPublicPropertiesHash(Ctor, meta.publicProps);
        const methods = getPublicMethodsHash(Ctor, meta.publicMethods);
        const wire$$1 = getWireHash(Ctor, meta.wire);
        const track$$1 = getTrackHash(Ctor, meta.track);
        signedDecoratorToMetaMap.set(Ctor, {
            props,
            methods,
            wire: wire$$1,
            track: track$$1,
        });
        for (const propName in props) {
            decoratorMap[propName] = api;
        }
        if (wire$$1) {
            for (const propName in wire$$1) {
                const wireDef = wire$$1[propName];
                if (wireDef.method) {
                    // for decorated methods we need to do nothing
                    continue;
                }
                decoratorMap[propName] = wire(wireDef.adapter, wireDef.params);
            }
        }
        if (track$$1) {
            for (const propName in track$$1) {
                decoratorMap[propName] = track;
            }
        }
        decorate(Ctor, decoratorMap);
        return Ctor;
    }
    function getDecoratorsRegisteredMeta(Ctor) {
        return signedDecoratorToMetaMap.get(Ctor);
    }
    function getTrackHash(target, track$$1) {
        if (isUndefined(track$$1) || getOwnPropertyNames(track$$1).length === 0) {
            return EmptyObject;
        }
        // TODO: check that anything in `track` is correctly defined in the prototype
        return assign(create(null), track$$1);
    }
    function getWireHash(target, wire$$1) {
        if (isUndefined(wire$$1) || getOwnPropertyNames(wire$$1).length === 0) {
            return;
        }
        // TODO: check that anything in `wire` is correctly defined in the prototype
        return assign(create(null), wire$$1);
    }
    function getPublicPropertiesHash(target, props) {
        if (isUndefined(props) || getOwnPropertyNames(props).length === 0) {
            return EmptyObject;
        }
        return getOwnPropertyNames(props).reduce((propsHash, propName) => {
            const attrName = getAttrNameFromPropName(propName);
            if (process.env.NODE_ENV !== 'production') {
                const globalHTMLProperty = getGlobalHTMLPropertiesInfo()[propName];
                if (globalHTMLProperty && globalHTMLProperty.attribute && globalHTMLProperty.reflective === false) {
                    const { error, attribute, experimental } = globalHTMLProperty;
                    const msg = [];
                    if (error) {
                        msg.push(error);
                    }
                    else if (experimental) {
                        msg.push(`"${propName}" is an experimental property that is not standardized or supported by all browsers. You should not use "${propName}" and attribute "${attribute}" in your component.`);
                    }
                    else {
                        msg.push(`"${propName}" is a global HTML property. Instead access it via the reflective attribute "${attribute}" with one of these techniques:`);
                        msg.push(`  * Use \`this.getAttribute("${attribute}")\` to access the attribute value. This option is best suited for accessing the value in a getter during the rendering process.`);
                    }
                    assert.logError(msg.join('\n'));
                }
            }
            propsHash[propName] = assign({
                config: 0,
                type: 'any',
                attr: attrName,
            }, props[propName]);
            return propsHash;
        }, create(null));
    }
    function getPublicMethodsHash(target, publicMethods) {
        if (isUndefined(publicMethods) || publicMethods.length === 0) {
            return EmptyObject;
        }
        return publicMethods.reduce((methodsHash, methodName) => {
            if (process.env.NODE_ENV !== 'production') {
                assert.isTrue(isFunction(target.prototype[methodName]), `Component "${target.name}" should have a method \`${methodName}\` instead of ${target.prototype[methodName]}.`);
            }
            methodsHash[methodName] = target.prototype[methodName];
            return methodsHash;
        }, create(null));
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function api(target, propName, descriptor) {
        if (process.env.NODE_ENV !== 'production') {
            if (arguments.length !== 3) {
                assert.fail(`@api decorator can only be used as a decorator function.`);
            }
        }
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(!descriptor || (isFunction(descriptor.get) || isFunction(descriptor.set)), `Invalid property ${toString(propName)} definition in ${target}, it cannot be a prototype definition if it is a public property. Instead use the constructor to define it.`);
            if (isObject(descriptor) && isFunction(descriptor.set)) {
                assert.isTrue(isObject(descriptor) && isFunction(descriptor.get), `Missing getter for property ${toString(propName)} decorated with @api in ${target}. You cannot have a setter without the corresponding getter.`);
            }
        }
        const meta = getDecoratorsRegisteredMeta(target);
        // initializing getters and setters for each public prop on the target prototype
        if (isObject(descriptor) && (isFunction(descriptor.get) || isFunction(descriptor.set))) {
            // if it is configured as an accessor it must have a descriptor
            // @ts-ignore it must always be set before calling this method
            meta.props[propName].config = isFunction(descriptor.set) ? 3 : 1;
            return createPublicAccessorDescriptor(target, propName, descriptor);
        }
        else {
            // @ts-ignore it must always be set before calling this method
            meta.props[propName].config = 0;
            return createPublicPropertyDescriptor(target, propName, descriptor);
        }
    }
    let vmBeingUpdated = null;
    function prepareForPropUpdate(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        vmBeingUpdated = vm;
    }
    function createPublicPropertyDescriptor(proto, key, descriptor) {
        return {
            get() {
                const vm = getComponentVM(this);
                if (process.env.NODE_ENV !== 'production') {
                    assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                }
                if (isBeingConstructed(vm)) {
                    if (process.env.NODE_ENV !== 'production') {
                        assert.logError(`${vm} constructor should not read the value of property "${toString(key)}". The owner component has not yet set the value. Instead use the constructor to set default values for properties.`, vm.elm);
                    }
                    return;
                }
                observeMutation(this, key);
                return vm.cmpProps[key];
            },
            set(newValue) {
                const vm = getComponentVM(this);
                if (process.env.NODE_ENV !== 'production') {
                    assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                    assert.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${toString(key)}`);
                }
                if (isTrue(vm.isRoot) || isBeingConstructed(vm)) {
                    vmBeingUpdated = vm;
                    if (process.env.NODE_ENV !== 'production') {
                        // reactiveMembrane.getProxy(newValue) will return a different value (proxy)
                        // Then newValue if newValue is observable (plain object or array)
                        const isObservable = reactiveMembrane.getProxy(newValue) !== newValue;
                        if (!isObservable && !isNull(newValue) && isObject(newValue)) {
                            assert.logWarning(`Assigning a non-reactive value ${newValue} to member property ${toString(key)} of ${vm} is not common because mutations on that value cannot be observed.`, vm.elm);
                        }
                    }
                }
                if (process.env.NODE_ENV !== 'production') {
                    if (vmBeingUpdated !== vm) {
                        // logic for setting new properties of the element directly from the DOM
                        // is only recommended for root elements created via createElement()
                        assert.logWarning(`If property ${toString(key)} decorated with @api in ${vm} is used in the template, the value ${toString(newValue)} set manually may be overridden by the template, consider binding the property only in the template.`, vm.elm);
                    }
                }
                vmBeingUpdated = null; // releasing the lock
                // not need to wrap or check the value since that is happening somewhere else
                vm.cmpProps[key] = reactiveMembrane.getReadOnlyProxy(newValue);
                // avoid notification of observability while constructing the instance
                if (vm.idx > 0) {
                    // perf optimization to skip this step if not in the DOM
                    notifyMutation(this, key);
                }
            },
            enumerable: isUndefined(descriptor) ? true : descriptor.enumerable,
        };
    }
    function createPublicAccessorDescriptor(Ctor, key, descriptor) {
        const { get, set, enumerable } = descriptor;
        if (!isFunction(get)) {
            if (process.env.NODE_ENV !== 'production') {
                assert.fail(`Invalid attempt to create public property descriptor ${toString(key)} in ${Ctor}. It is missing the getter declaration with @api get ${toString(key)}() {} syntax.`);
            }
            throw new TypeError();
        }
        return {
            get() {
                if (process.env.NODE_ENV !== 'production') {
                    const vm = getComponentVM(this);
                    assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                }
                return get.call(this);
            },
            set(newValue) {
                const vm = getComponentVM(this);
                if (process.env.NODE_ENV !== 'production') {
                    assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                    assert.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${toString(key)}`);
                }
                if (vm.isRoot || isBeingConstructed(vm)) {
                    vmBeingUpdated = vm;
                    if (process.env.NODE_ENV !== 'production') {
                        // reactiveMembrane.getProxy(newValue) will return a different value (proxy)
                        // Then newValue if newValue is observable (plain object or array)
                        const isObservable = reactiveMembrane.getProxy(newValue) !== newValue;
                        if (!isObservable && !isNull(newValue) && isObject(newValue)) {
                            assert.logWarning(`Assigning a non-reactive value ${newValue} to member property ${toString(key)} of ${vm} is not common because mutations on that value cannot be observed.`, vm.elm);
                        }
                    }
                }
                if (process.env.NODE_ENV !== 'production') {
                    if (vmBeingUpdated !== vm) {
                        // logic for setting new properties of the element directly from the DOM
                        // is only recommended for root elements created via createElement()
                        assert.logWarning(`If property ${toString(key)} decorated with @api in ${vm} is used in the template, the value ${toString(newValue)} set manually may be overridden by the template, consider binding the property only in the template.`, vm.elm);
                    }
                }
                vmBeingUpdated = null; // releasing the lock
                // not need to wrap or check the value since that is happening somewhere else
                if (set) {
                    set.call(this, reactiveMembrane.getReadOnlyProxy(newValue));
                }
                else if (process.env.NODE_ENV !== 'production') {
                    assert.fail(`Invalid attempt to set a new value for property ${toString(key)} of ${vm} that does not has a setter decorated with @api.`);
                }
            },
            enumerable,
        };
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const EspecialTagAndPropMap = create(null, {
        input: { value: create(null, { value: { value: 1 }, checked: { value: 1 } }) },
        select: { value: create(null, { value: { value: 1 } }) },
        textarea: { value: create(null, { value: { value: 1 } }) },
    });
    function isLiveBindingProp(sel, key) {
        // For special whitelisted properties (e.g., `checked` and `value`), we
        // check against the actual property value on the DOM element instead of
        // relying on tracked property values.
        return (hasOwnProperty.call(EspecialTagAndPropMap, sel) &&
            hasOwnProperty.call(EspecialTagAndPropMap[sel], key));
    }
    function update(oldVnode, vnode) {
        const props = vnode.data.props;
        if (isUndefined(props)) {
            return;
        }
        const oldProps = oldVnode.data.props;
        if (oldProps === props) {
            return;
        }
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(isUndefined(oldProps) || keys(oldProps).join(',') === keys(props).join(','), 'vnode.data.props cannot change shape.');
        }
        const elm = vnode.elm;
        const vm = getInternalField(elm, ViewModelReflection);
        const isFirstPatch = isUndefined(oldProps);
        const isCustomElement = !isUndefined(vm);
        const { sel } = vnode;
        for (const key in props) {
            const cur = props[key];
            if (process.env.NODE_ENV !== 'production') {
                if (!(key in elm)) {
                    // TODO: this should never really happen because the compiler should always validate
                    assert.fail(`Unknown public property "${key}" of element <${sel}>. This is likely a typo on the corresponding attribute "${getAttrNameFromPropName(key)}".`);
                }
            }
            // if it is the first time this element is patched, or the current value is different to the previous value...
            if (isFirstPatch || cur !== (isLiveBindingProp(sel, key) ? elm[key] : oldProps[key])) {
                if (isCustomElement) {
                    prepareForPropUpdate(vm); // this is just in case the vnode is actually a custom element
                }
                elm[key] = cur;
            }
        }
    }
    const emptyVNode$1 = { data: {} };
    var modProps = {
        create: (vnode) => update(emptyVNode$1, vnode),
        update,
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const classNameToClassMap = create(null);
    function getMapFromClassName(className) {
        // Intentionally using == to match undefined and null values from computed style attribute
        if (className == null) {
            return EmptyObject;
        }
        // computed class names must be string
        className = isString(className) ? className : className + '';
        let map = classNameToClassMap[className];
        if (map) {
            return map;
        }
        map = create(null);
        let start = 0;
        let o;
        const len = className.length;
        for (o = 0; o < len; o++) {
            if (StringCharCodeAt.call(className, o) === SPACE_CHAR) {
                if (o > start) {
                    map[StringSlice.call(className, start, o)] = true;
                }
                start = o + 1;
            }
        }
        if (o > start) {
            map[StringSlice.call(className, start, o)] = true;
        }
        classNameToClassMap[className] = map;
        if (process.env.NODE_ENV !== 'production') {
            // just to make sure that this object never changes as part of the diffing algo
            freeze(map);
        }
        return map;
    }
    function updateClassAttribute(oldVnode, vnode) {
        const { elm, data: { className: newClass } } = vnode;
        const { data: { className: oldClass } } = oldVnode;
        if (oldClass === newClass) {
            return;
        }
        const { classList } = elm;
        const newClassMap = getMapFromClassName(newClass);
        const oldClassMap = getMapFromClassName(oldClass);
        let name;
        for (name in oldClassMap) {
            // remove only if it is not in the new class collection and it is not set from within the instance
            if (isUndefined(newClassMap[name])) {
                classList.remove(name);
            }
        }
        for (name in newClassMap) {
            if (isUndefined(oldClassMap[name])) {
                classList.add(name);
            }
        }
    }
    const emptyVNode$2 = { data: {} };
    var modComputedClassName = {
        create: (vnode) => updateClassAttribute(emptyVNode$2, vnode),
        update: updateClassAttribute
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // The style property is a string when defined via an expression in the template.
    function updateStyleAttribute(oldVnode, vnode) {
        const { style: newStyle } = vnode.data;
        if (oldVnode.data.style === newStyle) {
            return;
        }
        const elm = vnode.elm;
        const { style } = elm;
        if (!isString(newStyle) || newStyle === '') {
            removeAttribute.call(elm, 'style');
        }
        else {
            style.cssText = newStyle;
        }
    }
    const emptyVNode$3 = { data: {} };
    var modComputedStyle = {
        create: (vnode) => updateStyleAttribute(emptyVNode$3, vnode),
        update: updateStyleAttribute,
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // The HTML class property becomes the vnode.data.classMap object when defined as a string in the template.
    // The compiler takes care of transforming the inline classnames into an object. It's faster to set the
    // different classnames properties individually instead of via a string.
    function createClassAttribute(vnode) {
        const { elm, data: { classMap } } = vnode;
        if (isUndefined(classMap)) {
            return;
        }
        const { classList } = elm;
        for (const name in classMap) {
            classList.add(name);
        }
    }
    var modStaticClassName = {
        create: createClassAttribute,
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // The HTML style property becomes the vnode.data.styleMap object when defined as a string in the template.
    // The compiler takes care of transforming the inline style into an object. It's faster to set the
    // different style properties individually instead of via a string.
    function createStyleAttribute(vnode) {
        const { elm, data: { styleMap } } = vnode;
        if (isUndefined(styleMap)) {
            return;
        }
        const { style } = elm;
        for (const name in styleMap) {
            style[name] = styleMap[name];
        }
    }
    var modStaticStyle = {
        create: createStyleAttribute,
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function createContext(vnode) {
        const { data: { context } } = vnode;
        if (isUndefined(context)) {
            return;
        }
        const elm = vnode.elm;
        const vm = getInternalField(elm, ViewModelReflection);
        if (!isUndefined(vm)) {
            assign(vm.context, context);
        }
    }
    const contextModule = {
        create: createContext,
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    /**
    @license
    Copyright (c) 2015 Simon Friis Vindum.
    This code may only be used under the MIT License found at
    https://github.com/snabbdom/snabbdom/blob/master/LICENSE
    Code distributed by Snabbdom as part of the Snabbdom project at
    https://github.com/snabbdom/snabbdom/
    */
    function isUndef(s) {
        return s === undefined;
    }
    function sameVnode(vnode1, vnode2) {
        return (vnode1.key === vnode2.key &&
            vnode1.sel === vnode2.sel);
    }
    function isVNode(vnode) {
        return vnode != null;
    }
    function createKeyToOldIdx(children, beginIdx, endIdx) {
        const map = {};
        let j, key, ch;
        // TODO: simplify this by assuming that all vnodes has keys
        for (j = beginIdx; j <= endIdx; ++j) {
            ch = children[j];
            if (isVNode(ch)) {
                key = ch.key;
                if (key !== undefined) {
                    map[key] = j;
                }
            }
        }
        return map;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (isVNode(ch)) {
                ch.hook.create(ch);
                ch.hook.insert(ch, parentElm, before);
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            // text nodes do not have logic associated to them
            if (isVNode(ch)) {
                ch.hook.remove(ch, parentElm);
            }
        }
    }
    function updateDynamicChildren(parentElm, oldCh, newCh) {
        let oldStartIdx = 0;
        let newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndIdx = newCh.length - 1;
        let newStartVnode = newCh[0];
        let newEndVnode = newCh[newEndIdx];
        let oldKeyToIdx;
        let idxInOld;
        let elmToMove;
        let before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (!isVNode(oldStartVnode)) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (!isVNode(oldEndVnode)) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (!isVNode(newStartVnode)) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (!isVNode(newEndVnode)) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode);
                newEndVnode.hook.move(oldStartVnode, parentElm, 
                // TODO: resolve this, but using dot notation for nextSibling for now
                oldEndVnode.elm.nextSibling);
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode);
                newStartVnode.hook.move(oldEndVnode, parentElm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    // New element
                    newStartVnode.hook.create(newStartVnode);
                    newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (isVNode(elmToMove)) {
                        if (elmToMove.sel !== newStartVnode.sel) {
                            // New element
                            newStartVnode.hook.create(newStartVnode);
                            newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
                        }
                        else {
                            patchVnode(elmToMove, newStartVnode);
                            oldCh[idxInOld] = undefined;
                            newStartVnode.hook.move(elmToMove, parentElm, oldStartVnode.elm);
                        }
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            if (oldStartIdx > oldEndIdx) {
                const n = newCh[newEndIdx + 1];
                before = isVNode(n) ? n.elm : null;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
            }
            else {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
    }
    function updateStaticChildren(parentElm, oldCh, newCh) {
        const { length } = newCh;
        if (oldCh.length === 0) {
            // the old list is empty, we can directly insert anything new
            addVnodes(parentElm, null, newCh, 0, length);
            return;
        }
        // if the old list is not empty, the new list MUST have the same
        // amount of nodes, that's why we call this static children
        let referenceElm = null;
        for (let i = length - 1; i >= 0; i -= 1) {
            const vnode = newCh[i];
            const oldVNode = oldCh[i];
            if (vnode !== oldVNode) {
                if (isVNode(oldVNode)) {
                    if (isVNode(vnode)) {
                        // both vnodes must be equivalent, and se just need to patch them
                        patchVnode(oldVNode, vnode);
                        referenceElm = vnode.elm;
                    }
                    else {
                        // removing the old vnode since the new one is null
                        oldVNode.hook.remove(oldVNode, parentElm);
                    }
                }
                else if (isVNode(vnode)) { // this condition is unnecessary
                    vnode.hook.create(vnode);
                    // insert the new node one since the old one is null
                    vnode.hook.insert(vnode, parentElm, referenceElm);
                    referenceElm = vnode.elm;
                }
            }
        }
    }
    function patchVnode(oldVnode, vnode) {
        if (oldVnode !== vnode) {
            vnode.elm = oldVnode.elm;
            vnode.hook.update(oldVnode, vnode);
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    let MO = window.MutationObserver;
    // MutationObserver is not yet implemented in jsdom:
    // https://github.com/jsdom/jsdom/issues/639
    if (typeof MO === 'undefined') {
        /* tslint:disable-next-line:no-empty */
        function MutationObserverMock() { }
        MutationObserverMock.prototype = {
            observe() {
                if (process.env.NODE_ENV !== 'production') {
                    if (process.env.NODE_ENV !== 'test') {
                        throw new Error(`MutationObserver should not be mocked outside of the jest test environment`);
                    }
                }
            }
        };
        MO = window.MutationObserver = MutationObserverMock;
    }
    const MutationObserver = MO;
    const MutationObserverObserve = MutationObserver.prototype.observe;
    let { addEventListener: windowAddEventListener, removeEventListener: windowRemoveEventListener, } = window;
    /**
     * This trick to try to pick up the __lwcOriginal__ out of the intrinsic is to please
     * jsdom, who usually reuse intrinsic between different document.
     */
    // @ts-ignore jsdom
    windowAddEventListener = windowAddEventListener.__lwcOriginal__ || windowAddEventListener;
    // @ts-ignore jsdom
    windowRemoveEventListener = windowRemoveEventListener.__lwcOriginal__ || windowRemoveEventListener;

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function getTextContent(node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                const childNodes = getFilteredChildNodes(node);
                let content = '';
                for (let i = 0, len = childNodes.length; i < len; i += 1) {
                    content += getTextContent(childNodes[i]);
                }
                return content;
            default:
                return node.nodeValue;
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const Items = createFieldName('items');
    // tslint:disable-next-line:no-empty
    function StaticNodeList() {
        throw new TypeError('Illegal constructor');
    }
    StaticNodeList.prototype = create(NodeList.prototype, {
        constructor: {
            writable: true,
            configurable: true,
            value: StaticNodeList,
        },
        item: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(index) {
                return this[index];
            },
        },
        length: {
            enumerable: true,
            configurable: true,
            get() {
                return getInternalField(this, Items).length;
            },
        },
        // Iterator protocol
        forEach: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(cb, thisArg) {
                forEach.call(getInternalField(this, Items), cb, thisArg);
            },
        },
        entries: {
            writable: true,
            enumerable: true,
            configurable: true,
            value() {
                return ArrayMap.call(getInternalField(this, Items), (v, i) => [i, v]);
            },
        },
        keys: {
            writable: true,
            enumerable: true,
            configurable: true,
            value() {
                return ArrayMap.call(getInternalField(this, Items), (v, i) => i);
            },
        },
        values: {
            writable: true,
            enumerable: true,
            configurable: true,
            value() {
                return getInternalField(this, Items);
            },
        },
        [Symbol.iterator]: {
            writable: true,
            configurable: true,
            value() {
                let nextIndex = 0;
                return {
                    next: () => {
                        const items = getInternalField(this, Items);
                        return nextIndex < items.length
                            ? {
                                value: items[nextIndex++],
                                done: false,
                            }
                            : {
                                done: true,
                            };
                    },
                };
            },
        },
    });
    // prototype inheritance dance
    setPrototypeOf(StaticNodeList, NodeList);
    function createStaticNodeList(items) {
        const nodeList = create(StaticNodeList.prototype);
        setInternalField(nodeList, Items, items);
        // setting static indexes
        forEach.call(items, (item, index) => {
            defineProperty(nodeList, index, {
                value: item,
                enumerable: true,
                configurable: true,
            });
        });
        return nodeList;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const DocumentPrototypeActiveElement = getOwnPropertyDescriptor(Document.prototype, 'activeElement').get;
    const elementFromPoint = hasOwnProperty.call(Document.prototype, 'elementFromPoint') ?
        Document.prototype.elementFromPoint :
        Document.prototype.msElementFromPoint; // IE11
    const { createDocumentFragment, createElement, createElementNS, createTextNode, createComment, querySelector: querySelector$1, querySelectorAll: querySelectorAll$1, getElementById, getElementsByClassName: getElementsByClassName$1, getElementsByName, getElementsByTagName: getElementsByTagName$1, getElementsByTagNameNS: getElementsByTagNameNS$1, } = Document.prototype;

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const Items$1 = createFieldName('items');
    function isValidHTMLCollectionName(name) {
        return name !== 'length' && isNaN(name);
    }
    function getNodeHTMLCollectionName(node) {
        return node.getAttribute('id') || node.getAttribute('name');
    }
    function StaticHTMLCollection() {
        throw new TypeError('Illegal constructor');
    }
    StaticHTMLCollection.prototype = create(HTMLCollection.prototype, {
        constructor: {
            writable: true,
            configurable: true,
            value: StaticHTMLCollection,
        },
        item: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(index) {
                return this[index];
            },
        },
        length: {
            enumerable: true,
            configurable: true,
            get() {
                return getInternalField(this, Items$1).length;
            },
        },
        // https://dom.spec.whatwg.org/#dom-htmlcollection-nameditem-key
        namedItem: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(name) {
                if (isValidHTMLCollectionName(name) && this[name]) {
                    return this[name];
                }
                const items = getInternalField(this, Items$1);
                // Note: loop in reverse so that the first named item matches the named property
                for (let len = items.length - 1; len >= 0; len -= 1) {
                    const item = items[len];
                    const nodeName = getNodeHTMLCollectionName(item);
                    if (nodeName === name) {
                        return item;
                    }
                }
                return null;
            },
        },
        // Iterator protocol
        forEach: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(cb, thisArg) {
                forEach.call(getInternalField(this, Items$1), cb, thisArg);
            },
        },
        entries: {
            writable: true,
            enumerable: true,
            configurable: true,
            value() {
                return ArrayMap.call(getInternalField(this, Items$1), (v, i) => [i, v]);
            },
        },
        keys: {
            writable: true,
            enumerable: true,
            configurable: true,
            value() {
                return ArrayMap.call(getInternalField(this, Items$1), (v, i) => i);
            },
        },
        values: {
            writable: true,
            enumerable: true,
            configurable: true,
            value() {
                return getInternalField(this, Items$1);
            },
        },
        [Symbol.iterator]: {
            writable: true,
            configurable: true,
            value() {
                let nextIndex = 0;
                return {
                    next: () => {
                        const items = getInternalField(this, Items$1);
                        return nextIndex < items.length
                            ? {
                                value: items[nextIndex++],
                                done: false,
                            }
                            : {
                                done: true,
                            };
                    },
                };
            },
        },
    });
    // prototype inheritance dance
    setPrototypeOf(StaticHTMLCollection, HTMLCollection);
    function createStaticHTMLCollection(items) {
        const collection = create(StaticHTMLCollection.prototype);
        setInternalField(collection, Items$1, items);
        // setting static indexes
        forEach.call(items, (item, index) => {
            defineProperty(collection, index, {
                value: item,
                enumerable: true,
                configurable: true,
            });
        });
        return collection;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function getInnerHTML(node) {
        let s = '';
        const childNodes = getFilteredChildNodes(node);
        for (let i = 0, len = childNodes.length; i < len; i += 1) {
            s += getOuterHTML(childNodes[i]);
        }
        return s;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#escapingString
    const escapeAttrRegExp = /[&\u00A0"]/g;
    const escapeDataRegExp = /[&\u00A0<>]/g;
    const { replace, toLowerCase } = String.prototype;
    function escapeReplace(c) {
        switch (c) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case '\u00A0':
                return '&nbsp;';
        }
    }
    function escapeAttr(s) {
        return replace.call(s, escapeAttrRegExp, escapeReplace);
    }
    function escapeData(s) {
        return replace.call(s, escapeDataRegExp, escapeReplace);
    }
    // http://www.whatwg.org/specs/web-apps/current-work/#void-elements
    const voidElements = new Set([
        'AREA',
        'BASE',
        'BR',
        'COL',
        'COMMAND',
        'EMBED',
        'HR',
        'IMG',
        'INPUT',
        'KEYGEN',
        'LINK',
        'META',
        'PARAM',
        'SOURCE',
        'TRACK',
        'WBR'
    ]);
    const plaintextParents = new Set([
        'STYLE',
        'SCRIPT',
        'XMP',
        'IFRAME',
        'NOEMBED',
        'NOFRAMES',
        'PLAINTEXT',
        'NOSCRIPT'
    ]);
    function getOuterHTML(node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE: {
                const { attributes: attrs } = node;
                const tagName = tagNameGetter.call(node);
                let s = '<' + toLowerCase.call(tagName);
                for (let i = 0, attr; (attr = attrs[i]); i++) {
                    s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
                }
                s += '>';
                if (voidElements.has(tagName)) {
                    return s;
                }
                return s + getInnerHTML(node) + '</' + toLowerCase.call(tagName) + '>';
            }
            case Node.TEXT_NODE: {
                const { data, parentNode } = node;
                if (parentNode instanceof Element && plaintextParents.has(tagNameGetter.call(parentNode))) {
                    return data;
                }
                return escapeData(data);
            }
            case Node.COMMENT_NODE: {
                return '<!--' + node.data + '-->';
            }
            default: {
                throw new Error();
            }
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    /**
    @license
    Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
    Code distributed by Google as part of the polymer project is also
    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
    */
    function pathComposer(startNode, composed) {
        const composedPath = [];
        let current = startNode;
        const startRoot = startNode === window ? window : getRootNodeGetter.call(startNode);
        while (current) {
            composedPath.push(current);
            if (current.assignedSlot) {
                current = current.assignedSlot;
            }
            else if (current.nodeType === DOCUMENT_FRAGMENT_NODE && current.host && (composed || current !== startRoot)) {
                current = current.host;
            }
            else {
                current = current.parentNode;
            }
        }
        // event composedPath includes window when startNode's ownerRoot is document
        if (composedPath[composedPath.length - 1] === document) {
            composedPath.push(window);
        }
        return composedPath;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    /**
    @license
    Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
    The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
    The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
    Code distributed by Google as part of the polymer project is also
    subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
    */
    function retarget(refNode, path) {
        // If ANCESTOR's root is not a shadow root or ANCESTOR's root is BASE's
        // shadow-including inclusive ancestor, return ANCESTOR.
        const refNodePath = pathComposer(refNode, true);
        const p$ = path;
        for (let i = 0, ancestor, lastRoot, root, rootIdx; i < p$.length; i++) {
            ancestor = p$[i];
            root = ancestor === window ? window : getRootNodeGetter.call(ancestor);
            if (root !== lastRoot) {
                rootIdx = refNodePath.indexOf(root);
                lastRoot = root;
            }
            if (!(root instanceof SyntheticShadowRoot) || rootIdx > -1) {
                return ancestor;
            }
        }
        return null;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const HostKey = createFieldName('host');
    const ShadowRootKey = createFieldName('shadowRoot');
    const { createDocumentFragment: createDocumentFragment$1 } = document;
    function isDelegatingFocus(host) {
        const shadowRoot = getShadowRoot(host);
        return shadowRoot.delegatesFocus;
    }
    function getHost(root) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(root[HostKey], `A 'ShadowRoot' node must be attached to an 'HTMLElement' node.`);
        }
        return root[HostKey];
    }
    function getShadowRoot(elm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(getInternalField(elm, ShadowRootKey), `A Custom Element with a shadow attached must be provided as the first argument.`);
        }
        return getInternalField(elm, ShadowRootKey);
    }
    function attachShadow(elm, options) {
        if (getInternalField(elm, ShadowRootKey)) {
            throw new Error(`Failed to execute 'attachShadow' on 'Element': Shadow root cannot be created on a host which already hosts a shadow tree.`);
        }
        const { mode, delegatesFocus } = options;
        // creating a real fragment for shadowRoot instance
        const sr = createDocumentFragment$1.call(document);
        defineProperty(sr, 'mode', {
            get() { return mode; },
            configurable: true,
            enumerable: true,
        });
        defineProperty(sr, 'delegatesFocus', {
            get() { return !!delegatesFocus; },
            configurable: true,
            enumerable: true,
        });
        // correcting the proto chain
        setPrototypeOf(sr, SyntheticShadowRoot.prototype);
        setInternalField(sr, HostKey, elm);
        setInternalField(elm, ShadowRootKey, sr);
        // expose the shadow via a hidden symbol for testing purposes
        if (process.env.NODE_ENV === 'test') {
            elm['$$ShadowRoot$$'] = sr; // tslint:disable-line
        }
        return sr;
    }
    var ShadowRootMode;
    (function (ShadowRootMode) {
        ShadowRootMode["CLOSED"] = "closed";
        ShadowRootMode["OPEN"] = "open";
    })(ShadowRootMode || (ShadowRootMode = {}));
    const SyntheticShadowRootDescriptors = {
        constructor: {
            writable: true,
            configurable: true,
            value: SyntheticShadowRoot,
        },
        toString: {
            writable: true,
            configurable: true,
            value() {
                return `[object ShadowRoot]`;
            },
        },
    };
    const ShadowRootDescriptors = {
        activeElement: {
            enumerable: true,
            configurable: true,
            get() {
                const activeElement = DocumentPrototypeActiveElement.call(document);
                if (isNull(activeElement)) {
                    return activeElement;
                }
                const host = getHost(this);
                if ((compareDocumentPosition.call(host, activeElement) &
                    DOCUMENT_POSITION_CONTAINED_BY) ===
                    0) {
                    return null;
                }
                // activeElement must be child of the host and owned by it
                let node = activeElement;
                while (!isNodeOwnedBy(host, node)) {
                    node = parentElementGetter.call(node);
                }
                // If we have a slot element here that means that we were dealing
                // with an element that was passed to one of our slots. In this
                // case, activeElement returns null.
                if (isSlotElement(node)) {
                    return null;
                }
                return node;
            },
        },
        delegatesFocus: {
            enumerable: true,
            configurable: true,
            get() {
                return false;
            },
        },
        elementFromPoint: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(left, top) {
                const element = elementFromPoint.call(document, left, top);
                if (isNull(element)) {
                    return element;
                }
                return retarget(this, pathComposer(element, true));
            },
        },
        elementsFromPoint: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(left, top) {
                throw new Error();
            },
        },
        getSelection: {
            writable: true,
            enumerable: true,
            configurable: true,
            value() {
                throw new Error();
            },
        },
        host: {
            enumerable: true,
            configurable: true,
            get() {
                return getHost(this);
            },
        },
        mode: {
            configurable: true,
            get() {
                return ShadowRootMode.OPEN;
            },
        },
        styleSheets: {
            enumerable: true,
            configurable: true,
            get() {
                throw new Error();
            },
        },
    };
    const NodePatchDescriptors = {
        addEventListener: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(type, listener, options) {
                addShadowRootEventListener(this, type, listener, options);
            },
        },
        removeEventListener: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(type, listener, options) {
                removeShadowRootEventListener(this, type, listener, options);
            },
        },
        baseURI: {
            enumerable: true,
            configurable: true,
            get() {
                return getHost(this).baseURI;
            },
        },
        childNodes: {
            enumerable: true,
            configurable: true,
            get() {
                return createStaticNodeList(shadowRootChildNodes(this));
            },
        },
        compareDocumentPosition: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(otherNode) {
                const host = getHost(this);
                if (this === otherNode) {
                    // it is the root itself
                    return 0;
                }
                if (this.contains(otherNode)) {
                    // it belongs to the shadow root instance
                    return 20; // 10100 === DOCUMENT_POSITION_FOLLOWING & DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                }
                else if (compareDocumentPosition.call(host, otherNode) & DOCUMENT_POSITION_CONTAINED_BY) {
                    // it is a child element but does not belong to the shadow root instance
                    return 37; // 100101 === DOCUMENT_POSITION_DISCONNECTED & DOCUMENT_POSITION_FOLLOWING & DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                }
                else {
                    // it is not a descendant
                    return 35; // 100011 === DOCUMENT_POSITION_DISCONNECTED & DOCUMENT_POSITION_PRECEDING & DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                }
            },
        },
        contains: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(otherNode) {
                const host = getHost(this);
                // must be child of the host and owned by it.
                return ((compareDocumentPosition.call(host, otherNode) & DOCUMENT_POSITION_CONTAINED_BY) !==
                    0 && isNodeOwnedBy(host, otherNode));
            },
        },
        firstChild: {
            enumerable: true,
            configurable: true,
            get() {
                const childNodes = getInternalChildNodes(this);
                return childNodes[0] || null;
            },
        },
        lastChild: {
            enumerable: true,
            configurable: true,
            get() {
                const childNodes = getInternalChildNodes(this);
                return childNodes[childNodes.length - 1] || null;
            },
        },
        hasChildNodes: {
            writable: true,
            enumerable: true,
            configurable: true,
            value() {
                const childNodes = getInternalChildNodes(this);
                return childNodes.length > 0;
            },
        },
        isConnected: {
            enumerable: true,
            configurable: true,
            get() {
                return ((compareDocumentPosition.call(document, getHost(this)) &
                    DOCUMENT_POSITION_CONTAINED_BY) !==
                    0);
            },
        },
        nextSibling: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
        previousSibling: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
        nodeName: {
            enumerable: true,
            configurable: true,
            get() {
                return '#document-fragment';
            },
        },
        nodeType: {
            enumerable: true,
            configurable: true,
            get() {
                return 11; // Node.DOCUMENT_FRAGMENT_NODE
            },
        },
        nodeValue: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
        ownerDocument: {
            enumerable: true,
            configurable: true,
            get() {
                return getHost(this).ownerDocument;
            },
        },
        parentElement: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
        parentNode: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
        textContent: {
            enumerable: true,
            configurable: true,
            get() {
                const childNodes = getInternalChildNodes(this);
                let textContent = '';
                for (let i = 0, len = childNodes.length; i < len; i += 1) {
                    textContent += getTextContent(childNodes[i]);
                }
                return textContent;
            },
        },
        getRootNode: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(options) {
                return getRootNodeGetter.call(this, options);
            },
        },
    };
    const ElementPatchDescriptors = {
        innerHTML: {
            enumerable: true,
            configurable: true,
            get() {
                const childNodes = getInternalChildNodes(this);
                let innerHTML = '';
                for (let i = 0, len = childNodes.length; i < len; i += 1) {
                    innerHTML += getOuterHTML(childNodes[i]);
                }
                return innerHTML;
            },
        },
        localName: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
        namespaceURI: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
        nextElementSibling: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
        previousElementSibling: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
        prefix: {
            enumerable: true,
            configurable: true,
            get() {
                return null;
            },
        },
    };
    const ParentNodePatchDescriptors = {
        childElementCount: {
            enumerable: true,
            configurable: true,
            get() {
                return this.children.length;
            },
        },
        children: {
            enumerable: true,
            configurable: true,
            get() {
                return createStaticHTMLCollection(ArrayFilter.call(shadowRootChildNodes(this), (elm) => elm instanceof Element));
            },
        },
        firstElementChild: {
            enumerable: true,
            configurable: true,
            get() {
                return this.children[0] || null;
            },
        },
        lastElementChild: {
            enumerable: true,
            configurable: true,
            get() {
                const { children } = this;
                return children.item(children.length - 1) || null;
            },
        },
        querySelector: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(selectors) {
                return shadowRootQuerySelector(this, selectors);
            },
        },
        querySelectorAll: {
            writable: true,
            enumerable: true,
            configurable: true,
            value(selectors) {
                return createStaticNodeList(shadowRootQuerySelectorAll(this, selectors));
            },
        },
    };
    assign(SyntheticShadowRootDescriptors, NodePatchDescriptors, ParentNodePatchDescriptors, ElementPatchDescriptors, ShadowRootDescriptors);
    function SyntheticShadowRoot() {
        throw new TypeError('Illegal constructor');
    }
    SyntheticShadowRoot.prototype = create(DocumentFragment.prototype, SyntheticShadowRootDescriptors);
    // Is native ShadowDom is available on window,
    // we need to make sure that our synthetic shadow dom
    // passed instanceof checks against window.ShadowDom
    if (isNativeShadowRootAvailable) {
        setPrototypeOf(SyntheticShadowRoot.prototype, window.ShadowRoot.prototype);
    }
    /**
     * This method is only intended to be used in non-production mode in IE11
     * and its role is to produce a 1-1 mapping between a shadowRoot instance
     * and a comment node that is intended to use to trick the IE11 DevTools
     * to show the content of the shadowRoot in the DOM Explorer.
     */
    function getIE11FakeShadowRootPlaceholder(host) {
        const shadowRoot = getInternalField(host, ShadowRootKey);
        // @ts-ignore this $$placeholder$$ is not a security issue because you must
        // have access to the shadowRoot in order to extract the fake node, which give
        // you access to the same childNodes of the shadowRoot, so, who cares.
        let c = shadowRoot.$$placeholder$$;
        if (!isUndefined(c)) {
            return c;
        }
        // @ts-ignore $$placeholder$$ is fine, read the node above.
        c = shadowRoot.$$placeholder$$ = createComment.call(document, '');
        defineProperties(c, {
            childNodes: {
                get() {
                    return shadowRoot.childNodes;
                },
                enumerable: true,
                configurable: true,
            },
            tagName: {
                get() {
                    return `#shadow-root (${shadowRoot.mode})`;
                },
                enumerable: true,
                configurable: true,
            }
        });
        return c;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // DO NOT CHANGE this:
    // these two values need to be in sync with framework/vm.ts
    const OwnerKey = '$$OwnerKey$$';
    const OwnKey = '$$OwnKey$$';
    const hasNativeSymbolsSupport$1 = Symbol('x').toString() === 'Symbol(x)';
    function getNodeOwnerKey(node) {
        return node[OwnerKey];
    }
    function setNodeOwnerKey(node, key) {
        node[OwnerKey] = key;
    }
    function getNodeNearestOwnerKey(node) {
        let ownerNode = node;
        let ownerKey;
        // search for the first element with owner identity (just in case of manually inserted elements)
        while (!isNull(ownerNode)) {
            ownerKey = ownerNode[OwnerKey];
            if (!isUndefined(ownerKey)) {
                return ownerKey;
            }
            ownerNode = parentNodeGetter.call(ownerNode);
        }
    }
    function getNodeKey(node) {
        return node[OwnKey];
    }
    const portals = new WeakMap();
    // We can use a single observer without having to worry about leaking because
    // "Registered observers in a node’s registered observer list have a weak
    // reference to the node."
    // https://dom.spec.whatwg.org/#garbage-collection
    let portalObserver;
    const portalObserverConfig = {
        childList: true,
        subtree: true,
    };
    function patchPortalElement(node, ownerKey, shadowToken) {
        // If node already has an ownerKey, we can skip
        // Note: checking if a node as any ownerKey is not enough
        // because this element could be moved from one
        // shadow to another
        if (getNodeOwnerKey(node) === ownerKey) {
            return;
        }
        setNodeOwnerKey(node, ownerKey);
        if (node instanceof Element) {
            setCSSToken(node, shadowToken);
            const childNodes = getInternalChildNodes(node);
            for (let i = 0, len = childNodes.length; i < len; i += 1) {
                const child = childNodes[i];
                patchPortalElement(child, ownerKey, shadowToken);
            }
        }
    }
    function initPortalObserver() {
        return new MutationObserver(mutations => {
            forEach.call(mutations, mutation => {
                const { target: elm, addedNodes } = mutation;
                const ownerKey = getNodeOwnerKey(elm);
                const shadowToken = getCSSToken(elm);
                // OwnerKey might be undefined at this point.
                // We used to throw an error here, but we need to return early instead.
                //
                // This routine results in a mutation target that will have no key
                // because its been removed by the time the observer runs
                // const div = document.createElement('div');
                // div.innerHTML = '<span>span</span>';
                // const span = div.querySelector('span');
                // manualElement.appendChild(div);
                // span.textContent = '';
                // span.parentNode.removeChild(span);
                if (isUndefined(ownerKey)) {
                    return;
                }
                for (let i = 0, len = addedNodes.length; i < len; i += 1) {
                    const node = addedNodes[i];
                    patchPortalElement(node, ownerKey, shadowToken);
                }
            });
        });
    }
    const ShadowTokenKey = '$$ShadowTokenKey$$';
    function setCSSToken(elm, shadowToken) {
        if (!isUndefined(shadowToken)) {
            setAttribute.call(elm, shadowToken, '');
            elm[ShadowTokenKey] = shadowToken;
        }
    }
    function getCSSToken(elm) {
        return elm[ShadowTokenKey];
    }
    function markElementAsPortal(elm) {
        portals.set(elm, 1);
        if (!portalObserver) {
            portalObserver = initPortalObserver();
        }
        // install mutation observer for portals
        MutationObserverObserve.call(portalObserver, elm, portalObserverConfig);
    }
    function getShadowParent(node, value) {
        const owner = getNodeOwner(node);
        if (value === owner) {
            // walking up via parent chain might end up in the shadow root element
            return getShadowRoot(owner);
        }
        else if (value instanceof Element) {
            if (getNodeNearestOwnerKey(node) === getNodeNearestOwnerKey(value)) {
                // the element and its parent node belong to the same shadow root
                return value;
            }
            else if (!isNull(owner) && isSlotElement(value)) {
                // slotted elements must be top level childNodes of the slot element
                // where they slotted into, but its shadowed parent is always the
                // owner of the slot.
                const slotOwner = getNodeOwner(value);
                if (!isNull(slotOwner) && isNodeOwnedBy(owner, slotOwner)) {
                    // it is a slotted element, and therefore its parent is always going to be the host of the slot
                    return slotOwner;
                }
            }
        }
        return null;
    }
    function PatchedNode(node) {
        const Ctor = getPrototypeOf(node).constructor;
        class PatchedNodeClass {
            constructor() {
                // Patched classes are not supposed to be instantiated directly, ever!
                throw new TypeError('Illegal constructor');
            }
            hasChildNodes() {
                return getInternalChildNodes(this).length > 0;
            }
            // @ts-ignore until ts@3.x
            get firstChild() {
                const childNodes = getInternalChildNodes(this);
                // @ts-ignore until ts@3.x
                return childNodes[0] || null;
            }
            // @ts-ignore until ts@3.x
            get lastChild() {
                const childNodes = getInternalChildNodes(this);
                // @ts-ignore until ts@3.x
                return childNodes[childNodes.length - 1] || null;
            }
            get textContent() {
                return getTextContent(this);
            }
            set textContent(value) {
                textContextSetter.call(this, value);
            }
            get childElementCount() {
                return this.children.length;
            }
            get firstElementChild() {
                return this.children[0] || null;
            }
            get lastElementChild() {
                const { children } = this;
                return children.item(children.length - 1) || null;
            }
            get assignedSlot() {
                const parentNode = parentNodeGetter.call(this);
                /**
                 * if it doesn't have a parent node,
                 * or the parent is not an slot element
                 * or they both belong to the same template (default content)
                 * we should assume that it is not slotted
                 */
                if (isNull(parentNode) || !isSlotElement(parentNode) || getNodeNearestOwnerKey(parentNode) === getNodeNearestOwnerKey(this)) {
                    return null;
                }
                return parentNode;
            }
            get parentNode() {
                const value = parentNodeGetter.call(this);
                if (isNull(value)) {
                    return value;
                }
                return getShadowParent(this, value);
            }
            get parentElement() {
                const value = parentNodeGetter.call(this);
                if (isNull(value)) {
                    return null;
                }
                const parentNode = getShadowParent(this, value);
                // it could be that the parentNode is the shadowRoot, in which case
                // we need to return null.
                return parentNode instanceof Element ? parentNode : null;
            }
            getRootNode(options) {
                return getRootNodeGetter.call(this, options);
            }
            compareDocumentPosition(otherNode) {
                if (getNodeOwnerKey(this) !== getNodeOwnerKey(otherNode)) {
                    // it is from another shadow
                    return 0;
                }
                return compareDocumentPosition.call(this, otherNode);
            }
            contains(otherNode) {
                if (getNodeOwnerKey(this) !== getNodeOwnerKey(otherNode)) {
                    // it is from another shadow
                    return false;
                }
                return (compareDocumentPosition.call(this, otherNode) & DOCUMENT_POSITION_CONTAINED_BY) !== 0;
            }
            cloneNode(deep) {
                const clone = cloneNode.call(this, false);
                // Per spec, browsers only care about truthy values
                // Not strict true or false
                if (!deep) {
                    return clone;
                }
                const childNodes = getInternalChildNodes(this);
                for (let i = 0, len = childNodes.length; i < len; i += 1) {
                    clone.appendChild(childNodes[i].cloneNode(true));
                }
                return clone;
            }
        }
        // prototype inheritance dance
        setPrototypeOf(PatchedNodeClass, Ctor);
        setPrototypeOf(PatchedNodeClass.prototype, Ctor.prototype);
        return PatchedNodeClass;
    }
    let internalChildNodeAccessorFlag = false;
    /**
     * These 2 methods are providing a machinery to understand who is accessing the
     * .childNodes member property of a node. If it is used from inside the synthetic shadow
     * or from an external invoker. This helps to produce the right output in one very peculiar
     * case, the IE11 debugging comment for shadowRoot representation on the devtool.
     */
    function isExternalChildNodeAccessorFlagOn() {
        return !internalChildNodeAccessorFlag;
    }
    const getInternalChildNodes = (process.env.NODE_ENV !== 'production' && isFalse(hasNativeSymbolsSupport$1)) ?
        function (node) {
            internalChildNodeAccessorFlag = true;
            let childNodes;
            let error = null;
            try {
                childNodes = node.childNodes;
            }
            catch (e) {
                // childNodes accessor should never throw, but just in case!
                error = e;
            }
            finally {
                internalChildNodeAccessorFlag = false;
                if (!isNull(error)) {
                    // re-throwing after restoring the state machinery for setInternalChildNodeAccessorFlag
                    throw error; // tslint:disable-line
                }
            }
            return childNodes;
        } : function (node) {
        return node.childNodes;
    };

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function wrapIframeWindow(win) {
        return {
            postMessage() {
                return win.postMessage.apply(win, arguments);
            },
            blur() {
                return win.blur.apply(win, arguments);
            },
            close() {
                return win.close.apply(win, arguments);
            },
            focus() {
                return win.focus.apply(win, arguments);
            },
            get closed() {
                return win.closed;
            },
            get frames() {
                return win.frames;
            },
            get length() {
                return win.length;
            },
            get location() {
                return win.location;
            },
            set location(value) {
                win.location = value;
            },
            get opener() {
                return win.opener;
            },
            get parent() {
                return win.parent;
            },
            get self() {
                return win.self;
            },
            get top() {
                return win.top;
            },
            get window() {
                return win.window;
            },
        };
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // We can use a single observer without having to worry about leaking because
    // "Registered observers in a node’s registered observer list have a weak
    // reference to the node."
    // https://dom.spec.whatwg.org/#garbage-collection
    let observer;
    const observerConfig = { childList: true };
    const SlotChangeKey = createFieldName('slotchange');
    function initSlotObserver() {
        return new MutationObserver(mutations => {
            const slots = [];
            forEach.call(mutations, mutation => {
                if (process.env.NODE_ENV !== 'production') {
                    assert.isTrue(mutation.type === 'childList', `Invalid mutation type: ${mutation.type}. This mutation handler for slots should only handle "childList" mutations.`);
                }
                const { target: slot } = mutation;
                if (ArrayIndexOf.call(slots, slot) === -1) {
                    ArrayPush.call(slots, slot);
                    dispatchEvent.call(slot, new CustomEvent('slotchange'));
                }
            });
        });
    }
    function getFilteredSlotAssignedNodes(slot) {
        const owner = getNodeOwner(slot);
        if (isNull(owner)) {
            return [];
        }
        return ArrayReduce.call(childNodesGetter.call(slot), (seed, child) => {
            if (!isNodeOwnedBy(owner, child)) {
                ArrayPush.call(seed, child);
            }
            return seed;
        }, []);
    }
    function getFilteredSlotFlattenNodes(slot) {
        return ArrayReduce.call(childNodesGetter.call(slot), (seed, child) => {
            if (child instanceof Element && isSlotElement(child)) {
                ArrayPush.apply(seed, getFilteredSlotFlattenNodes(child));
            }
            else {
                ArrayPush.call(seed, child);
            }
            return seed;
        }, []);
    }
    function PatchedSlotElement(elm) {
        const Ctor = PatchedElement(elm);
        const { addEventListener: superAddEventListener } = elm;
        return class PatchedHTMLSlotElement extends Ctor {
            addEventListener(type, listener, options) {
                if (type === 'slotchange' && !getInternalField(this, SlotChangeKey)) {
                    if (process.env.NODE_ENV === 'test') {
                        /* tslint:disable-next-line:no-console */
                        console.warn('The "slotchange" event is not supported in our jest test environment.');
                    }
                    setInternalField(this, SlotChangeKey, true);
                    if (!observer) {
                        observer = initSlotObserver();
                    }
                    MutationObserverObserve.call(observer, this, observerConfig);
                }
                superAddEventListener.call(this, type, listener, options);
            }
            assignedElements(options) {
                const flatten = !isUndefined(options) && isTrue(options.flatten);
                const nodes = flatten ? getFilteredSlotFlattenNodes(this) : getFilteredSlotAssignedNodes(this);
                return ArrayFilter.call(nodes, node => node instanceof Element);
            }
            assignedNodes(options) {
                const flatten = !isUndefined(options) && isTrue(options.flatten);
                return flatten ? getFilteredSlotFlattenNodes(this) : getFilteredSlotAssignedNodes(this);
            }
            get name() {
                // in browsers that do not support shadow dom, slot's name attribute is not reflective
                const name = getAttribute.call(this, 'name');
                return isNull(name) ? '' : name;
            }
            get childNodes() {
                const owner = getNodeOwner(this);
                const childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
                return createStaticNodeList(childNodes);
            }
            get children() {
                // We cannot patch `children` in test mode
                // because JSDOM uses children for its "native"
                // querySelector implementation. If we patch this,
                // HTMLElement.prototype.querySelector.call(element) will not
                // return any elements from shadow, which is not what we want
                if (process.env.NODE_ENV === 'test') {
                    return childrenGetter.call(this);
                }
                const owner = getNodeOwner(this);
                const childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
                return createStaticHTMLCollection(ArrayFilter.call(childNodes, (node) => node instanceof Element));
            }
        };
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function getNodeOwner(node) {
        if (!(node instanceof Node)) {
            return null;
        }
        const ownerKey = getNodeNearestOwnerKey(node);
        if (isUndefined(ownerKey)) {
            return null;
        }
        let nodeOwner = node;
        // At this point, node is a valid node with owner identity, now we need to find the owner node
        // search for a custom element with a VM that owns the first element with owner identity attached to it
        while (!isNull(nodeOwner) && (getNodeKey(nodeOwner) !== ownerKey)) {
            nodeOwner = parentNodeGetter.call(nodeOwner);
        }
        if (isNull(nodeOwner)) {
            return null;
        }
        return nodeOwner;
    }
    function isSlotElement(elm) {
        return tagNameGetter.call(elm) === 'SLOT';
    }
    function isNodeOwnedBy(owner, node) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(owner instanceof HTMLElement, `isNodeOwnedBy() should be called with an element as the first argument instead of ${owner}`);
            assert.invariant(node instanceof Node, `isNodeOwnedBy() should be called with a node as the second argument instead of ${node}`);
            assert.isTrue(compareDocumentPosition.call(node, owner) & DOCUMENT_POSITION_CONTAINS, `isNodeOwnedBy() should never be called with a node that is not a child node of ${owner}`);
        }
        const ownerKey = getNodeNearestOwnerKey(node);
        return isUndefined(ownerKey) || getNodeKey(owner) === ownerKey;
    }
    // when finding a slot in the DOM, we can fold it if it is contained
    // inside another slot.
    function foldSlotElement(slot) {
        let parent = parentElementGetter.call(slot);
        while (!isNull(parent) && isSlotElement(parent)) {
            slot = parent;
            parent = parentElementGetter.call(slot);
        }
        return slot;
    }
    function isNodeSlotted(host, node) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(host instanceof HTMLElement, `isNodeSlotted() should be called with a host as the first argument instead of ${host}`);
            assert.invariant(node instanceof Node, `isNodeSlotted() should be called with a node as the second argument instead of ${node}`);
            assert.isTrue(compareDocumentPosition.call(node, host) & DOCUMENT_POSITION_CONTAINS, `isNodeSlotted() should never be called with a node that is not a child node of ${host}`);
        }
        const hostKey = getNodeKey(host);
        // this routine assumes that the node is coming from a different shadow (it is not owned by the host)
        // just in case the provided node is not an element
        let currentElement = node instanceof Element ? node : parentElementGetter.call(node);
        while (!isNull(currentElement) && currentElement !== host) {
            const elmOwnerKey = getNodeNearestOwnerKey(currentElement);
            const parent = parentElementGetter.call(currentElement);
            if (elmOwnerKey === hostKey) {
                // we have reached an element inside the host's template, and only if
                // that element is an slot, then the node is considered slotted
                // TODO: add the examples
                return isSlotElement(currentElement);
            }
            else if (parent === host) {
                return false;
            }
            else if (!isNull(parent) && getNodeNearestOwnerKey(parent) !== elmOwnerKey) {
                // we are crossing a boundary of some sort since the elm and its parent
                // have different owner key. for slotted elements, this is possible
                // if the parent happens to be a slot.
                if (isSlotElement(parent)) {
                    /**
                     * the slot parent might be allocated inside another slot, think of:
                     * <x-root> (<--- root element)
                     *    <x-parent> (<--- own by x-root)
                     *       <x-child> (<--- own by x-root)
                     *           <slot> (<--- own by x-child)
                     *               <slot> (<--- own by x-parent)
                     *                  <div> (<--- own by x-root)
                     *
                     * while checking if x-parent has the div slotted, we need to traverse
                     * up, but when finding the first slot, we skip that one in favor of the
                     * most outer slot parent before jumping into its corresponding host.
                     */
                    currentElement = getNodeOwner(foldSlotElement(parent));
                    if (!isNull(currentElement)) {
                        if (currentElement === host) {
                            // the slot element is a top level element inside the shadow
                            // of a host that was allocated into host in question
                            return true;
                        }
                        else if (getNodeNearestOwnerKey(currentElement) === hostKey) {
                            // the slot element is an element inside the shadow
                            // of a host that was allocated into host in question
                            return true;
                        }
                    }
                }
                else {
                    return false;
                }
            }
            else {
                currentElement = parent;
            }
        }
        return false;
    }
    function shadowRootChildNodes(root) {
        const elm = getHost(root);
        return getAllMatches(elm, childNodesGetter.call(elm));
    }
    function getAllMatches(owner, nodeList) {
        const filteredAndPatched = [];
        for (let i = 0, len = nodeList.length; i < len; i += 1) {
            const node = nodeList[i];
            const isOwned = isNodeOwnedBy(owner, node);
            if (isOwned) {
                // Patch querySelector, querySelectorAll, etc
                // if element is owned by VM
                ArrayPush.call(filteredAndPatched, node);
            }
        }
        return filteredAndPatched;
    }
    function getRoot(node) {
        const ownerNode = getNodeOwner(node);
        if (isNull(ownerNode)) {
            // we hit a wall, is not in lwc boundary.
            return getShadowIncludingRoot(node);
        }
        // @ts-ignore: Attributes property is removed from Node (https://developer.mozilla.org/en-US/docs/Web/API/Node)
        return getShadowRoot(ownerNode);
    }
    function getShadowIncludingRoot(node) {
        let nodeParent;
        while (!isNull(nodeParent = parentNodeGetter.call(node))) {
            node = nodeParent;
        }
        return node;
    }
    /**
     * Dummy implementation of the Node.prototype.getRootNode.
     * Spec: https://dom.spec.whatwg.org/#dom-node-getrootnode
     *
     * TODO: Once we start using the real shadowDOM, this method should be replaced by:
     * const { getRootNode } = Node.prototype;
     */
    function getRootNodeGetter(options) {
        const composed = isUndefined(options) ? false : !!options.composed;
        return isTrue(composed) ?
            getShadowIncludingRoot(this) :
            getRoot(this);
    }
    function getFirstMatch(owner, nodeList) {
        for (let i = 0, len = nodeList.length; i < len; i += 1) {
            if (isNodeOwnedBy(owner, nodeList[i])) {
                return nodeList[i];
            }
        }
        return null;
    }
    function getAllSlottedMatches(host, nodeList) {
        const filteredAndPatched = [];
        for (let i = 0, len = nodeList.length; i < len; i += 1) {
            const node = nodeList[i];
            if (!isNodeOwnedBy(host, node) && isNodeSlotted(host, node)) {
                ArrayPush.call(filteredAndPatched, node);
            }
        }
        return filteredAndPatched;
    }
    function getFirstSlottedMatch(host, nodeList) {
        for (let i = 0, len = nodeList.length; i < len; i += 1) {
            const node = nodeList[i];
            if (!isNodeOwnedBy(host, node) && isNodeSlotted(host, node)) {
                return node;
            }
        }
        return null;
    }
    function lightDomQuerySelectorAll(elm, selectors) {
        const owner = getNodeOwner(elm);
        if (isNull(owner)) {
            return [];
        }
        const nodeList = querySelectorAll.call(elm, selectors);
        if (getNodeKey(elm)) {
            // it is a custom element, and we should then filter by slotted elements
            return getAllSlottedMatches(elm, nodeList);
        }
        else {
            // regular element, we should then filter by ownership
            return getAllMatches(owner, nodeList);
        }
    }
    function lightDomQuerySelector(elm, selector) {
        const owner = getNodeOwner(elm);
        if (isNull(owner)) {
            // the it is a root, and those can't have a lightdom
            return null;
        }
        const nodeList = querySelectorAll.call(elm, selector);
        if (getNodeKey(elm)) {
            // it is a custom element, and we should then filter by slotted elements
            return getFirstSlottedMatch(elm, nodeList);
        }
        else {
            // regular element, we should then filter by ownership
            return getFirstMatch(owner, nodeList);
        }
    }
    function shadowRootQuerySelector(root, selector) {
        const elm = getHost(root);
        const nodeList = querySelectorAll.call(elm, selector);
        return getFirstMatch(elm, nodeList);
    }
    function shadowRootQuerySelectorAll(root, selector) {
        const elm = getHost(root);
        const nodeList = querySelectorAll.call(elm, selector);
        return getAllMatches(elm, nodeList);
    }
    function getFilteredChildNodes(node) {
        let children;
        if (!isUndefined(getNodeKey(node))) {
            // node itself is a custom element
            // lwc element, in which case we need to get only the nodes
            // that were slotted
            const slots = querySelectorAll.call(node, 'slot');
            children = ArrayReduce.call(slots, (seed, slot) => {
                if (isNodeOwnedBy(node, slot)) {
                    ArrayPush.apply(seed, getFilteredSlotAssignedNodes(slot));
                }
                return seed;
            }, []);
        }
        else {
            // regular element
            children = childNodesGetter.call(node);
        }
        const owner = getNodeOwner(node);
        if (isNull(owner)) {
            return [];
        }
        return ArrayReduce.call(children, (seed, child) => {
            if (isNodeOwnedBy(owner, child)) {
                ArrayPush.call(seed, child);
            }
            return seed;
        }, []);
    }
    function PatchedElement(elm) {
        const Ctor = PatchedNode(elm);
        // @ts-ignore type-mismatch
        return class PatchedHTMLElement extends Ctor {
            querySelector(selector) {
                return lightDomQuerySelector(this, selector);
            }
            querySelectorAll(selectors) {
                return createStaticNodeList(lightDomQuerySelectorAll(this, selectors));
            }
            get innerHTML() {
                const childNodes = getInternalChildNodes(this);
                let innerHTML = '';
                for (let i = 0, len = childNodes.length; i < len; i += 1) {
                    innerHTML += getOuterHTML(childNodes[i]);
                }
                return innerHTML;
            }
            set innerHTML(value) {
                innerHTMLSetter.call(this, value);
            }
            get outerHTML() {
                return getOuterHTML(this);
            }
        };
    }
    function PatchedIframeElement(elm) {
        const Ctor = PatchedElement(elm);
        return class PatchedHTMLIframeElement extends Ctor {
            get contentWindow() {
                const original = iFrameContentWindowGetter.call(this);
                if (original) {
                    return wrapIframeWindow(original);
                }
                return original;
            }
        };
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function doesEventNeedsPatch(e) {
        const originalTarget = eventTargetGetter.call(e);
        if (originalTarget instanceof Node) {
            if ((compareDocumentPosition.call(document, originalTarget) & DOCUMENT_POSITION_CONTAINED_BY) !== 0 && getNodeOwnerKey(originalTarget)) {
                return true;
            }
        }
        return false;
    }
    function getEventListenerWrapper(fnOrObj) {
        let wrapperFn = null;
        try {
            wrapperFn = fnOrObj.$$lwcEventWrapper$$;
            if (!wrapperFn) {
                const isHandlerFunction = typeof fnOrObj === 'function';
                wrapperFn = fnOrObj.$$lwcEventWrapper$$ = function (e) {
                    // we don't want to patch every event, only when the original target is coming
                    // from inside a synthetic shadow
                    if (doesEventNeedsPatch(e)) {
                        patchEvent(e);
                    }
                    return isHandlerFunction ? fnOrObj.call(this, e) : fnOrObj.handleEvent && fnOrObj.handleEvent(e);
                };
            }
        }
        catch (e) { /** ignore */ }
        return wrapperFn;
    }
    function windowAddEventListener$1(type, fnOrObj, optionsOrCapture) {
        const handlerType = typeof fnOrObj;
        // bail if `fnOrObj` is not a function, not an object
        if (handlerType !== 'function' && handlerType !== 'object') {
            return;
        }
        // bail if `fnOrObj` is an object without a `handleEvent` method
        if (handlerType === 'object' && (!fnOrObj.handleEvent || typeof fnOrObj.handleEvent !== 'function')) {
            return;
        }
        const wrapperFn = getEventListenerWrapper(fnOrObj);
        windowAddEventListener.call(this, type, wrapperFn, optionsOrCapture);
    }
    function windowRemoveEventListener$1(type, fnOrObj, optionsOrCapture) {
        const wrapperFn = getEventListenerWrapper(fnOrObj);
        windowRemoveEventListener.call(this, type, wrapperFn || fnOrObj, optionsOrCapture);
    }
    function addEventListener$1(type, fnOrObj, optionsOrCapture) {
        const handlerType = typeof fnOrObj;
        // bail if `fnOrObj` is not a function, not an object
        if (handlerType !== 'function' && handlerType !== 'object') {
            return;
        }
        // bail if `fnOrObj` is an object without a `handleEvent` method
        if (handlerType === 'object' && (!fnOrObj.handleEvent || typeof fnOrObj.handleEvent !== 'function')) {
            return;
        }
        const wrapperFn = getEventListenerWrapper(fnOrObj);
        addEventListener.call(this, type, wrapperFn, optionsOrCapture);
    }
    function removeEventListener$1(type, fnOrObj, optionsOrCapture) {
        const wrapperFn = getEventListenerWrapper(fnOrObj);
        removeEventListener.call(this, type, wrapperFn || fnOrObj, optionsOrCapture);
    }
    addEventListener$1.__lwcOriginal__ = addEventListener;
    removeEventListener$1.__lwcOriginal__ = removeEventListener;
    windowAddEventListener$1.__lwcOriginal__ = windowAddEventListener;
    windowRemoveEventListener$1.__lwcOriginal__ = windowRemoveEventListener;
    function windowPatchListeners() {
        window.addEventListener = windowAddEventListener$1;
        window.removeEventListener = windowRemoveEventListener$1;
    }
    function nodePatchListeners() {
        Node.prototype.addEventListener = addEventListener$1;
        Node.prototype.removeEventListener = removeEventListener$1;
    }
    function apply() {
        windowPatchListeners();
        nodePatchListeners();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    {
        apply();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // intentionally extracting the patched addEventListener and removeEventListener from Node.prototype
    // due to the issues with JSDOM patching hazard.
    const { addEventListener: addEventListener$2, removeEventListener: removeEventListener$2, } = Node.prototype;
    var EventListenerContext;
    (function (EventListenerContext) {
        EventListenerContext[EventListenerContext["CUSTOM_ELEMENT_LISTENER"] = 1] = "CUSTOM_ELEMENT_LISTENER";
        EventListenerContext[EventListenerContext["SHADOW_ROOT_LISTENER"] = 2] = "SHADOW_ROOT_LISTENER";
    })(EventListenerContext || (EventListenerContext = {}));
    const eventToContextMap = new WeakMap();
    function isChildNode(root, node) {
        return !!(compareDocumentPosition.call(root, node) & DOCUMENT_POSITION_CONTAINED_BY);
    }
    const GET_ROOT_NODE_CONFIG_FALSE = { composed: false };
    function getRootNodeHost(node, options) {
        let rootNode = getRootNodeGetter.call(node, options);
        // is SyntheticShadowRootInterface
        if ('mode' in rootNode && 'delegatesFocus' in rootNode) {
            rootNode = getHost(rootNode);
        }
        return rootNode;
    }
    function patchEvent(event) {
        if (eventToContextMap.has(event)) {
            return; // already patched
        }
        // not all events implement the relatedTarget getter, that's why we need to extract it from the instance
        // Note: we can't really use the super here because of issues with the typescript transpilation for accessors
        const originalRelatedTargetDescriptor = getPropertyDescriptor(event, 'relatedTarget');
        defineProperties(event, {
            relatedTarget: {
                get() {
                    const eventContext = eventToContextMap.get(this);
                    const originalCurrentTarget = eventCurrentTargetGetter.call(this);
                    if (isUndefined(originalRelatedTargetDescriptor)) {
                        return undefined;
                    }
                    const relatedTarget = originalRelatedTargetDescriptor.get.call(this);
                    if (isNull(relatedTarget)) {
                        return null;
                    }
                    const currentTarget = (eventContext === EventListenerContext.SHADOW_ROOT_LISTENER) ?
                        getShadowRoot(originalCurrentTarget) :
                        originalCurrentTarget;
                    return retarget(currentTarget, pathComposer(relatedTarget, true));
                },
                enumerable: true,
                configurable: true,
            },
            target: {
                get() {
                    const originalCurrentTarget = eventCurrentTargetGetter.call(this);
                    const originalTarget = eventTargetGetter.call(this);
                    const composedPath = pathComposer(originalTarget, this.composed);
                    // Handle cases where the currentTarget is null (for async events),
                    // and when an event has been added to Window
                    if (!(originalCurrentTarget instanceof Node)) {
                        return retarget(document, composedPath);
                    }
                    const eventContext = eventToContextMap.get(this);
                    const currentTarget = (eventContext === EventListenerContext.SHADOW_ROOT_LISTENER) ?
                        getShadowRoot(originalCurrentTarget) :
                        originalCurrentTarget;
                    return retarget(currentTarget, composedPath);
                },
                enumerable: true,
                configurable: true,
            },
        });
        eventToContextMap.set(event, 0);
    }
    const customElementToWrappedListeners = new WeakMap();
    function getEventMap(elm) {
        let listenerInfo = customElementToWrappedListeners.get(elm);
        if (isUndefined(listenerInfo)) {
            listenerInfo = create(null);
            customElementToWrappedListeners.set(elm, listenerInfo);
        }
        return listenerInfo;
    }
    const shadowRootEventListenerMap = new WeakMap();
    function getWrappedShadowRootListener(sr, listener) {
        if (!isFunction(listener)) {
            throw new TypeError(); // avoiding problems with non-valid listeners
        }
        let shadowRootWrappedListener = shadowRootEventListenerMap.get(listener);
        if (isUndefined(shadowRootWrappedListener)) {
            shadowRootWrappedListener = function (event) {
                // * if the event is dispatched directly on the host, it is not observable from root
                // * if the event is dispatched in an element that does not belongs to the shadow and it is not composed,
                //   it is not observable from the root
                const { composed } = event;
                const target = eventTargetGetter.call(event);
                const currentTarget = eventCurrentTargetGetter.call(event);
                if (target !== currentTarget) {
                    const rootNode = getRootNodeHost(target, { composed });
                    if (isChildNode(rootNode, currentTarget) ||
                        (composed === false && rootNode === currentTarget)) {
                        listener.call(sr, event);
                    }
                }
            };
            shadowRootWrappedListener.placement = EventListenerContext.SHADOW_ROOT_LISTENER;
            if (process.env.NODE_ENV !== 'production') {
                shadowRootWrappedListener.original = listener; // for logging purposes
            }
            shadowRootEventListenerMap.set(listener, shadowRootWrappedListener);
        }
        return shadowRootWrappedListener;
    }
    const customElementEventListenerMap = new WeakMap();
    function getWrappedCustomElementListener(elm, listener) {
        if (!isFunction(listener)) {
            throw new TypeError(); // avoiding problems with non-valid listeners
        }
        let customElementWrappedListener = customElementEventListenerMap.get(listener);
        if (isUndefined(customElementWrappedListener)) {
            customElementWrappedListener = function (event) {
                if (isValidEventForCustomElement(event)) {
                    // all handlers on the custom element should be called with undefined 'this'
                    listener.call(elm, event);
                }
            };
            customElementWrappedListener.placement = EventListenerContext.CUSTOM_ELEMENT_LISTENER;
            if (process.env.NODE_ENV !== 'production') {
                customElementWrappedListener.original = listener; // for logging purposes
            }
            customElementEventListenerMap.set(listener, customElementWrappedListener);
        }
        return customElementWrappedListener;
    }
    function domListener(evt) {
        let immediatePropagationStopped = false;
        let propagationStopped = false;
        const { type, stopImmediatePropagation, stopPropagation } = evt;
        const currentTarget = eventCurrentTargetGetter.call(evt);
        const listenerMap = getEventMap(currentTarget);
        const listeners = listenerMap[type]; // it must have listeners at this point
        defineProperty(evt, 'stopImmediatePropagation', {
            value() {
                immediatePropagationStopped = true;
                stopImmediatePropagation.call(evt);
            },
            writable: true,
            enumerable: true,
            configurable: true,
        });
        defineProperty(evt, 'stopPropagation', {
            value() {
                propagationStopped = true;
                stopPropagation.call(evt);
            },
            writable: true,
            enumerable: true,
            configurable: true,
        });
        // in case a listener adds or removes other listeners during invocation
        const bookkeeping = ArraySlice.call(listeners);
        function invokeListenersByPlacement(placement) {
            forEach.call(bookkeeping, (listener) => {
                if (isFalse(immediatePropagationStopped) && listener.placement === placement) {
                    // making sure that the listener was not removed from the original listener queue
                    if (ArrayIndexOf.call(listeners, listener) !== -1) {
                        // all handlers on the custom element should be called with undefined 'this'
                        listener.call(undefined, evt);
                    }
                }
            });
        }
        eventToContextMap.set(evt, EventListenerContext.SHADOW_ROOT_LISTENER);
        invokeListenersByPlacement(EventListenerContext.SHADOW_ROOT_LISTENER);
        if (isFalse(immediatePropagationStopped) && isFalse(propagationStopped)) {
            // doing the second iteration only if the first one didn't interrupt the event propagation
            eventToContextMap.set(evt, EventListenerContext.CUSTOM_ELEMENT_LISTENER);
            invokeListenersByPlacement(EventListenerContext.CUSTOM_ELEMENT_LISTENER);
        }
        eventToContextMap.set(evt, 0);
    }
    function attachDOMListener(elm, type, wrappedListener) {
        const listenerMap = getEventMap(elm);
        let cmpEventHandlers = listenerMap[type];
        if (isUndefined(cmpEventHandlers)) {
            cmpEventHandlers = listenerMap[type] = [];
        }
        // only add to DOM if there is no other listener on the same placement yet
        if (cmpEventHandlers.length === 0) {
            addEventListener$2.call(elm, type, domListener);
        }
        else if (process.env.NODE_ENV !== 'production') {
            if (ArrayIndexOf.call(cmpEventHandlers, wrappedListener) !== -1) {
                assert.logWarning(`${toString(elm)} has duplicate listener for event "${type}". Instead add the event listener in the connectedCallback() hook.`, elm);
            }
        }
        ArrayPush.call(cmpEventHandlers, wrappedListener);
    }
    function detachDOMListener(elm, type, wrappedListener) {
        const listenerMap = getEventMap(elm);
        let p;
        let listeners;
        if (!isUndefined(listeners = listenerMap[type]) && (p = ArrayIndexOf.call(listeners, wrappedListener)) !== -1) {
            ArraySplice.call(listeners, p, 1);
            // only remove from DOM if there is no other listener on the same placement
            if (listeners.length === 0) {
                removeEventListener$2.call(elm, type, domListener);
            }
        }
        else if (process.env.NODE_ENV !== 'production') {
            assert.logError(`Did not find event listener for event "${type}" executing removeEventListener on ${toString(elm)}. This is probably a typo or a life cycle mismatch. Make sure that you add the right event listeners in the connectedCallback() hook and remove them in the disconnectedCallback() hook.`, elm);
        }
    }
    function isValidEventForCustomElement(event) {
        const target = eventTargetGetter.call(event);
        const currentTarget = eventCurrentTargetGetter.call(event);
        const { composed } = event;
        return (
        // it is composed, and we should always get it, or
        composed === true ||
            // it is dispatched onto the custom element directly, or
            target === currentTarget ||
            // it is coming from a slotted element
            isChildNode(getRootNodeHost(target, GET_ROOT_NODE_CONFIG_FALSE), currentTarget));
    }
    function addCustomElementEventListener(elm, type, listener, options) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(isFunction(listener), `Invalid second argument for this.addEventListener() in ${toString(elm)} for event "${type}". Expected an EventListener but received ${listener}.`);
            // TODO: issue #420
            // this is triggered when the component author attempts to add a listener programmatically into a lighting element node
            if (!isUndefined(options)) {
                assert.logWarning(`The 'addEventListener' method in 'LightningElement' does not support more than 2 arguments. Options to make the listener passive, once, or capture are not allowed but received: ${toString(options)}`, elm);
            }
        }
        const wrappedListener = getWrappedCustomElementListener(elm, listener);
        attachDOMListener(elm, type, wrappedListener);
    }
    function removeCustomElementEventListener(elm, type, listener, options) {
        const wrappedListener = getWrappedCustomElementListener(elm, listener);
        detachDOMListener(elm, type, wrappedListener);
    }
    function addShadowRootEventListener(sr, type, listener, options) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(isFunction(listener), `Invalid second argument for this.template.addEventListener() in ${toString(sr)} for event "${type}". Expected an EventListener but received ${listener}.`);
            // TODO: issue #420
            // this is triggered when the component author attempts to add a listener programmatically into its Component's shadow root
            if (!isUndefined(options)) {
                assert.logWarning(`The 'addEventListener' method in 'ShadowRoot' does not support more than 2 arguments. Options to make the listener passive, once, or capture are not allowed but received: ${toString(options)}`, getHost(sr));
            }
        }
        const elm = getHost(sr);
        const wrappedListener = getWrappedShadowRootListener(sr, listener);
        attachDOMListener(elm, type, wrappedListener);
    }
    function removeShadowRootEventListener(sr, type, listener, options) {
        const elm = getHost(sr);
        const wrappedListener = getWrappedShadowRootListener(sr, listener);
        detachDOMListener(elm, type, wrappedListener);
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const TabbableElementsQuery = `
    button:not([tabindex="-1"]):not([disabled]),
    [contenteditable]:not([tabindex="-1"]),
    video[controls]:not([tabindex="-1"]),
    audio[controls]:not([tabindex="-1"]),
    [href]:not([tabindex="-1"]),
    input:not([tabindex="-1"]):not([disabled]),
    select:not([tabindex="-1"]):not([disabled]),
    textarea:not([tabindex="-1"]):not([disabled]),
    [tabindex="0"]
`;
    function isVisible(element) {
        const { width, height } = getBoundingClientRect.call(element);
        const noZeroSize = width > 0 || height > 0;
        return (noZeroSize &&
            getComputedStyle(element).visibility !== 'hidden');
    }
    function hasFocusableTabIndex(element) {
        if (isFalse(hasAttribute.call(element, 'tabindex'))) {
            return false;
        }
        const value = getAttribute.call(element, 'tabindex');
        // Really, any numeric tabindex value is valid
        // But LWC only allows 0 or -1, so we can just check against that.
        // The main point here is to make sure the tabindex attribute is not an invalid
        // value like tabindex="hello"
        if (value === '' || (value !== '0' && value !== '-1')) {
            return false;
        }
        return true;
    }
    // This function based on https://allyjs.io/data-tables/focusable.html
    // It won't catch everything, but should be good enough
    // There are a lot of edge cases here that we can't realistically handle
    // Determines if a particular element is tabbable, as opposed to simply focusable
    // Exported for jest purposes
    function isTabbable(element) {
        return matches.call(element, TabbableElementsQuery) && isVisible(element);
    }
    const focusableTagNames = {
        IFRAME: 1,
        VIDEO: 1,
        AUDIO: 1,
        A: 1,
        INPUT: 1,
        SELECT: 1,
        TEXTAREA: 1,
        BUTTON: 1,
    };
    // This function based on https://allyjs.io/data-tables/focusable.html
    // It won't catch everything, but should be good enough
    // There are a lot of edge cases here that we can't realistically handle
    // Exported for jest purposes
    function isFocusable(element) {
        const tagName = tagNameGetter.call(element);
        return ((isVisible(element)) && (hasFocusableTabIndex(element) ||
            hasAttribute.call(element, 'contenteditable') ||
            hasOwnProperty.call(focusableTagNames, tagName)));
    }
    function getFirstTabbableMatch(elements) {
        for (let i = 0, len = elements.length; i < len; i += 1) {
            const elm = elements[i];
            if (isTabbable(elm)) {
                return elm;
            }
        }
        return null;
    }
    function getLastTabbableMatch(elements) {
        for (let i = elements.length - 1; i >= 0; i -= 1) {
            const elm = elements[i];
            if (isTabbable(elm)) {
                return elm;
            }
        }
        return null;
    }
    function getTabbableSegments(host) {
        const all = querySelectorAll$1.call(document, TabbableElementsQuery);
        const inner = querySelectorAll.call(host, TabbableElementsQuery);
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(tabIndexGetter.call(host) === -1 || isDelegatingFocus(host), `The focusin event is only relevant when the tabIndex property is -1 on the host.`);
        }
        const firstChild = inner[0];
        const lastChild = inner[inner.length - 1];
        const hostIndex = ArrayIndexOf.call(all, host);
        // Host element can show up in our "previous" section if its tabindex is 0
        // We want to filter that out here
        const firstChildIndex = (hostIndex > -1) ? hostIndex : ArrayIndexOf.call(all, firstChild);
        // Account for an empty inner list
        const lastChildIndex = inner.length === 0 ? firstChildIndex + 1 : ArrayIndexOf.call(all, lastChild) + 1;
        const prev = ArraySlice.call(all, 0, firstChildIndex);
        const next = ArraySlice.call(all, lastChildIndex);
        return {
            prev,
            inner,
            next,
        };
    }
    function getActiveElement(host) {
        const activeElement = DocumentPrototypeActiveElement.call(document);
        if (isNull(activeElement)) {
            return activeElement;
        }
        // activeElement must be child of the host and owned by it
        return (compareDocumentPosition.call(host, activeElement) & DOCUMENT_POSITION_CONTAINED_BY) !== 0 ? activeElement : null;
    }
    function relatedTargetPosition(host, relatedTarget) {
        // assert: target must be child of host
        const pos = compareDocumentPosition.call(host, relatedTarget);
        if (pos & DOCUMENT_POSITION_CONTAINED_BY) {
            // focus remains inside the host
            return 0;
        }
        else if (pos & DOCUMENT_POSITION_PRECEDING) {
            // focus is coming from above
            return 1;
        }
        else if (pos & DOCUMENT_POSITION_FOLLOWING) {
            // focus is coming from below
            return 2;
        }
        // we don't know what's going on.
        return -1;
    }
    function getPreviousTabbableElement(segments) {
        const { prev } = segments;
        return getFirstTabbableMatch(ArrayReverse.call(prev));
    }
    function getNextTabbableElement(segments) {
        const { next } = segments;
        return getFirstTabbableMatch(next);
    }
    function focusOnNextOrBlur(focusEventTarget, segments) {
        const nextNode = getNextTabbableElement(segments);
        if (isNull(nextNode)) {
            // nothing to focus on, blur to invalidate the operation
            focusEventTarget.blur();
            return;
        }
        nextNode.focus();
    }
    function focusOnPrevOrBlur(focusEventTarget, segments) {
        const prevNode = getPreviousTabbableElement(segments);
        if (isNull(prevNode)) {
            // nothing to focus on, blur to invalidate the operation
            focusEventTarget.blur();
            return;
        }
        prevNode.focus();
    }
    function isFirstTabbableChild(target, segments) {
        return getFirstTabbableMatch(segments.inner) === target;
    }
    function isLastTabbableChild(target, segments) {
        return getLastTabbableMatch(segments.inner) === target;
    }
    function keyboardFocusHandler(event) {
        const host = eventCurrentTargetGetter.call(event);
        const target = eventTargetGetter.call(event);
        // Ideally, we would be able to use a "focus" event that doesn't bubble
        // but, IE11 doesn't support relatedTarget on focus events so we have to use
        // focusin instead. The logic below is predicated on non-bubbling events
        // So, if currentTarget(host) ir not target, we know that the event is bubbling
        // and we escape because focus occured on something below the host.
        if (host !== target) {
            return;
        }
        const relatedTarget = focusEventRelatedTargetGetter.call(event);
        if (isNull(relatedTarget)) {
            return;
        }
        const segments = getTabbableSegments(host);
        const position = relatedTargetPosition(host, relatedTarget);
        if (position === 1) {
            // probably tabbing into element
            const first = getFirstTabbableMatch(segments.inner);
            if (!isNull(first)) {
                first.focus();
            }
            else {
                focusOnNextOrBlur(target, segments);
            }
            return;
        }
        else if (host === target) { // Shift tabbed back to the host
            focusOnPrevOrBlur(host, segments);
        }
    }
    // focusin handler for custom elements
    // This handler should only be called when a user
    // focuses on either the custom element, or an internal element
    // via keyboard navigation (tab or shift+tab)
    // Focusing via mouse should be disqualified before this gets called
    function keyboardFocusInHandler(event) {
        const host = eventCurrentTargetGetter.call(event);
        const target = eventTargetGetter.call(event);
        const relatedTarget = focusEventRelatedTargetGetter.call(event);
        const segments = getTabbableSegments(host);
        const isFirstFocusableChildReceivingFocus = isFirstTabbableChild(target, segments);
        const isLastFocusableChildReceivingFocus = isLastTabbableChild(target, segments);
        if (
        // If we receive a focusin event that is not focusing on the first or last
        // element inside of a shadow, we can assume that the user is tabbing between
        // elements inside of the custom element shadow, so we do nothing
        (isFalse(isFirstFocusableChildReceivingFocus) && isFalse(isLastFocusableChildReceivingFocus)) ||
            // If related target is null, user is probably tabbing into the document from the browser chrome (location bar?)
            // If relatedTarget is null, we can't do much here because we don't know what direction the user is tabbing
            // This is a bit of an edge case, and only comes up if the custom element is the very first or very last
            // tabbable element in a document
            isNull(relatedTarget)) {
            return;
        }
        // Determine where the focus is coming from (Tab or Shift+Tab)
        const post = relatedTargetPosition(host, relatedTarget);
        switch (post) {
            case 1: // focus is probably coming from above
                if (isFirstFocusableChildReceivingFocus && relatedTarget === getPreviousTabbableElement(segments)) {
                    // the focus was on the immediate focusable elements from above,
                    // it is almost certain that the focus is due to tab keypress
                    focusOnNextOrBlur(target, segments);
                }
                break;
            case 2: // focus is probably coming from below
                if (isLastFocusableChildReceivingFocus && relatedTarget === getNextTabbableElement(segments)) {
                    // the focus was on the immediate focusable elements from above,
                    // it is almost certain that the focus is due to tab keypress
                    focusOnPrevOrBlur(target, segments);
                }
                break;
        }
    }
    function willTriggerFocusInEvent(target) {
        return (target !== DocumentPrototypeActiveElement.call(document) && // if the element is currently active, it will not fire a focusin event
            isFocusable(target));
    }
    function stopFocusIn(evt) {
        const currentTarget = eventCurrentTargetGetter.call(evt);
        removeEventListener.call(currentTarget, 'focusin', keyboardFocusInHandler);
        setTimeout(() => {
            // only reinstate the focus if the tabindex is still -1
            if (tabIndexGetter.call(currentTarget) === -1) {
                addEventListener.call(currentTarget, 'focusin', keyboardFocusInHandler);
            }
        }, 0);
    }
    function handleFocusMouseDown(evt) {
        const target = eventTargetGetter.call(evt);
        // If we are mouse down in an element that can be focused
        // and the currentTarget's activeElement is not element we are mouse-ing down in
        // We can bail out and let the browser do its thing.
        if (willTriggerFocusInEvent(target)) {
            addEventListener.call(eventCurrentTargetGetter.call(evt), 'focusin', stopFocusIn, true);
        }
    }
    function handleFocus(elm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(isDelegatingFocus(elm), `Invalid attempt to handle focus event for ${toString(elm)}. ${toString(elm)} should have delegates focus true, but is not delegating focus`);
        }
        // Unbind any focusin listeners we may have going on
        ignoreFocusIn(elm);
        addEventListener.call(elm, 'focusin', keyboardFocusHandler, true);
    }
    function ignoreFocus(elm) {
        removeEventListener.call(elm, 'focusin', keyboardFocusHandler, true);
    }
    function handleFocusIn(elm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(tabIndexGetter.call(elm) === -1, `Invalid attempt to handle focus in  ${toString(elm)}. ${toString(elm)} should have tabIndex -1, but has tabIndex ${tabIndexGetter.call(elm)}`);
        }
        // Unbind any focus listeners we may have going on
        ignoreFocus(elm);
        // We want to listen for mousedown
        // If the user is triggering a mousedown event on an element
        // That can trigger a focus event, then we need to opt out
        // of our tabindex -1 dance. The tabindex -1 only applies for keyboard navigation
        addEventListener.call(elm, 'mousedown', handleFocusMouseDown, true);
        // This focusin listener is to catch focusin events from keyboard interactions
        // A better solution would perhaps be to listen for keydown events, but
        // the keydown event happens on whatever element already has focus (or no element
        // at all in the case of the location bar. So, instead we have to assume that focusin
        // without a mousedown means keyboard navigation
        addEventListener.call(elm, 'focusin', keyboardFocusInHandler);
    }
    function ignoreFocusIn(elm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(tabIndexGetter.call(elm) !== -1, `Invalid attempt to ignore focus in  ${toString(elm)}. ${toString(elm)} should not have tabIndex -1`);
        }
        removeEventListener.call(elm, 'focusin', keyboardFocusInHandler);
        removeEventListener.call(elm, 'mousedown', handleFocusMouseDown, true);
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function PatchedCustomElement(Base) {
        const Ctor = PatchedElement(Base);
        return class PatchedHTMLElement extends Ctor {
            attachShadow(options) {
                return attachShadow(this, options);
            }
            addEventListener(type, listener, options) {
                addCustomElementEventListener(this, type, listener, options);
            }
            removeEventListener(type, listener, options) {
                removeCustomElementEventListener(this, type, listener, options);
            }
            get shadowRoot() {
                const shadow = getShadowRoot(this);
                if (shadow.mode === ShadowRootMode.OPEN) {
                    return shadow;
                }
                return null;
            }
            get tabIndex() {
                if (isDelegatingFocus(this) && isFalse(hasAttribute.call(this, 'tabindex'))) {
                    // this cover the case where the default tabindex should be 0 because the
                    // custom element is delegating its focus
                    return 0;
                }
                // NOTE: Technically this should be `super.tabIndex` however Typescript
                // has a known bug while transpiling down to ES5
                // https://github.com/Microsoft/TypeScript/issues/338
                const descriptor = getPropertyDescriptor(Ctor.prototype, 'tabIndex');
                return descriptor.get.call(this);
            }
            set tabIndex(value) {
                // get the original value from the element before changing it, just in case
                // the custom element is doing something funky. we only really care about
                // the actual changes in the DOM.
                const hasAttr = hasAttribute.call(this, 'tabindex');
                const originalValue = tabIndexGetter.call(this);
                // run the super logic, which bridges the setter to the component
                // NOTE: Technically this should be `super.tabIndex` however Typescript
                // has a known bug while transpiling down to ES5
                // https://github.com/Microsoft/TypeScript/issues/338
                const descriptor = getPropertyDescriptor(Ctor.prototype, 'tabIndex');
                descriptor.set.call(this, value);
                // Check if the value from the dom has changed
                const newValue = tabIndexGetter.call(this);
                if ((!hasAttr || originalValue !== newValue)) {
                    // Value has changed
                    if (newValue === -1) {
                        // add the magic to skip this element
                        handleFocusIn(this);
                    }
                    else if (newValue === 0 && isDelegatingFocus(this)) {
                        // Listen for focus if the new tabIndex is 0, and we are delegating focus
                        handleFocus(this);
                    }
                    else {
                        // TabIndex is set to 0, but we aren't delegating focus, so we can ignore everything
                        ignoreFocusIn(this);
                        ignoreFocus(this);
                    }
                }
                else if (originalValue === -1) {
                    // remove the magic
                    ignoreFocusIn(this);
                    ignoreFocus(this);
                }
            }
            blur() {
                if (isDelegatingFocus(this)) {
                    const currentActiveElement = getActiveElement(this);
                    if (!isNull(currentActiveElement)) {
                        // if there is an active element, blur it
                        currentActiveElement.blur();
                        return;
                    }
                }
                super.blur();
            }
            get childNodes() {
                const owner = getNodeOwner(this);
                const childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
                if (process.env.NODE_ENV !== 'production' && isFalse(hasNativeSymbolsSupport$1) && isExternalChildNodeAccessorFlagOn()) {
                    // inserting a comment node as the first childNode to trick the IE11
                    // DevTool to show the content of the shadowRoot, this should only happen
                    // in dev-mode and in IE11 (which we detect by looking at the symbol).
                    // Plus it should only be in place if we know it is an external invoker.
                    ArrayUnshift.call(childNodes, getIE11FakeShadowRootPlaceholder(this));
                }
                return createStaticNodeList(childNodes);
            }
            get children() {
                // We cannot patch `children` in test mode
                // because JSDOM uses children for its "native"
                // querySelector implementation. If we patch this,
                // HTMLElement.prototype.querySelector.call(element) will not
                // return any elements from shadow, which is not what we want
                if (process.env.NODE_ENV === 'test') {
                    return childrenGetter.call(this);
                }
                const owner = getNodeOwner(this);
                const childNodes = isNull(owner) ? [] : getAllMatches(owner, getFilteredChildNodes(this));
                return createStaticHTMLCollection(ArrayFilter.call(childNodes, (node) => node instanceof Element));
            }
        };
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    // Using a WeakMap instead of a WeakSet because this one works in IE11 :(
    const FromIteration = new WeakMap();
    // dynamic children means it was generated by an iteration
    // in a template, and will require a more complex diffing algo.
    function markAsDynamicChildren(children) {
        FromIteration.set(children, 1);
    }
    function hasDynamicChildren(children) {
        return FromIteration.has(children);
    }
    function patchChildren(host, shadowRoot, oldCh, newCh, isFallback) {
        if (oldCh !== newCh) {
            const parentNode = isFallback ? host : shadowRoot;
            const fn = hasDynamicChildren(newCh) ? updateDynamicChildren : updateStaticChildren;
            fn(parentNode, oldCh, newCh);
        }
    }
    let TextNodeProto;
    // this method is supposed to be invoked when in fallback mode only
    // to patch text nodes generated by a template.
    function patchTextNodeProto(text) {
        if (isUndefined(TextNodeProto)) {
            TextNodeProto = PatchedNode(text).prototype;
        }
        setPrototypeOf(text, TextNodeProto);
    }
    let CommentNodeProto;
    // this method is supposed to be invoked when in fallback mode only
    // to patch comment nodes generated by a template.
    function patchCommentNodeProto(comment) {
        if (isUndefined(CommentNodeProto)) {
            CommentNodeProto = PatchedNode(comment).prototype;
        }
        setPrototypeOf(comment, CommentNodeProto);
    }
    const TagToProtoCache = create(null);
    function getPatchedElementClass(elm) {
        switch (tagNameGetter.call(elm)) {
            case 'SLOT':
                return PatchedSlotElement(elm);
            case 'IFRAME':
                return PatchedIframeElement(elm);
        }
        return PatchedElement(elm);
    }
    // this method is supposed to be invoked when in fallback mode only
    // to patch elements generated by a template.
    function patchElementProto(elm, options) {
        const { sel, isPortal, shadowAttribute } = options;
        let proto = TagToProtoCache[sel];
        if (isUndefined(proto)) {
            proto = TagToProtoCache[sel] = getPatchedElementClass(elm).prototype;
        }
        setPrototypeOf(elm, proto);
        if (isTrue(isPortal)) {
            markElementAsPortal(elm);
        }
        setCSSToken(elm, shadowAttribute);
    }
    function patchCustomElementProto(elm, options) {
        const { def, shadowAttribute } = options;
        let patchedBridge = def.patchedBridge;
        if (isUndefined(patchedBridge)) {
            patchedBridge = def.patchedBridge = PatchedCustomElement(elm);
        }
        // temporary patching the proto, eventually this should be just more nodes in the proto chain
        setPrototypeOf(elm, patchedBridge.prototype);
        setCSSToken(elm, shadowAttribute);
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function getNodeRestrictionsDescriptors(node, options) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        // getPropertyDescriptor here recursively looks up the prototype chain
        // and returns the first descriptor for the property
        const originalTextContentDescriptor = getPropertyDescriptor(node, 'textContent');
        const originalNodeValueDescriptor = getPropertyDescriptor(node, 'nodeValue');
        const { appendChild, insertBefore, removeChild, replaceChild, } = node;
        return {
            appendChild: {
                value(aChild) {
                    if (this instanceof Element && options.isPortal !== true) {
                        assert.logError(`appendChild is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
                    }
                    return appendChild.call(this, aChild);
                },
                enumerable: false,
                writable: false,
                configurable: true,
            },
            insertBefore: {
                value(newNode, referenceNode) {
                    if (this instanceof Element && options.isPortal !== true) {
                        assert.logError(`insertBefore is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
                    }
                    return insertBefore.call(this, newNode, referenceNode);
                },
                enumerable: false,
                writable: false,
                configurable: true,
            },
            removeChild: {
                value(aChild) {
                    if (this instanceof Element && options.isPortal !== true) {
                        assert.logError(`removeChild is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
                    }
                    return removeChild.call(this, aChild);
                },
                enumerable: false,
                writable: false,
                configurable: true,
            },
            replaceChild: {
                value(newChild, oldChild) {
                    if (this instanceof Element && options.isPortal !== true) {
                        assert.logError(`replaceChild is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
                    }
                    return replaceChild.call(this, newChild, oldChild);
                },
                enumerable: false,
                writable: false,
                configurable: true,
            },
            nodeValue: {
                get() {
                    return originalNodeValueDescriptor.get.call(this);
                },
                set(value) {
                    if (process.env.NODE_ENV !== 'production') {
                        if (this instanceof Element && options.isPortal !== true) {
                            assert.logError(`nodeValue is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
                        }
                    }
                    originalNodeValueDescriptor.set.call(this, value);
                }
            },
            textContent: {
                get() {
                    return originalTextContentDescriptor.get.call(this);
                },
                set(value) {
                    if (process.env.NODE_ENV !== 'production') {
                        if (this instanceof Element && options.isPortal !== true) {
                            assert.logError(`textContent is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
                        }
                    }
                    originalTextContentDescriptor.set.call(this, value);
                }
            },
        };
    }
    function getElementRestrictionsDescriptors(elm, options) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        const descriptors = getNodeRestrictionsDescriptors(elm, options);
        const originalInnerHTMLDescriptor = getPropertyDescriptor(elm, 'innerHTML');
        assign(descriptors, {
            innerHTML: {
                get() {
                    return originalInnerHTMLDescriptor.get.call(this);
                },
                set(value) {
                    if (process.env.NODE_ENV !== 'production') {
                        if (options.isPortal !== true) {
                            assert.logError(`innerHTML is disallowed in Element unless \`lwc:dom="manual"\` directive is used in the template.`, this);
                        }
                    }
                    return originalInnerHTMLDescriptor.set.call(this, value);
                },
                enumerable: true,
                configurable: true,
            }
        });
        return descriptors;
    }
    function getShadowRootRestrictionsDescriptors(sr, options) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        // blacklisting properties in dev mode only to avoid people doing the wrong
        // thing when using the real shadow root, because if that's the case,
        // the component will not work when running in fallback mode.
        const originalQuerySelector = sr.querySelector;
        const originalQuerySelectorAll = sr.querySelectorAll;
        const originalAddEventListener = sr.addEventListener;
        const descriptors = getNodeRestrictionsDescriptors(sr, options);
        assign(descriptors, {
            addEventListener: {
                value(type) {
                    assert.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${toString(sr)} by adding an event listener for "${type}".`);
                    return originalAddEventListener.apply(this, arguments);
                }
            },
            querySelector: {
                value() {
                    const vm = getShadowRootVM(this);
                    assert.isFalse(isBeingConstructed(vm), `this.template.querySelector() cannot be called during the construction of the custom element for ${vm} because no content has been rendered yet.`);
                    return originalQuerySelector.apply(this, arguments);
                }
            },
            querySelectorAll: {
                value() {
                    const vm = getShadowRootVM(this);
                    assert.isFalse(isBeingConstructed(vm), `this.template.querySelectorAll() cannot be called during the construction of the custom element for ${vm} because no content has been rendered yet.`);
                    return originalQuerySelectorAll.apply(this, arguments);
                }
            },
        });
        const BlackListedShadowRootMethods = {
            appendChild: 0,
            removeChild: 0,
            replaceChild: 0,
            cloneNode: 0,
            insertBefore: 0,
            getElementById: 0,
            getSelection: 0,
            elementsFromPoint: 0,
        };
        forEach.call(getOwnPropertyNames(BlackListedShadowRootMethods), (methodName) => {
            const descriptor = {
                get() {
                    throw new Error(`Disallowed method "${methodName}" in ShadowRoot.`);
                }
            };
            descriptors[methodName] = descriptor;
        });
        return descriptors;
    }
    // Custom Elements Restrictions:
    // -----------------------------
    function getAttributePatched(attrName) {
        if (process.env.NODE_ENV !== 'production') {
            const vm = getCustomElementVM(this);
            assertAttributeReflectionCapability(vm, attrName);
        }
        return getAttribute.apply(this, ArraySlice.call(arguments));
    }
    function setAttributePatched(attrName, newValue) {
        const vm = getCustomElementVM(this);
        if (process.env.NODE_ENV !== 'production') {
            assertAttributeMutationCapability(vm, attrName);
            assertAttributeReflectionCapability(vm, attrName);
        }
        setAttribute.apply(this, ArraySlice.call(arguments));
    }
    function setAttributeNSPatched(attrNameSpace, attrName, newValue) {
        const vm = getCustomElementVM(this);
        if (process.env.NODE_ENV !== 'production') {
            assertAttributeMutationCapability(vm, attrName);
            assertAttributeReflectionCapability(vm, attrName);
        }
        setAttributeNS.apply(this, ArraySlice.call(arguments));
    }
    function removeAttributePatched(attrName) {
        const vm = getCustomElementVM(this);
        // marking the set is needed for the AOM polyfill
        if (process.env.NODE_ENV !== 'production') {
            assertAttributeMutationCapability(vm, attrName);
            assertAttributeReflectionCapability(vm, attrName);
        }
        removeAttribute.apply(this, ArraySlice.call(arguments));
    }
    function removeAttributeNSPatched(attrNameSpace, attrName) {
        const vm = getCustomElementVM(this);
        if (process.env.NODE_ENV !== 'production') {
            assertAttributeMutationCapability(vm, attrName);
            assertAttributeReflectionCapability(vm, attrName);
        }
        removeAttributeNS.apply(this, ArraySlice.call(arguments));
    }
    function assertAttributeReflectionCapability(vm, attrName) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        const propName = isString(attrName) ? getPropNameFromAttrName(StringToLowerCase.call(attrName)) : null;
        const { elm, def: { props: propsConfig } } = vm;
        if (!isUndefined(getNodeOwnerKey$1(elm)) && isAttributeLocked(elm, attrName) && propsConfig && propName && propsConfig[propName]) {
            assert.logError(`Invalid attribute "${StringToLowerCase.call(attrName)}" for ${vm}. Instead access the public property with \`element.${propName};\`.`, elm);
        }
    }
    function assertAttributeMutationCapability(vm, attrName) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        const { elm } = vm;
        if (!isUndefined(getNodeOwnerKey$1(elm)) && isAttributeLocked(elm, attrName)) {
            assert.logError(`Invalid operation on Element ${vm}. Elements created via a template should not be mutated using DOM APIs. Instead of attempting to update this element directly to change the value of attribute "${attrName}", you can update the state of the component, and let the engine to rehydrate the element accordingly.`, elm);
        }
    }
    function getCustomElementRestrictionsDescriptors(elm, options) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        const descriptors = getNodeRestrictionsDescriptors(elm, options);
        const originalAddEventListener = elm.addEventListener;
        return assign(descriptors, {
            addEventListener: {
                value(type) {
                    assert.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${toString(elm)} by adding an event listener for "${type}".`);
                    return originalAddEventListener.apply(this, arguments);
                }
            },
            // replacing mutators and accessors on the element itself to catch any mutation
            getAttribute: {
                value: getAttributePatched,
                configurable: true,
            },
            setAttribute: {
                value: setAttributePatched,
                configurable: true,
            },
            setAttributeNS: {
                value: setAttributeNSPatched,
                configurable: true,
            },
            removeAttribute: {
                value: removeAttributePatched,
                configurable: true,
            },
            removeAttributeNS: {
                value: removeAttributeNSPatched,
                configurable: true,
            },
        });
    }
    function getComponentRestrictionsDescriptors(cmp, options) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        const originalSetAttribute = cmp.setAttribute;
        return {
            setAttribute: {
                value(attrName, value) {
                    // logging errors for experimental and special attributes
                    if (isString(attrName)) {
                        const propName = getPropNameFromAttrName(attrName);
                        const info = getGlobalHTMLPropertiesInfo();
                        if (info[propName] && info[propName].attribute) {
                            const { error, experimental } = info[propName];
                            if (error) {
                                assert.logError(error, getComponentVM(this).elm);
                            }
                            else if (experimental) {
                                assert.logError(`Attribute \`${attrName}\` is an experimental attribute that is not standardized or supported by all browsers. Property "${propName}" and attribute "${attrName}" are ignored.`, getComponentVM(this).elm);
                            }
                        }
                    }
                    originalSetAttribute.apply(this, arguments);
                },
                enumerable: true,
                configurable: true,
                writable: true,
            },
            tagName: {
                get() {
                    throw new Error(`Usage of property \`tagName\` is disallowed because the component itself does not know which tagName will be used to create the element, therefore writing code that check for that value is error prone.`);
                },
                enumerable: true,
                configurable: true,
            },
        };
    }
    function getLightingElementProtypeRestrictionsDescriptors(proto, options) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        const info = getGlobalHTMLPropertiesInfo();
        const descriptors = {};
        forEach.call(getOwnPropertyNames(info), (propName) => {
            if (propName in proto) {
                return; // no need to redefine something that we are already exposing
            }
            descriptors[propName] = {
                get() {
                    const { error, attribute, readOnly, experimental } = info[propName];
                    const msg = [];
                    msg.push(`Accessing the global HTML property "${propName}" in ${this} is disabled.`);
                    if (error) {
                        msg.push(error);
                    }
                    else {
                        if (experimental) {
                            msg.push(`This is an experimental property that is not standardized or supported by all browsers. Property "${propName}" and attribute "${attribute}" are ignored.`);
                        }
                        if (readOnly) {
                            // TODO - need to improve this message
                            msg.push(`Property is read-only.`);
                        }
                        if (attribute) {
                            msg.push(`"Instead access it via the reflective attribute "${attribute}" with one of these techniques:`);
                            msg.push(`  * Use \`this.getAttribute("${attribute}")\` to access the attribute value. This option is best suited for accessing the value in a getter during the rendering process.`);
                            msg.push(`  * Declare \`static observedAttributes = ["${attribute}"]\` and use \`attributeChangedCallback(attrName, oldValue, newValue)\` to get a notification each time the attribute changes. This option is best suited for reactive programming, eg. fetching new data each time the attribute is updated.`);
                        }
                    }
                    assert.logWarning(msg.join('\n'), getComponentVM(this).elm);
                    return; // explicit undefined
                },
                // a setter is required here to avoid TypeError's when an attribute is set in a template but only the above getter is defined
                set() { },
            };
        });
        return descriptors;
    }
    function patchElementWithRestrictions(elm, options) {
        defineProperties(elm, getElementRestrictionsDescriptors(elm, options));
    }
    // This routine will prevent access to certain properties on a shadow root instance to guarantee
    // that all components will work fine in IE11 and other browsers without shadow dom support.
    function patchShadowRootWithRestrictions(sr, options) {
        defineProperties(sr, getShadowRootRestrictionsDescriptors(sr, options));
    }
    function patchCustomElementWithRestrictions(elm, options) {
        const restrictionsDescriptors = getCustomElementRestrictionsDescriptors(elm, options);
        const elmProto = getPrototypeOf(elm);
        setPrototypeOf(elm, create(elmProto, restrictionsDescriptors));
    }
    function patchComponentWithRestrictions(cmp, options) {
        defineProperties(cmp, getComponentRestrictionsDescriptors(cmp, options));
    }
    function patchLightningElementPrototypeWithRestrictions(proto, options) {
        defineProperties(proto, getLightingElementProtypeRestrictionsDescriptors(proto, options));
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function updateNodeHook(oldVnode, vnode) {
        if (oldVnode.text !== vnode.text) {
            nodeValueSetter.call(vnode.elm, vnode.text);
        }
    }
    function insertNodeHook(vnode, parentNode, referenceNode) {
        insertBefore.call(parentNode, vnode.elm, referenceNode);
    }
    function removeNodeHook(vnode, parentNode) {
        removeChild.call(parentNode, vnode.elm);
    }
    function createTextHook(vnode) {
        const text = vnode.elm;
        setNodeOwnerKey$1(text, vnode.uid);
        if (isTrue(vnode.fallback)) {
            patchTextNodeProto(text);
        }
    }
    function createCommentHook(vnode) {
        const comment = vnode.elm;
        setNodeOwnerKey$1(comment, vnode.uid);
        if (isTrue(vnode.fallback)) {
            patchCommentNodeProto(comment);
        }
    }
    function createElmDefaultHook(vnode) {
        modEvents.create(vnode);
        // Attrs need to be applied to element before props
        // IE11 will wipe out value on radio inputs if value
        // is set before type=radio.
        modAttrs.create(vnode);
        modProps.create(vnode);
        modStaticClassName.create(vnode);
        modStaticStyle.create(vnode);
        modComputedClassName.create(vnode);
        modComputedStyle.create(vnode);
        contextModule.create(vnode);
    }
    var LWCDOMMode;
    (function (LWCDOMMode) {
        LWCDOMMode["manual"] = "manual";
    })(LWCDOMMode || (LWCDOMMode = {}));
    function createElmHook(vnode) {
        const { uid, sel, fallback } = vnode;
        const elm = vnode.elm;
        setNodeOwnerKey$1(elm, uid);
        if (isTrue(fallback)) {
            const { shadowAttribute, data: { context } } = vnode;
            const isPortal = !isUndefined(context) && !isUndefined(context.lwc) && context.lwc.dom === LWCDOMMode.manual;
            patchElementProto(elm, {
                sel,
                isPortal,
                shadowAttribute,
            });
        }
        if (process.env.NODE_ENV !== 'production') {
            const { data: { context } } = vnode;
            const isPortal = !isUndefined(context) && !isUndefined(context.lwc) && context.lwc.dom === LWCDOMMode.manual;
            patchElementWithRestrictions(elm, { isPortal });
        }
    }
    function updateElmDefaultHook(oldVnode, vnode) {
        // Attrs need to be applied to element before props
        // IE11 will wipe out value on radio inputs if value
        // is set before type=radio.
        modAttrs.update(oldVnode, vnode);
        modProps.update(oldVnode, vnode);
        modComputedClassName.update(oldVnode, vnode);
        modComputedStyle.update(oldVnode, vnode);
    }
    function insertCustomElmHook(vnode) {
        const vm = getCustomElementVM(vnode.elm);
        appendVM(vm);
        renderVM(vm);
    }
    function updateChildrenHook(oldVnode, vnode) {
        const { children } = vnode;
        const fn = hasDynamicChildren(children) ? updateDynamicChildren : updateStaticChildren;
        fn(vnode.elm, oldVnode.children, children);
    }
    function allocateChildrenHook(vnode) {
        if (isTrue(vnode.fallback)) {
            // slow path
            const elm = vnode.elm;
            const vm = getCustomElementVM(elm);
            const children = vnode.children;
            allocateInSlot(vm, children);
            // every child vnode is now allocated, and the host should receive none directly, it receives them via the shadow!
            vnode.children = EmptyArray;
        }
    }
    function createCustomElmHook(vnode) {
        const elm = vnode.elm;
        if (hasOwnProperty.call(elm, ViewModelReflection)) {
            // There is a possibility that a custom element is registered under tagName,
            // in which case, the initialization is already carry on, and there is nothing else
            // to do here since this hook is called right after invoking `document.createElement`.
            return;
        }
        const { mode, ctor, uid, fallback } = vnode;
        setNodeOwnerKey$1(elm, uid);
        const def = getComponentDef(ctor);
        setElementProto(elm, def);
        if (isTrue(fallback)) {
            const { shadowAttribute } = vnode;
            patchCustomElementProto(elm, {
                def,
                shadowAttribute,
            });
        }
        createVM(vnode.sel, elm, ctor, {
            mode,
            fallback,
        });
        const vm = getCustomElementVM(elm);
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.isTrue(isArray(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
        }
        if (process.env.NODE_ENV !== 'production') {
            patchCustomElementWithRestrictions(elm, EmptyObject);
        }
    }
    function createCustomElmDefaultHook(vnode) {
        modEvents.create(vnode);
        // Attrs need to be applied to element before props
        // IE11 will wipe out value on radio inputs if value
        // is set before type=radio.
        modAttrs.create(vnode);
        modProps.create(vnode);
        modStaticClassName.create(vnode);
        modStaticStyle.create(vnode);
        modComputedClassName.create(vnode);
        modComputedStyle.create(vnode);
        contextModule.create(vnode);
    }
    function createChildrenHook(vnode) {
        const { elm, children } = vnode;
        for (let j = 0; j < children.length; ++j) {
            const ch = children[j];
            if (ch != null) {
                ch.hook.create(ch);
                ch.hook.insert(ch, elm, null);
            }
        }
    }
    function renderCustomElmHook(vnode) {
        const vm = getCustomElementVM(vnode.elm);
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.isTrue(isArray(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
        }
        renderVM(vm);
    }
    function updateCustomElmDefaultHook(oldVnode, vnode) {
        // Attrs need to be applied to element before props
        // IE11 will wipe out value on radio inputs if value
        // is set before type=radio.
        modAttrs.update(oldVnode, vnode);
        modProps.update(oldVnode, vnode);
        modComputedClassName.update(oldVnode, vnode);
        modComputedStyle.update(oldVnode, vnode);
    }
    function removeElmHook(vnode) {
        vnode.hook.destroy(vnode);
    }
    function destroyCustomElmHook(vnode) {
        removeVM(getCustomElementVM(vnode.elm));
    }
    function destroyElmHook(vnode) {
        const { children } = vnode;
        for (let j = 0, len = children.length; j < len; ++j) {
            const ch = children[j];
            if (ch != null) {
                ch.hook.destroy(ch);
            }
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const Services = create(null);
    const hooks = ['wiring', 'locator', 'rendered', 'connected', 'disconnected'];
    function register(service) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(isObject(service), `Invalid service declaration, ${service}: service must be an object`);
        }
        for (let i = 0; i < hooks.length; ++i) {
            const hookName = hooks[i];
            if (hookName in service) {
                let l = Services[hookName];
                if (isUndefined(l)) {
                    Services[hookName] = l = [];
                }
                ArrayPush.call(l, service[hookName]);
            }
        }
    }
    function invokeServiceHook(vm, cbs) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.isTrue(isArray(cbs) && cbs.length > 0, `Optimize invokeServiceHook() to be invoked only when needed`);
        }
        const { component, data, def, context } = vm;
        for (let i = 0, len = cbs.length; i < len; ++i) {
            cbs[i].call(undefined, component, data, def, context);
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const { createElement: createElement$1, createElementNS: createElementNS$1, createTextNode: createTextNode$1, createComment: createComment$1, } = document;
    const CHAR_S = 115;
    const CHAR_V = 118;
    const CHAR_G = 103;
    const NamespaceAttributeForSVG = 'http://www.w3.org/2000/svg';
    const SymbolIterator = Symbol.iterator;
    function noop() { }
    const TextHook = {
        create: (vnode) => {
            if (isUndefined(vnode.elm)) {
                // supporting the ability to inject an element via a vnode
                // this is used mostly for caching in compiler
                vnode.elm = createTextNode$1.call(document, vnode.text);
            }
            createTextHook(vnode);
        },
        update: updateNodeHook,
        insert: insertNodeHook,
        move: insertNodeHook,
        remove: removeNodeHook,
        destroy: noop,
    };
    const CommentHook = {
        create: (vnode) => {
            if (isUndefined(vnode.elm)) {
                // supporting the ability to inject an element via a vnode
                // this is used mostly for caching in compiler
                vnode.elm = createComment$1.call(document, vnode.text);
            }
            createCommentHook(vnode);
        },
        update: updateNodeHook,
        insert: insertNodeHook,
        move: insertNodeHook,
        remove: removeNodeHook,
        destroy: noop,
    };
    // insert is called after update, which is used somewhere else (via a module)
    // to mark the vm as inserted, that means we cannot use update as the main channel
    // to rehydrate when dirty, because sometimes the element is not inserted just yet,
    // which breaks some invariants. For that reason, we have the following for any
    // Custom Element that is inserted via a template.
    const ElementHook = {
        create: (vnode) => {
            const { data, sel, elm } = vnode;
            const { ns, create: create$$1 } = data;
            if (isUndefined(elm)) {
                // supporting the ability to inject an element via a vnode
                // this is used mostly for caching in compiler and style tags
                vnode.elm = isUndefined(ns)
                    ? createElement$1.call(document, sel)
                    : createElementNS$1.call(document, ns, sel);
            }
            createElmHook(vnode);
            create$$1(vnode);
        },
        update: (oldVnode, vnode) => {
            const { data: { update } } = vnode;
            update(oldVnode, vnode);
            updateChildrenHook(oldVnode, vnode);
        },
        insert: (vnode, parentNode, referenceNode) => {
            insertBefore.call(parentNode, vnode.elm, referenceNode);
            createChildrenHook(vnode);
        },
        move: (vnode, parentNode, referenceNode) => {
            insertBefore.call(parentNode, vnode.elm, referenceNode);
        },
        remove: (vnode, parentNode) => {
            removeChild.call(parentNode, vnode.elm);
            removeElmHook(vnode);
        },
        destroy: destroyElmHook,
    };
    const CustomElementHook = {
        create: (vnode) => {
            const { sel, data: { create: create$$1 }, elm } = vnode;
            if (isUndefined(elm)) {
                // supporting the ability to inject an element via a vnode
                // this is used mostly for caching in compiler and style tags
                vnode.elm = createElement$1.call(document, sel);
            }
            createCustomElmHook(vnode);
            allocateChildrenHook(vnode);
            create$$1(vnode);
        },
        update: (oldVnode, vnode) => {
            const { data: { update } } = vnode;
            update(oldVnode, vnode);
            // in fallback mode, the allocation will always the children to
            // empty and delegate the real allocation to the slot elements
            allocateChildrenHook(vnode);
            // in fallback mode, the children will be always empty, so, nothing
            // will happen, but in native, it does allocate the light dom
            updateChildrenHook(oldVnode, vnode);
            // this will update the shadowRoot
            renderCustomElmHook(vnode);
        },
        insert: (vnode, parentNode, referenceNode) => {
            insertBefore.call(parentNode, vnode.elm, referenceNode);
            createChildrenHook(vnode);
            insertCustomElmHook(vnode);
        },
        move: (vnode, parentNode, referenceNode) => {
            insertBefore.call(parentNode, vnode.elm, referenceNode);
        },
        remove: (vnode, parentNode) => {
            removeChild.call(parentNode, vnode.elm);
            removeElmHook(vnode);
        },
        destroy: (vnode) => {
            destroyCustomElmHook(vnode);
            destroyElmHook(vnode);
        },
    };
    // TODO: this should be done by the compiler, adding ns to every sub-element
    function addNS(vnode) {
        const { data, children, sel } = vnode;
        // TODO: review why `sel` equal `foreignObject` should get this `ns`
        data.ns = NamespaceAttributeForSVG;
        if (isArray(children) && sel !== 'foreignObject') {
            for (let j = 0, n = children.length; j < n; ++j) {
                const childNode = children[j];
                if (childNode != null && childNode.hook === ElementHook) {
                    addNS(childNode);
                }
            }
        }
    }
    function getCurrentOwnerId() {
        if (process.env.NODE_ENV !== 'production') {
            // TODO: enable this after refactoring all failing tests
            if (isNull(vmBeingRendered)) {
                return 0;
            }
            // assert.invariant(!isNull(vmBeingRendered), `Invalid invocation of getCurrentOwnerId().`);
        }
        return vmBeingRendered.uid;
    }
    const getCurrentFallback = isNativeShadowRootAvailable ?
        function () {
            if (process.env.NODE_ENV !== 'production') ;
            return vmBeingRendered.fallback;
        } : () => {
        if (process.env.NODE_ENV !== 'production') ;
        return true;
    };
    function getCurrentShadowAttribute() {
        if (process.env.NODE_ENV !== 'production') {
            // TODO: enable this after refactoring all failing tests
            if (isNull(vmBeingRendered)) {
                return;
            }
            // assert.invariant(!isNull(vmBeingRendered), `Invalid invocation of getCurrentShadowToken().`);
        }
        // TODO: remove this condition after refactoring all failing tests
        return vmBeingRendered.context.shadowAttribute;
    }
    // [h]tml node
    function h(sel, data, children) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(isString(sel), `h() 1st argument sel must be a string.`);
            assert.isTrue(isObject(data), `h() 2nd argument data must be an object.`);
            assert.isTrue(isArray(children), `h() 3rd argument children must be an array.`);
            assert.isTrue("key" in data, ` <${sel}> "key" attribute is invalid or missing for ${vmBeingRendered}. Key inside iterator is either undefined or null.`);
            // checking reserved internal data properties
            assert.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
            assert.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);
            if (data.style && !isString(data.style)) {
                assert.logWarning(`Invalid 'style' attribute passed to <${sel}> should be a string value, and will be ignored.`, vmBeingRendered.elm);
            }
            forEach.call(children, (childVnode) => {
                if (childVnode != null) {
                    assert.isTrue(childVnode && "sel" in childVnode && "data" in childVnode && "children" in childVnode && "text" in childVnode && "elm" in childVnode && "key" in childVnode, `${childVnode} is not a vnode.`);
                }
            });
        }
        const { key } = data;
        if (isUndefined(data.create)) {
            data.create = createElmDefaultHook;
        }
        if (isUndefined(data.update)) {
            data.update = updateElmDefaultHook;
        }
        let text, elm, shadowAttribute; // tslint:disable-line
        const fallback = getCurrentFallback();
        // shadowAttribute is only really needed in fallback mode
        if (fallback) {
            shadowAttribute = getCurrentShadowAttribute();
        }
        const uid = getCurrentOwnerId();
        const vnode = {
            sel,
            data,
            children,
            text,
            elm,
            key,
            hook: ElementHook,
            shadowAttribute,
            uid,
            fallback,
        };
        if (sel.length === 3 && StringCharCodeAt.call(sel, 0) === CHAR_S && StringCharCodeAt.call(sel, 1) === CHAR_V && StringCharCodeAt.call(sel, 2) === CHAR_G) {
            addNS(vnode);
        }
        return vnode;
    }
    // [t]ab[i]ndex function
    function ti(value) {
        // if value is greater than 0, we normalize to 0
        // If value is an invalid tabIndex value (null, undefined, string, etc), we let that value pass through
        // If value is less than -1, we don't care
        const shouldNormalize = (value > 0 && !(isTrue(value) || isFalse(value)));
        if (process.env.NODE_ENV !== 'production') {
            if (shouldNormalize) {
                assert.logWarning(`Invalid tabindex value \`${toString(value)}\` in template for ${vmBeingRendered}. This attribute can only be set to 0 or -1.`, vmBeingRendered.elm);
            }
        }
        return shouldNormalize ? 0 : value;
    }
    // [s]lot element node
    function s(slotName, data, children, slotset) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(isString(slotName), `s() 1st argument slotName must be a string.`);
            assert.isTrue(isObject(data), `s() 2nd argument data must be an object.`);
            assert.isTrue(isArray(children), `h() 3rd argument children must be an array.`);
        }
        if (!isUndefined(slotset) && !isUndefined(slotset[slotName]) && slotset[slotName].length !== 0) {
            children = slotset[slotName];
        }
        const vnode = h('slot', data, children);
        if (isTrue(vnode.fallback)) {
            markAsDynamicChildren(children);
        }
        return vnode;
    }
    // [c]ustom element node
    function c(sel, Ctor, data, children) {
        if (isCircularModuleDependency(Ctor)) {
            Ctor = resolveCircularModuleDependency(Ctor);
        }
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(isString(sel), `c() 1st argument sel must be a string.`);
            assert.isTrue(isFunction(Ctor), `c() 2nd argument Ctor must be a function.`);
            assert.isTrue(isObject(data), `c() 3nd argument data must be an object.`);
            assert.isTrue(arguments.length === 3 || isArray(children), `c() 4nd argument data must be an array.`);
            // TODO: enable this once all tests are changed to use compileTemplate utility
            // assert.isTrue("key" in compilerData, ` <${sel}> "key" attribute is invalid or missing for ${vmBeingRendered}. Key inside iterator is either undefined or null.`);
            // checking reserved internal data properties
            assert.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
            assert.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);
            if (data.style && !isString(data.style)) {
                assert.logWarning(`Invalid 'style' attribute passed to <${sel}> should be a string value, and will be ignored.`, vmBeingRendered.elm);
            }
            if (arguments.length === 4) {
                forEach.call(children, (childVnode) => {
                    if (childVnode != null) {
                        assert.isTrue(childVnode && "sel" in childVnode && "data" in childVnode && "children" in childVnode && "text" in childVnode && "elm" in childVnode && "key" in childVnode, `${childVnode} is not a vnode.`);
                    }
                });
            }
        }
        const { key } = data;
        if (isUndefined(data.create)) {
            data.create = createCustomElmDefaultHook;
        }
        if (isUndefined(data.update)) {
            data.update = updateCustomElmDefaultHook;
        }
        let text, elm, shadowAttribute; // tslint:disable-line
        const fallback = getCurrentFallback();
        // shadowAttribute is only really needed in fallback mode
        if (fallback) {
            shadowAttribute = getCurrentShadowAttribute();
        }
        const uid = getCurrentOwnerId();
        children = arguments.length === 3 ? EmptyArray : children;
        const vnode = {
            sel,
            data,
            children,
            text,
            elm,
            key,
            hook: CustomElementHook,
            ctor: Ctor,
            shadowAttribute,
            uid,
            fallback,
            mode: 'open',
        };
        return vnode;
    }
    // [i]terable node
    function i(iterable, factory) {
        const list = [];
        // marking the list as generated from iteration so we can optimize the diffing
        markAsDynamicChildren(list);
        if (isUndefined(iterable) || iterable === null) {
            if (process.env.NODE_ENV !== 'production') {
                assert.logWarning(`Invalid template iteration for value "${iterable}" in ${vmBeingRendered}, it should be an Array or an iterable Object.`, vmBeingRendered.elm);
            }
            return list;
        }
        if (process.env.NODE_ENV !== 'production') {
            assert.isFalse(isUndefined(iterable[SymbolIterator]), `Invalid template iteration for value \`${iterable}\` in ${vmBeingRendered}, it requires an array-like object, not \`null\` or \`undefined\`.`);
        }
        const iterator = iterable[SymbolIterator]();
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(iterator && isFunction(iterator.next), `Invalid iterator function for "${iterable}" in ${vmBeingRendered}.`);
        }
        let next = iterator.next();
        let j = 0;
        let { value, done: last } = next;
        let keyMap;
        let iterationError;
        if (process.env.NODE_ENV !== 'production') {
            keyMap = create(null);
        }
        while (last === false) {
            // implementing a look-back-approach because we need to know if the element is the last
            next = iterator.next();
            last = next.done;
            // template factory logic based on the previous collected value
            const vnode = factory(value, j, j === 0, last);
            if (isArray(vnode)) {
                ArrayPush.apply(list, vnode);
            }
            else {
                ArrayPush.call(list, vnode);
            }
            if (process.env.NODE_ENV !== 'production') {
                const vnodes = isArray(vnode) ? vnode : [vnode];
                forEach.call(vnodes, (childVnode) => {
                    if (!isNull(childVnode) && isObject(childVnode) && !isUndefined(childVnode.sel)) {
                        const { key } = childVnode;
                        if (isString(key) || isNumber(key)) {
                            if (keyMap[key] === 1 && isUndefined(iterationError)) {
                                iterationError = `Duplicated "key" attribute value for "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. Key with value "${childVnode.key}" appears more than once in iteration. Key values must be unique numbers or strings.`;
                            }
                            keyMap[key] = 1;
                        }
                        else if (isUndefined(iterationError)) {
                            iterationError = `Invalid "key" attribute value in "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. Instead set a unique "key" attribute value on all iteration children so internal state can be preserved during rehydration.`;
                        }
                    }
                });
            }
            // preparing next value
            j += 1;
            value = next.value;
        }
        if (process.env.NODE_ENV !== 'production') {
            if (!isUndefined(iterationError)) {
                assert.logError(iterationError, vmBeingRendered.elm);
            }
        }
        return list;
    }
    /**
     * [f]lattening
     */
    function f(items) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(isArray(items), 'flattening api can only work with arrays.');
        }
        const len = items.length;
        const flattened = [];
        // all flattened nodes should be marked as dynamic because
        // flattened nodes are because of a conditional or iteration.
        // We have to mark as dynamic because this could switch from an
        // iterator to "static" text at any time.
        // TODO: compiler should give us some sort of indicator
        // to describe whether a vnode is dynamic or not
        markAsDynamicChildren(flattened);
        for (let j = 0; j < len; j += 1) {
            const item = items[j];
            if (isArray(item)) {
                ArrayPush.apply(flattened, item);
            }
            else {
                ArrayPush.call(flattened, item);
            }
        }
        return flattened;
    }
    // [t]ext node
    function t(text) {
        const data = EmptyObject;
        let sel, children, key, elm; // tslint:disable-line
        return {
            sel,
            data,
            children,
            text,
            elm,
            key,
            hook: TextHook,
            uid: getCurrentOwnerId(),
            fallback: getCurrentFallback(),
        };
    }
    // comment node
    function p(text) {
        const data = EmptyObject;
        let sel = '!', children, key, elm; // tslint:disable-line
        return {
            sel,
            data,
            children,
            text,
            elm,
            key,
            hook: CommentHook,
            uid: getCurrentOwnerId(),
            fallback: getCurrentFallback(),
        };
    }
    // [d]ynamic value to produce a text vnode
    function d(value) {
        if (value == null) {
            return null;
        }
        return t(value);
    }
    // [b]ind function
    function b(fn) {
        if (isNull(vmBeingRendered)) {
            throw new Error();
        }
        const vm = vmBeingRendered;
        return function (event) {
            invokeEventListener(vm, fn, vm.component, event);
        };
    }
    // [f]unction_[b]ind
    function fb(fn) {
        if (isNull(vmBeingRendered)) {
            throw new Error();
        }
        const vm = vmBeingRendered;
        return function () {
            return invokeComponentCallback(vm, fn, ArraySlice.call(arguments));
        };
    }
    // [l]ocator_[l]istener function
    function ll(originalHandler, id, context) {
        if (isNull(vmBeingRendered)) {
            throw new Error();
        }
        const vm = vmBeingRendered;
        // bind the original handler with b() so we can call it
        // after resolving the locator
        const eventListener = b(originalHandler);
        // create a wrapping handler to resolve locator, and
        // then invoke the original handler.
        return function (event) {
            // located service for the locator metadata
            const { context: { locator } } = vm;
            if (!isUndefined(locator)) {
                const { locator: locatorService } = Services;
                if (locatorService) {
                    locator.resolved = {
                        target: id,
                        host: locator.id,
                        targetContext: isFunction(context) && context(),
                        hostContext: isFunction(locator.context) && locator.context()
                    };
                    // a registered `locator` service will be invoked with
                    // access to the context.locator.resolved, which will contain:
                    // outer id, outer context, inner id, and inner context
                    invokeServiceHook(vm, locatorService);
                }
            }
            // invoke original event listener via b()
            eventListener(event);
        };
    }
    // [k]ey function
    function k(compilerKey, obj) {
        switch (typeof obj) {
            case 'number':
            // TODO: when obj is a numeric key, we might be able to use some
            // other strategy to combine two numbers into a new unique number
            case 'string':
                return compilerKey + ':' + obj;
            case 'object':
                if (process.env.NODE_ENV !== 'production') {
                    assert.fail(`Invalid key value "${obj}" in ${vmBeingRendered}. Key must be a string or number.`);
                }
        }
    }
    // [g]lobal [id] function
    function gid(id) {
        if (isUndefined(id) || id === '') {
            if (process.env.NODE_ENV !== 'production') {
                assert.logError(`Invalid id value "${id}". Expected a non-empty string.`, vmBeingRendered.elm);
            }
            return id;
        }
        return isNull(id) ? id : `${id}-${getCurrentOwnerId()}`;
    }

    var api$1 = /*#__PURE__*/Object.freeze({
        h: h,
        ti: ti,
        s: s,
        c: c,
        i: i,
        f: f,
        t: t,
        p: p,
        d: d,
        b: b,
        fb: fb,
        ll: ll,
        k: k,
        gid: gid
    });

    const signedTemplateSet = new Set();
    function defaultEmptyTemplate() {
        return [];
    }
    signedTemplateSet.add(defaultEmptyTemplate);
    function isTemplateRegistered(tpl) {
        return signedTemplateSet.has(tpl);
    }
    // chaining this method as a way to wrap existing
    // assignment of templates easily, without too much transformation
    function registerTemplate(tpl) {
        signedTemplateSet.add(tpl);
        return tpl;
    }
    // locker-service patches this function during runtime to sanitize vulnerable attributes.
    // when ran off-core this function becomes a noop and returns the user authored value.
    function sanitizeAttribute(tagName, namespaceUri, attrName, attrValue) {
        return attrValue;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const CachedStyleFragments = create(null);
    function createStyleElement(styleContent) {
        const elm = createElement.call(document, 'style');
        elm.type = 'text/css';
        elm.textContent = styleContent;
        return elm;
    }
    function getCachedStyleElement(styleContent) {
        let fragment = CachedStyleFragments[styleContent];
        if (isUndefined(fragment)) {
            fragment = createDocumentFragment.call(document);
            const elm = createStyleElement(styleContent);
            appendChild.call(fragment, elm);
            CachedStyleFragments[styleContent] = fragment;
        }
        return fragment.cloneNode(true).firstChild;
    }
    const globalStyleParent = document.head || document.body || document;
    const InsertedGlobalStyleContent = create(null);
    function insertGlobalStyle(styleContent) {
        // inserts the global style when needed, otherwise does nothing
        if (isUndefined(InsertedGlobalStyleContent[styleContent])) {
            InsertedGlobalStyleContent[styleContent] = true;
            const elm = createStyleElement(styleContent);
            appendChild.call(globalStyleParent, elm);
        }
    }
    function noop$1() {
        /** do nothing */
    }
    function createStyleVNode(elm) {
        const vnode = h('style', {
            key: 'style',
            create: noop$1,
            update: noop$1,
        }, EmptyArray);
        // Force the diffing algo to use the cloned style.
        vnode.elm = elm;
        return vnode;
    }
    /**
     * Reset the styling token applied to the host element.
     */
    function resetStyleAttributes(vm) {
        const { context, elm } = vm;
        // Remove the style attribute currently applied to the host element.
        const oldHostAttribute = context.hostAttribute;
        if (!isUndefined(oldHostAttribute)) {
            removeAttribute.call(elm, oldHostAttribute);
        }
        // Reset the scoping attributes associated to the context.
        context.hostAttribute = context.shadowAttribute = undefined;
    }
    /**
     * Apply/Update the styling token applied to the host element.
     */
    function applyStyleAttributes(vm, hostAttribute, shadowAttribute) {
        const { context, elm } = vm;
        // Remove the style attribute currently applied to the host element.
        setAttribute.call(elm, hostAttribute, '');
        context.hostAttribute = hostAttribute;
        context.shadowAttribute = shadowAttribute;
    }
    function evaluateCSS(vm, stylesheets, hostAttribute, shadowAttribute) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.isTrue(isArray(stylesheets), `Invalid stylesheets.`);
        }
        const { fallback } = vm;
        if (fallback) {
            const hostSelector = `[${hostAttribute}]`;
            const shadowSelector = `[${shadowAttribute}]`;
            return forEach.call(stylesheets, stylesheet => {
                const textContent = stylesheet(hostSelector, shadowSelector, false);
                insertGlobalStyle(textContent);
            });
        }
        else {
            // Native shadow in place, we need to act accordingly by using the `:host` selector, and an
            // empty shadow selector since it is not really needed.
            const textContent = ArrayReduce.call(stylesheets, (buffer, stylesheet) => {
                return buffer + stylesheet(emptyString, emptyString, true);
            }, '');
            return createStyleVNode(getCachedStyleElement(textContent));
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const EmptySlots = create(null);
    function validateSlots(vm, html) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        const { cmpSlots = EmptySlots } = vm;
        const { slots = EmptyArray } = html;
        for (const slotName in cmpSlots) {
            // tslint:disable-next-line no-production-assert
            assert.isTrue(isArray(cmpSlots[slotName]), `Slots can only be set to an array, instead received ${toString(cmpSlots[slotName])} for slot "${slotName}" in ${vm}.`);
            if (ArrayIndexOf.call(slots, slotName) === -1) {
                // TODO: this should never really happen because the compiler should always validate
                // tslint:disable-next-line no-production-assert
                assert.logWarning(`Ignoring unknown provided slot name "${slotName}" in ${vm}. This is probably a typo on the slot attribute.`, vm.elm);
            }
        }
    }
    function validateFields(vm, html) {
        if (process.env.NODE_ENV === 'production') {
            // this method should never leak to prod
            throw new ReferenceError();
        }
        const component = vm.component;
        // validating identifiers used by template that should be provided by the component
        const { ids = [] } = html;
        forEach.call(ids, (propName) => {
            if (!(propName in component)) {
                // tslint:disable-next-line no-production-assert
                assert.logWarning(`The template rendered by ${vm} references \`this.${propName}\`, which is not declared. This is likely a typo in the template.`, vm.elm);
            }
            else if (hasOwnProperty.call(component, propName)) {
                // tslint:disable-next-line no-production-assert
                assert.fail(`${component}'s template is accessing \`this.${toString(propName)}\`, which is considered a non-reactive private field. Instead access it via a getter or make it reactive by decorating it with \`@track ${toString(propName)}\`.`);
            }
        });
    }
    function evaluateTemplate(vm, html) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.isTrue(isFunction(html), `evaluateTemplate() second argument must be an imported template instead of ${toString(html)}`);
        }
        // TODO: add identity to the html functions
        const { component, context, cmpSlots, cmpTemplate } = vm;
        // reset the cache memoizer for template when needed
        if (html !== cmpTemplate) {
            // It is important to reset the content to avoid reusing similar elements generated from a different
            // template, because they could have similar IDs, and snabbdom just rely on the IDs.
            resetShadowRoot(vm);
            // Check that the template was built by the compiler
            if (!isTemplateRegistered(html)) {
                throw new ReferenceError(`Invalid template returned by the render() method on ${vm}. It must return an imported template (e.g.: \`import html from "./${vm.def.name}.html"\`), instead, it has returned: ${toString(html)}.`);
            }
            vm.cmpTemplate = html;
            // Populate context with template information
            context.tplCache = create(null);
            resetStyleAttributes(vm);
            const { stylesheets, stylesheetTokens } = html;
            if (isUndefined(stylesheets) || stylesheets.length === 0) {
                context.styleVNode = undefined;
            }
            else if (!isUndefined(stylesheetTokens)) {
                const { hostAttribute, shadowAttribute } = stylesheetTokens;
                applyStyleAttributes(vm, hostAttribute, shadowAttribute);
                // Caching style vnode so it can be reused on every render
                context.styleVNode = evaluateCSS(vm, stylesheets, hostAttribute, shadowAttribute);
            }
            if (process.env.NODE_ENV !== 'production') {
                // one time operation for any new template returned by render()
                // so we can warn if the template is attempting to use a binding
                // that is not provided by the component instance.
                validateFields(vm, html);
            }
        }
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(isObject(context.tplCache), `vm.context.tplCache must be an object associated to ${cmpTemplate}.`);
            // validating slots in every rendering since the allocated content might change over time
            validateSlots(vm, html);
        }
        const vnodes = html.call(undefined, api$1, component, cmpSlots, context.tplCache);
        const { styleVNode } = context;
        if (!isUndefined(context.styleVNode)) {
            ArrayUnshift.call(vnodes, styleVNode);
        }
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(isArray(vnodes), `Compiler should produce html functions that always return an array.`);
        }
        return vnodes;
    }

    var GlobalMeasurementPhase;
    (function (GlobalMeasurementPhase) {
        GlobalMeasurementPhase["REHYDRATE"] = "lwc-rehydrate";
        GlobalMeasurementPhase["INIT"] = "lwc-init";
        GlobalMeasurementPhase["HYDRATE"] = "lwc-hydrate";
    })(GlobalMeasurementPhase || (GlobalMeasurementPhase = {}));
    // Even if all the browser the engine supports implements the UserTiming API, we need to guard the measure APIs.
    // JSDom (used in Jest) for example doesn't implement the UserTiming APIs
    const isUserTimingSupported = typeof performance !== 'undefined' &&
        typeof performance.mark === 'function' &&
        typeof performance.clearMarks === 'function' &&
        typeof performance.measure === 'function' &&
        typeof performance.clearMeasures === 'function';
    function getMarkName(vm, phase) {
        return `<${vm.def.name} (${vm.uid})> - ${phase}`;
    }
    function startMeasure(vm, phase) {
        if (!isUserTimingSupported) {
            return;
        }
        const name = getMarkName(vm, phase);
        performance.mark(name);
    }
    function endMeasure(vm, phase) {
        if (!isUserTimingSupported) {
            return;
        }
        const name = getMarkName(vm, phase);
        performance.measure(name, name);
        // Clear the created marks and measure to avoid filling the performance entries buffer.
        // Note: Even if the entries get deleted, existing PerformanceObservers preserve a copy of those entries.
        performance.clearMarks(name);
        performance.clearMeasures(name);
    }
    // tslint:disable-next-line:no-empty
    const noop$2 = function () { };
    function _startGlobalMeasure(phase) {
        performance.mark(phase);
    }
    function _endGlobalMeasure(phase) {
        performance.measure(phase, phase);
        performance.clearMarks(phase);
        performance.clearMeasures(phase);
    }
    function _startHydrateMeasure(vm) {
        performance.mark(getMarkName(vm, GlobalMeasurementPhase.HYDRATE));
    }
    function _endHydrateMeasure(vm) {
        const phase = GlobalMeasurementPhase.HYDRATE;
        const name = getMarkName(vm, phase);
        performance.measure(phase, name);
        performance.clearMarks(name);
        performance.clearMeasures(phase);
    }
    const startGlobalMeasure = isUserTimingSupported ? _startGlobalMeasure : noop$2;
    const endGlobalMeasure = isUserTimingSupported ? _endGlobalMeasure : noop$2;
    const startHydrateMeasure = isUserTimingSupported ? _startHydrateMeasure : noop$2;
    const endHydrateMeasure = isUserTimingSupported ? _endHydrateMeasure : noop$2;

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    let isRendering = false;
    let vmBeingRendered = null;
    let vmBeingConstructed = null;
    function isBeingConstructed(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        return vmBeingConstructed === vm;
    }
    function invokeComponentCallback(vm, fn, args) {
        const { context, component, callHook } = vm;
        let result;
        let error;
        try {
            result = callHook(component, fn, args);
        }
        catch (e) {
            error = Object(e);
        }
        finally {
            if (error) {
                error.wcStack = getErrorComponentStack(vm.elm);
                // rethrowing the original error annotated after restoring the context
                throw error; // tslint:disable-line
            }
        }
        return result;
    }
    function invokeComponentConstructor(vm, Ctor) {
        const vmBeingConstructedInception = vmBeingConstructed;
        vmBeingConstructed = vm;
        if (process.env.NODE_ENV !== 'production') {
            startMeasure(vm, 'constructor');
        }
        let error;
        try {
            new Ctor(); // tslint:disable-line
        }
        catch (e) {
            error = Object(e);
        }
        finally {
            if (process.env.NODE_ENV !== 'production') {
                endMeasure(vm, 'constructor');
            }
            vmBeingConstructed = vmBeingConstructedInception;
            if (error) {
                error.wcStack = getErrorComponentStack(vm.elm);
                // rethrowing the original error annotated after restoring the context
                throw error; // tslint:disable-line
            }
        }
    }
    function invokeComponentRenderMethod(vm) {
        const { def: { render }, callHook } = vm;
        const { component, context } = vm;
        const isRenderingInception = isRendering;
        const vmBeingRenderedInception = vmBeingRendered;
        isRendering = true;
        vmBeingRendered = vm;
        let result;
        let error;
        if (process.env.NODE_ENV !== 'production') {
            startMeasure(vm, 'render');
        }
        try {
            const html = callHook(component, render);
            result = evaluateTemplate(vm, html);
        }
        catch (e) {
            error = Object(e);
        }
        finally {
            if (process.env.NODE_ENV !== 'production') {
                endMeasure(vm, 'render');
            }
            isRendering = isRenderingInception;
            vmBeingRendered = vmBeingRenderedInception;
            if (error) {
                error.wcStack = getErrorComponentStack(vm.elm);
                // rethrowing the original error annotated after restoring the context
                throw error; // tslint:disable-line
            }
        }
        return result || [];
    }
    function invokeEventListener(vm, fn, thisValue, event) {
        const { context, callHook } = vm;
        let error;
        try {
            if (process.env.NODE_ENV !== 'production') {
                assert.isTrue(isFunction(fn), `Invalid event handler for event '${event.type}' on ${vm}.`);
            }
            callHook(thisValue, fn, [event]);
        }
        catch (e) {
            error = Object(e);
        }
        finally {
            if (error) {
                error.wcStack = getErrorComponentStack(vm.elm);
                // rethrowing the original error annotated after restoring the context
                throw error; // tslint:disable-line
            }
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const signedComponentToMetaMap = new Map();
    // chaining this method as a way to wrap existing
    // assignment of component constructor easily, without too much transformation
    function registerComponent(Ctor, { name, tmpl: template }) {
        signedComponentToMetaMap.set(Ctor, { name, template });
        return Ctor;
    }
    function getComponentRegisteredMeta(Ctor) {
        return signedComponentToMetaMap.get(Ctor);
    }
    function createComponent(vm, Ctor) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        // create the component instance
        invokeComponentConstructor(vm, Ctor);
        if (isUndefined(vm.component)) {
            throw new ReferenceError(`Invalid construction for ${Ctor}, you must extend LightningElement.`);
        }
    }
    function linkComponent(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        // wiring service
        const { def: { wire } } = vm;
        if (wire) {
            const { wiring } = Services;
            if (wiring) {
                invokeServiceHook(vm, wiring);
            }
        }
    }
    function clearReactiveListeners(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        const { deps } = vm;
        const len = deps.length;
        if (len) {
            for (let i = 0; i < len; i += 1) {
                const set = deps[i];
                const pos = ArrayIndexOf.call(deps[i], vm);
                if (process.env.NODE_ENV !== 'production') {
                    assert.invariant(pos > -1, `when clearing up deps, the vm must be part of the collection.`);
                }
                ArraySplice.call(set, pos, 1);
            }
            deps.length = 0;
        }
    }
    function renderComponent(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.invariant(vm.isDirty, `${vm} is not dirty.`);
        }
        clearReactiveListeners(vm);
        const vnodes = invokeComponentRenderMethod(vm);
        vm.isDirty = false;
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(isArray(vnodes), `${vm}.render() should always return an array of vnodes instead of ${vnodes}`);
        }
        return vnodes;
    }
    function markComponentAsDirty(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.isFalse(vm.isDirty, `markComponentAsDirty() for ${vm} should not be called when the component is already dirty.`);
            assert.isFalse(isRendering, `markComponentAsDirty() for ${vm} cannot be called during rendering of ${vmBeingRendered}.`);
        }
        vm.isDirty = true;
    }
    const cmpEventListenerMap = new WeakMap();
    function getWrappedComponentsListener(vm, listener) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        if (!isFunction(listener)) {
            throw new TypeError(); // avoiding problems with non-valid listeners
        }
        let wrappedListener = cmpEventListenerMap.get(listener);
        if (isUndefined(wrappedListener)) {
            wrappedListener = function (event) {
                invokeEventListener(vm, listener, undefined, event);
            };
            cmpEventListenerMap.set(listener, wrappedListener);
        }
        return wrappedListener;
    }
    function getComponentAsString(component) {
        if (process.env.NODE_ENV === 'production') {
            throw new ReferenceError();
        }
        const vm = getComponentVM(component);
        return `<${StringToLowerCase.call(tagNameGetter.call(vm.elm))}>`;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function apply$1() {
        function elemFromPoint(left, top) {
            const element = elementFromPoint.call(document, left, top);
            if (isNull(element)) {
                return element;
            }
            return retarget(document, pathComposer(element, true));
        }
        // https://github.com/Microsoft/TypeScript/issues/14139
        document.elementFromPoint = elemFromPoint;
        // Go until we reach to top of the LWC tree
        defineProperty(document, 'activeElement', {
            get() {
                let node = DocumentPrototypeActiveElement.call(this);
                if (isNull(node)) {
                    return node;
                }
                while (!isUndefined(getNodeOwnerKey$1(node))) {
                    node = parentElementGetter.call(node);
                }
                if (node.tagName === 'HTML') { // IE 11. Active element should never be html element
                    node = document.body;
                }
                return node;
            },
            enumerable: true,
            configurable: true,
        });
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    {
        apply$1();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function detect$3() {
        return typeof window.ShadowRoot === 'undefined';
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function apply$2() {
        window.ShadowRoot = SyntheticShadowRoot;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    if (detect$3()) {
        apply$2();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function detect$4() {
        // Don't apply polyfill when ProxyCompat is enabled.
        if ('getKey' in Proxy) {
            return false;
        }
        const proxy = new Proxy([3, 4], {});
        const res = [1, 2].concat(proxy);
        return res.length !== 4;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const { isConcatSpreadable } = Symbol;
    const { isArray: isArray$2 } = Array;
    const { slice: ArraySlice$1, unshift: ArrayUnshift$1, shift: ArrayShift } = Array.prototype;
    function isObject$2(O) {
        return typeof O === 'object' ? O !== null : typeof O === 'function';
    }
    // https://www.ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable
    function isSpreadable(O) {
        if (!isObject$2(O)) {
            return false;
        }
        const spreadable = O[isConcatSpreadable];
        return spreadable !== undefined ? Boolean(spreadable) : isArray$2(O);
    }
    // https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat
    function ArrayConcatPolyfill(...args) {
        const O = Object(this);
        const A = [];
        let N = 0;
        const items = ArraySlice$1.call(arguments);
        ArrayUnshift$1.call(items, O);
        while (items.length) {
            const E = ArrayShift.call(items);
            if (isSpreadable(E)) {
                let k = 0;
                const length = E.length;
                for (k; k < length; k += 1, N += 1) {
                    if (k in E) {
                        const subElement = E[k];
                        A[N] = subElement;
                    }
                }
            }
            else {
                A[N] = E;
                N += 1;
            }
        }
        return A;
    }
    function apply$3() {
        Array.prototype.concat = ArrayConcatPolyfill;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    if (detect$4()) {
        apply$3();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const composedDescriptor = Object.getOwnPropertyDescriptor(Event.prototype, 'composed');
    function detect$5() {
        if (!composedDescriptor) {
            // No need to apply this polyfill if this client completely lacks
            // support for the composed property.
            return false;
        }
        // Assigning a throwaway click event here to suppress a ts error when we
        // pass clickEvent into the composed getter below. The error is:
        // [ts] Variable 'clickEvent' is used before being assigned.
        let clickEvent = new Event('click');
        const button = document.createElement('button');
        button.addEventListener('click', event => clickEvent = event);
        button.click();
        return !composedDescriptor.get.call(clickEvent);
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const originalClickDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'click');
    function handleClick(event) {
        Object.defineProperty(event, 'composed', {
            configurable: true,
            enumerable: true,
            get() {
                return true;
            }
        });
    }
    function apply$4() {
        HTMLElement.prototype.click = function () {
            addEventListener.call(this, 'click', handleClick);
            try {
                originalClickDescriptor.value.call(this);
            }
            catch (ex) {
                throw ex;
            }
            finally {
                removeEventListener.call(this, 'click', handleClick);
            }
        };
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    if (detect$5()) {
        apply$4();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function detect$6() {
        return Object.getOwnPropertyDescriptor(Event.prototype, 'composed') === undefined;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function apply$5() {
        // https://github.com/w3c/webcomponents/issues/513#issuecomment-224183937
        const composedEvents = assign(create(null), {
            blur: 1,
            focus: 1,
            focusin: 1,
            focusout: 1,
            click: 1,
            dblclick: 1,
            mousedown: 1,
            mouseenter: 1,
            mouseleave: 1,
            mousemove: 1,
            mouseout: 1,
            mouseover: 1,
            mouseup: 1,
            wheel: 1,
            beforeinput: 1,
            input: 1,
            keydown: 1,
            keyup: 1,
            compositionstart: 1,
            compositionupdate: 1,
            compositionend: 1,
            touchstart: 1,
            touchend: 1,
            touchmove: 1,
            touchcancel: 1,
            pointerover: 1,
            pointerenter: 1,
            pointerdown: 1,
            pointermove: 1,
            pointerup: 1,
            pointercancel: 1,
            pointerout: 1,
            pointerleave: 1,
            gotpointercapture: 1,
            lostpointercapture: 1,
            dragstart: 1,
            drag: 1,
            dragenter: 1,
            dragleave: 1,
            dragover: 1,
            drop: 1,
            dragend: 1,
            DOMActivate: 1,
            DOMFocusIn: 1,
            DOMFocusOut: 1,
            keypress: 1,
        });
        // Composed for Native events
        Object.defineProperties(Event.prototype, {
            composed: {
                get() {
                    const { type } = this;
                    return composedEvents[type] === 1;
                },
                configurable: true,
                enumerable: true,
            },
        });
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    if (detect$6()) {
        apply$5();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const { CustomEvent: OriginalCustomEvent } = window;
    function PatchedCustomEvent(type, eventInitDict) {
        const event = new OriginalCustomEvent(type, eventInitDict);
        // support for composed on custom events
        Object.defineProperties(event, {
            composed: {
                // We can't use "value" here, because IE11 doesn't like mixing and matching
                // value with get() from Event.prototype.
                get() {
                    return !!(eventInitDict && eventInitDict.composed);
                },
                configurable: true,
                enumerable: true,
            },
        });
        return event;
    }
    function apply$6() {
        window.CustomEvent = PatchedCustomEvent;
        window.CustomEvent.prototype = OriginalCustomEvent.prototype;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function detect$7() {
        // We need to check if CustomEvent is our PatchedCustomEvent because jest
        // will reset the window object but not constructos and prototypes (e.g.,
        // Event.prototype).
        // https://github.com/jsdom/jsdom#shared-constructors-and-prototypes
        return window.CustomEvent !== PatchedCustomEvent;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    if (detect$7()) {
        apply$6();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function apply$7 () {
        const originalComposedGetter = Object.getOwnPropertyDescriptor(Event.prototype, 'composed').get;
        Object.defineProperties(FocusEvent.prototype, {
            composed: {
                get() {
                    const { isTrusted } = this;
                    const composed = originalComposedGetter.call(this);
                    if (isTrusted && composed === false) {
                        return true;
                    }
                    return composed;
                },
                enumerable: true,
                configurable: true,
            },
        });
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    {
        apply$7();
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    /**
     * This is a descriptor map that contains
     * all standard properties that a Custom Element can support (including AOM properties), which
     * determines what kind of capabilities the Base HTML Element and
     * Base Lightning Element should support.
     */
    const HTMLElementOriginalDescriptors = create(null);
    forEach.call(ElementPrototypeAriaPropertyNames, (propName) => {
        // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
        // in IE11, some properties are on Element.prototype instead of HTMLElement, just to be sure.
        const descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);
        if (!isUndefined(descriptor)) {
            HTMLElementOriginalDescriptors[propName] = descriptor;
        }
    });
    forEach.call(defaultDefHTMLPropertyNames, (propName) => {
        // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
        // in IE11, id property is on Element.prototype instead of HTMLElement, and we suspect that more will fall into
        // this category, so, better to be sure.
        const descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);
        if (!isUndefined(descriptor)) {
            HTMLElementOriginalDescriptors[propName] = descriptor;
        }
    });

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const GlobalEvent = Event; // caching global reference to avoid poisoning
    /**
     * This operation is called with a descriptor of an standard html property
     * that a Custom Element can support (including AOM properties), which
     * determines what kind of capabilities the Base Lightning Element should support. When producing the new descriptors
     * for the Base Lightning Element, it also include the reactivity bit, so the standard property is reactive.
     */
    function createBridgeToElementDescriptor(propName, descriptor) {
        const { get, set, enumerable, configurable } = descriptor;
        if (!isFunction(get)) {
            if (process.env.NODE_ENV !== 'production') {
                assert.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard getter.`);
            }
            throw new TypeError();
        }
        if (!isFunction(set)) {
            if (process.env.NODE_ENV !== 'production') {
                assert.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard setter.`);
            }
            throw new TypeError();
        }
        return {
            enumerable,
            configurable,
            get() {
                const vm = getComponentVM(this);
                if (process.env.NODE_ENV !== 'production') {
                    assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                }
                if (isBeingConstructed(vm)) {
                    if (process.env.NODE_ENV !== 'production') {
                        assert.logError(`${vm} constructor should not read the value of property "${propName}". The owner component has not yet set the value. Instead use the constructor to set default values for properties.`, vm.elm);
                    }
                    return;
                }
                observeMutation(this, propName);
                return get.call(vm.elm);
            },
            set(newValue) {
                const vm = getComponentVM(this);
                if (process.env.NODE_ENV !== 'production') {
                    assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                    assert.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${propName}`);
                    assert.isFalse(isBeingConstructed(vm), `Failed to construct '${getComponentAsString(this)}': The result must not have attributes.`);
                    assert.invariant(!isObject(newValue) || isNull(newValue), `Invalid value "${newValue}" for "${propName}" of ${vm}. Value cannot be an object, must be a primitive value.`);
                }
                if (newValue !== vm.cmpProps[propName]) {
                    vm.cmpProps[propName] = newValue;
                    if (vm.idx > 0) {
                        // perf optimization to skip this step if not in the DOM
                        notifyMutation(this, propName);
                    }
                }
                return set.call(vm.elm, newValue);
            }
        };
    }
    function getLinkedElement(cmp) {
        return getComponentVM(cmp).elm;
    }
    function BaseLightningElement() {
        // This should be as performant as possible, while any initialization should be done lazily
        if (isNull(vmBeingConstructed)) {
            throw new ReferenceError();
        }
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vmBeingConstructed && "cmpRoot" in vmBeingConstructed, `${vmBeingConstructed} is not a vm.`);
            assert.invariant(vmBeingConstructed.elm instanceof HTMLElement, `Component creation requires a DOM element to be associated to ${vmBeingConstructed}.`);
        }
        const vm = vmBeingConstructed;
        const { elm, cmpRoot, uid } = vm;
        const component = this;
        vm.component = component;
        // interaction hooks
        // We are intentionally hiding this argument from the formal API of LWCElement because
        // we don't want folks to know about it just yet.
        if (arguments.length === 1) {
            const { callHook, setHook, getHook } = arguments[0];
            vm.callHook = callHook;
            vm.setHook = setHook;
            vm.getHook = getHook;
        }
        // linking elm, shadow root and component with the VM
        setHiddenField(component, ViewModelReflection, vm);
        setInternalField(elm, ViewModelReflection, vm);
        setInternalField(cmpRoot, ViewModelReflection, vm);
        setNodeKey(elm, uid);
        if (process.env.NODE_ENV !== 'production') {
            patchComponentWithRestrictions(component, EmptyObject);
            patchShadowRootWithRestrictions(cmpRoot, EmptyObject);
        }
    }
    // HTML Element - The Good Parts
    BaseLightningElement.prototype = {
        constructor: BaseLightningElement,
        dispatchEvent(event) {
            const elm = getLinkedElement(this);
            const vm = getComponentVM(this);
            if (process.env.NODE_ENV !== 'production') {
                if (arguments.length === 0) {
                    throw new Error(`Failed to execute 'dispatchEvent' on ${getComponentAsString(this)}: 1 argument required, but only 0 present.`);
                }
                if (!(event instanceof GlobalEvent)) {
                    throw new Error(`Failed to execute 'dispatchEvent' on ${getComponentAsString(this)}: parameter 1 is not of type 'Event'.`);
                }
                const { type: evtName } = event;
                assert.isFalse(isBeingConstructed(vm), `this.dispatchEvent() should not be called during the construction of the custom element for ${getComponentAsString(this)} because no one is listening for the event "${evtName}" just yet.`);
                if (vm.idx === 0) {
                    assert.logWarning(`Unreachable event "${evtName}" dispatched from disconnected element ${getComponentAsString(this)}. Events can only reach the parent element after the element is connected (via connectedCallback) and before the element is disconnected(via disconnectedCallback).`, elm);
                }
                if (!evtName.match(/^[a-z]+([a-z0-9]+)?$/)) {
                    assert.logWarning(`Invalid event type "${evtName}" dispatched in element ${getComponentAsString(this)}. Event name should only contain lowercase alphanumeric characters.`, elm);
                }
            }
            return dispatchEvent.call(elm, event);
        },
        addEventListener(type, listener, options) {
            const vm = getComponentVM(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
                assert.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm} by adding an event listener for "${type}".`);
                assert.invariant(isFunction(listener), `Invalid second argument for this.addEventListener() in ${vm} for event "${type}". Expected an EventListener but received ${listener}.`);
            }
            const wrappedListener = getWrappedComponentsListener(vm, listener);
            vm.elm.addEventListener(type, wrappedListener, options);
        },
        removeEventListener(type, listener, options) {
            const vm = getComponentVM(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            }
            const wrappedListener = getWrappedComponentsListener(vm, listener);
            vm.elm.removeEventListener(type, wrappedListener, options);
        },
        setAttributeNS(ns, attrName, value) {
            const elm = getLinkedElement(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isFalse(isBeingConstructed(getComponentVM(this)), `Failed to construct '${getComponentAsString(this)}': The result must not have attributes.`);
            }
            unlockAttribute(elm, attrName);
            elm.setAttributeNS.apply(elm, arguments);
            lockAttribute(elm, attrName);
        },
        removeAttributeNS(ns, attrName) {
            const elm = getLinkedElement(this);
            unlockAttribute(elm, attrName);
            elm.removeAttributeNS.apply(elm, arguments);
            lockAttribute(elm, attrName);
        },
        removeAttribute(attrName) {
            const elm = getLinkedElement(this);
            unlockAttribute(elm, attrName);
            elm.removeAttribute.apply(elm, arguments);
            lockAttribute(elm, attrName);
        },
        setAttribute(attrName, value) {
            const elm = getLinkedElement(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isFalse(isBeingConstructed(getComponentVM(this)), `Failed to construct '${getComponentAsString(this)}': The result must not have attributes.`);
            }
            unlockAttribute(elm, attrName);
            elm.setAttribute.apply(elm, arguments);
            lockAttribute(elm, attrName);
        },
        getAttribute(attrName) {
            const elm = getLinkedElement(this);
            unlockAttribute(elm, attrName);
            const value = elm.getAttribute.apply(elm, arguments);
            lockAttribute(elm, attrName);
            return value;
        },
        getAttributeNS(ns, attrName) {
            const elm = getLinkedElement(this);
            unlockAttribute(elm, attrName);
            const value = elm.getAttributeNS.apply(elm, arguments);
            lockAttribute(elm, attrName);
            return value;
        },
        getBoundingClientRect() {
            const elm = getLinkedElement(this);
            if (process.env.NODE_ENV !== 'production') {
                const vm = getComponentVM(this);
                assert.isFalse(isBeingConstructed(vm), `this.getBoundingClientRect() should not be called during the construction of the custom element for ${getComponentAsString(this)} because the element is not yet in the DOM, instead, you can use it in one of the available life-cycle hooks.`);
            }
            return elm.getBoundingClientRect();
        },
        /**
         * Returns the first element that is a descendant of node that
         * matches selectors.
         */
        // querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
        // querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
        querySelector(selectors) {
            const vm = getComponentVM(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isFalse(isBeingConstructed(vm), `this.querySelector() cannot be called during the construction of the custom element for ${getComponentAsString(this)} because no children has been added to this element yet.`);
            }
            const { elm } = vm;
            return elm.querySelector(selectors);
        },
        /**
         * Returns all element descendants of node that
         * match selectors.
         */
        // querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>,
        // querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>,
        querySelectorAll(selectors) {
            const vm = getComponentVM(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isFalse(isBeingConstructed(vm), `this.querySelectorAll() cannot be called during the construction of the custom element for ${getComponentAsString(this)} because no children has been added to this element yet.`);
            }
            const { elm } = vm;
            return elm.querySelectorAll(selectors);
        },
        /**
         * Returns all element descendants of node that
         * match the provided tagName.
         */
        getElementsByTagName(tagNameOrWildCard) {
            const vm = getComponentVM(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isFalse(isBeingConstructed(vm), `this.getElementsByTagName() cannot be called during the construction of the custom element for ${getComponentAsString(this)} because no children has been added to this element yet.`);
            }
            const { elm } = vm;
            return elm.getElementsByTagName(tagNameOrWildCard);
        },
        /**
         * Returns all element descendants of node that
         * match the provide classnames.
         */
        getElementsByClassName(names) {
            const vm = getComponentVM(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isFalse(isBeingConstructed(vm), `this.getElementsByClassName() cannot be called during the construction of the custom element for ${getComponentAsString(this)} because no children has been added to this element yet.`);
            }
            const { elm } = vm;
            return elm.getElementsByClassName(names);
        },
        get classList() {
            if (process.env.NODE_ENV !== 'production') {
                const vm = getComponentVM(this);
                // TODO: this still fails in dev but works in production, eventually, we should just throw in all modes
                assert.isFalse(isBeingConstructed(vm), `Failed to construct ${vm}: The result must not have attributes. Adding or tampering with classname in constructor is not allowed in a web component, use connectedCallback() instead.`);
            }
            return getLinkedElement(this).classList;
        },
        get template() {
            const vm = getComponentVM(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            }
            return vm.cmpRoot;
        },
        get shadowRoot() {
            // From within the component instance, the shadowRoot is always
            // reported as "closed". Authors should rely on this.template instead.
            return null;
        },
        render() {
            const vm = getComponentVM(this);
            const { template } = vm.def;
            return isUndefined(template) ? defaultEmptyTemplate : template;
        },
        toString() {
            const vm = getComponentVM(this);
            if (process.env.NODE_ENV !== 'production') {
                assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            }
            return `[object ${vm.def.name}]`;
        },
    };
    const baseDescriptors = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), (descriptors, propName) => {
        descriptors[propName] = createBridgeToElementDescriptor(propName, HTMLElementOriginalDescriptors[propName]);
        return descriptors;
    }, create(null));
    defineProperties(BaseLightningElement.prototype, baseDescriptors);
    if (process.env.NODE_ENV !== 'production') {
        patchLightningElementPrototypeWithRestrictions(BaseLightningElement.prototype, EmptyObject);
    }
    freeze(BaseLightningElement);
    seal(BaseLightningElement.prototype);

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // A bridge descriptor is a descriptor whose job is just to get the component instance
    // from the element instance, and get the value or set a new value on the component.
    // This means that across different elements, similar names can get the exact same
    // descriptor, so we can cache them:
    const cachedGetterByKey = create(null);
    const cachedSetterByKey = create(null);
    function createGetter(key) {
        let fn = cachedGetterByKey[key];
        if (isUndefined(fn)) {
            fn = cachedGetterByKey[key] = function () {
                const vm = getCustomElementVM(this);
                const { getHook } = vm;
                return getHook(vm.component, key);
            };
        }
        return fn;
    }
    function createSetter(key) {
        let fn = cachedSetterByKey[key];
        if (isUndefined(fn)) {
            fn = cachedSetterByKey[key] = function (newValue) {
                const vm = getCustomElementVM(this);
                const { setHook } = vm;
                setHook(vm.component, key, newValue);
            };
        }
        return fn;
    }
    function createMethodCaller(methodName) {
        return function () {
            const vm = getCustomElementVM(this);
            const { callHook, component } = vm;
            const fn = component[methodName];
            return callHook(vm.component, fn, ArraySlice.call(arguments));
        };
    }
    function HTMLBridgeElementFactory(SuperClass, props, methods) {
        let HTMLBridgeElement;
        /**
         * Modern browsers will have all Native Constructors as regular Classes
         * and must be instantiated with the new keyword. In older browsers,
         * specifically IE11, those are objects with a prototype property defined,
         * since they are not supposed to be extended or instantiated with the
         * new keyword. This forking logic supports both cases, specifically because
         * wc.ts relies on the construction path of the bridges to create new
         * fully qualifying web components.
         */
        if (isFunction(SuperClass)) {
            HTMLBridgeElement = class extends SuperClass {
            };
        }
        else {
            HTMLBridgeElement = function () {
                // Bridge classes are not supposed to be instantiated directly in
                // browsers that do not support web components.
                throw new TypeError('Illegal constructor');
            };
            // prototype inheritance dance
            setPrototypeOf(HTMLBridgeElement, SuperClass);
            setPrototypeOf(HTMLBridgeElement.prototype, SuperClass.prototype);
            defineProperty(HTMLBridgeElement.prototype, 'constructor', {
                writable: true,
                configurable: true,
                value: HTMLBridgeElement,
            });
        }
        const descriptors = create(null);
        // expose getters and setters for each public props on the new Element Bridge
        for (let i = 0, len = props.length; i < len; i += 1) {
            const propName = props[i];
            descriptors[propName] = {
                get: createGetter(propName),
                set: createSetter(propName),
                enumerable: true,
                configurable: true,
            };
        }
        // expose public methods as props on the new Element Bridge
        for (let i = 0, len = methods.length; i < len; i += 1) {
            const methodName = methods[i];
            descriptors[methodName] = {
                value: createMethodCaller(methodName),
                writable: true,
                configurable: true,
            };
        }
        defineProperties(HTMLBridgeElement.prototype, descriptors);
        return HTMLBridgeElement;
    }
    const BaseBridgeElement = HTMLBridgeElementFactory(HTMLElement, getOwnPropertyNames(HTMLElementOriginalDescriptors), []);
    freeze(BaseBridgeElement);
    seal(BaseBridgeElement.prototype);

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const CtorToDefMap = new WeakMap();
    function getCtorProto(Ctor, subclassComponentName) {
        let proto = getPrototypeOf(Ctor);
        if (isNull(proto)) {
            throw new ReferenceError(`Invalid prototype chain for ${subclassComponentName}, you must extend LightningElement.`);
        }
        // covering the cases where the ref is circular in AMD
        if (isCircularModuleDependency(proto)) {
            const p = resolveCircularModuleDependency(proto);
            if (process.env.NODE_ENV !== 'production') {
                if (isNull(p)) {
                    throw new ReferenceError(`Circular module dependency for ${subclassComponentName}, must resolve to a constructor that extends LightningElement.`);
                }
            }
            // escape hatch for Locker and other abstractions to provide their own base class instead
            // of our Base class without having to leak it to user-land. If the circular function returns
            // itself, that's the signal that we have hit the end of the proto chain, which must always
            // be base.
            proto = p === proto ? BaseLightningElement : p;
        }
        return proto;
    }
    function isElementComponent(Ctor, subclassComponentName, protoSet) {
        protoSet = protoSet || [];
        if (!Ctor || ArrayIndexOf.call(protoSet, Ctor) >= 0) {
            return false; // null, undefined, or circular prototype definition
        }
        const proto = getCtorProto(Ctor, subclassComponentName);
        if (proto === BaseLightningElement) {
            return true;
        }
        getComponentDef(proto, subclassComponentName); // ensuring that the prototype chain is already expanded
        ArrayPush.call(protoSet, Ctor);
        return isElementComponent(proto, subclassComponentName, protoSet);
    }
    function createComponentDef(Ctor, meta, subclassComponentName) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(isElementComponent(Ctor, subclassComponentName), `${Ctor} is not a valid component, or does not extends LightningElement from "lwc". You probably forgot to add the extend clause on the class declaration.`);
            // local to dev block
            const ctorName = Ctor.name;
            // Removing the following assert until https://bugs.webkit.org/show_bug.cgi?id=190140 is fixed.
            // assert.isTrue(ctorName && isString(ctorName), `${toString(Ctor)} should have a "name" property with string value, but found ${ctorName}.`);
            assert.isTrue(Ctor.constructor, `Missing ${ctorName}.constructor, ${ctorName} should have a "constructor" property.`);
        }
        const { name, template } = meta;
        let decoratorsMeta = getDecoratorsRegisteredMeta(Ctor);
        // TODO: eventually, the compiler should do this call directly, but we will also
        // have to fix all our tests, which are using this declaration manually.
        if (isUndefined(decoratorsMeta)) {
            registerDecorators(Ctor, {
                publicMethods: getOwnValue(Ctor, 'publicMethods'),
                publicProps: getOwnValue(Ctor, 'publicProps'),
                track: getOwnValue(Ctor, 'track'),
                wire: getOwnValue(Ctor, 'wire'),
            });
            decoratorsMeta = getDecoratorsRegisteredMeta(Ctor);
        }
        let { props, methods, wire, track } = decoratorsMeta || EmptyObject;
        const proto = Ctor.prototype;
        let { connectedCallback, disconnectedCallback, renderedCallback, errorCallback, render, } = proto;
        const superProto = getCtorProto(Ctor, subclassComponentName);
        const superDef = superProto !== BaseLightningElement ? getComponentDef(superProto, subclassComponentName) : null;
        const SuperBridge = isNull(superDef) ? BaseBridgeElement : superDef.bridge;
        const bridge = HTMLBridgeElementFactory(SuperBridge, getOwnPropertyNames(props), getOwnPropertyNames(methods));
        if (!isNull(superDef)) {
            props = assign(create(null), superDef.props, props);
            methods = assign(create(null), superDef.methods, methods);
            wire = (superDef.wire || wire) ? assign(create(null), superDef.wire, wire) : undefined;
            track = assign(create(null), superDef.track, track);
            connectedCallback = connectedCallback || superDef.connectedCallback;
            disconnectedCallback = disconnectedCallback || superDef.disconnectedCallback;
            renderedCallback = renderedCallback || superDef.renderedCallback;
            errorCallback = errorCallback || superDef.errorCallback;
            render = render || superDef.render;
        }
        props = assign(create(null), HTML_PROPS, props);
        const def = {
            ctor: Ctor,
            name,
            wire,
            track,
            props,
            methods,
            bridge,
            template,
            connectedCallback,
            disconnectedCallback,
            renderedCallback,
            errorCallback,
            render,
        };
        if (process.env.NODE_ENV !== 'production') {
            freeze(Ctor.prototype);
        }
        return def;
    }
    function isComponentConstructor(Ctor) {
        return isElementComponent(Ctor, Ctor.name);
    }
    function getOwnValue(o, key) {
        const d = getOwnPropertyDescriptor(o, key);
        return d && d.value;
    }
    function getComponentDef(Ctor, subclassComponentName) {
        let def = CtorToDefMap.get(Ctor);
        if (def) {
            return def;
        }
        let meta = getComponentRegisteredMeta(Ctor);
        if (isUndefined(meta)) {
            // TODO: remove this workaround:
            // this is temporary until
            // all tests are updated to call registerComponent:
            meta = {
                template: undefined,
                name: Ctor.name,
            };
        }
        def = createComponentDef(Ctor, meta, subclassComponentName || Ctor.name);
        CtorToDefMap.set(Ctor, def);
        return def;
    }
    /**
     * Returns the component constructor for a given HTMLElement if it can be found
     * @param {HTMLElement} element
     * @return {ComponentConstructor | null}
     */
    function getComponentConstructor(elm) {
        let ctor = null;
        if (elm instanceof HTMLElement) {
            const vm = getInternalField(elm, ViewModelReflection);
            if (!isUndefined(vm)) {
                ctor = vm.def.ctor;
            }
        }
        return ctor;
    }
    // Only set prototype for public methods and properties
    // No DOM Patching occurs here
    function setElementProto(elm, def) {
        setPrototypeOf(elm, def.bridge.prototype);
    }
    const HTML_PROPS = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), (props, propName) => {
        const attrName = getAttrNameFromPropName(propName);
        props[propName] = {
            config: 3,
            type: 'any',
            attr: attrName,
        };
        return props;
    }, create(null));

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // Object of type ShadowRoot for instance checks
    const NativeShadowRoot = window.ShadowRoot;
    const isNativeShadowRootAvailable$1 = typeof NativeShadowRoot !== "undefined";
    let idx = 0;
    let uid = 0;
    function callHook(cmp, fn, args) {
        return fn.apply(cmp, args);
    }
    function setHook(cmp, prop, newValue) {
        cmp[prop] = newValue;
    }
    function getHook(cmp, prop) {
        return cmp[prop];
    }
    // DO NOT CHANGE this:
    // these two values are used by the faux-shadow implementation to traverse the DOM
    const OwnerKey$1 = '$$OwnerKey$$';
    const OwnKey$1 = '$$OwnKey$$';
    function addInsertionIndex(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.invariant(vm.idx === 0, `${vm} is already locked to a previously generated idx.`);
        }
        vm.idx = ++idx;
        const { connected } = Services;
        if (connected) {
            invokeServiceHook(vm, connected);
        }
        const { connectedCallback } = vm.def;
        if (!isUndefined(connectedCallback)) {
            if (process.env.NODE_ENV !== 'production') {
                startMeasure(vm, 'connectedCallback');
            }
            invokeComponentCallback(vm, connectedCallback);
            if (process.env.NODE_ENV !== 'production') {
                endMeasure(vm, 'connectedCallback');
            }
        }
    }
    function removeInsertionIndex(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.invariant(vm.idx > 0, `${vm} is not locked to a previously generated idx.`);
        }
        vm.idx = 0;
        const { disconnected } = Services;
        if (disconnected) {
            invokeServiceHook(vm, disconnected);
        }
        const { disconnectedCallback } = vm.def;
        if (!isUndefined(disconnectedCallback)) {
            if (process.env.NODE_ENV !== 'production') {
                startMeasure(vm, 'disconnectedCallback');
            }
            invokeComponentCallback(vm, disconnectedCallback);
            if (process.env.NODE_ENV !== 'production') {
                endMeasure(vm, 'disconnectedCallback');
            }
        }
    }
    function renderVM(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        if (vm.isDirty) {
            rehydrate(vm);
        }
    }
    function appendVM(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        if (vm.idx !== 0) {
            return; // already appended
        }
        addInsertionIndex(vm);
    }
    function removeVM(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        if (vm.idx === 0) {
            return; // already removed
        }
        removeInsertionIndex(vm);
        // just in case it comes back, with this we guarantee re-rendering it
        vm.isDirty = true;
        clearReactiveListeners(vm);
        // At this point we need to force the removal of all children because
        // we don't have a way to know that children custom element were removed
        // from the DOM. Once we move to use Custom Element APIs, we can remove this
        // because the disconnectedCallback will be triggered automatically when
        // removed from the DOM.
        resetShadowRoot(vm);
    }
    function createVM(tagName, elm, Ctor, options) {
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(elm instanceof HTMLElement, `VM creation requires a DOM element instead of ${elm}.`);
        }
        const def = getComponentDef(Ctor);
        const { isRoot, mode, fallback } = options;
        const shadowRootOptions = {
            mode,
            delegatesFocus: !!Ctor.delegatesFocus,
        };
        uid += 1;
        const vm = {
            uid,
            idx: 0,
            isScheduled: false,
            isDirty: true,
            isRoot: isTrue(isRoot),
            fallback,
            mode,
            def,
            elm: elm,
            data: EmptyObject,
            context: create(null),
            cmpProps: create(null),
            cmpTrack: create(null),
            cmpState: undefined,
            cmpSlots: fallback ? create(null) : undefined,
            cmpTemplate: undefined,
            cmpRoot: elm.attachShadow(shadowRootOptions),
            callHook,
            setHook,
            getHook,
            component: undefined,
            children: EmptyArray,
            // used to track down all object-key pairs that makes this vm reactive
            deps: [],
        };
        if (process.env.NODE_ENV !== 'production') {
            vm.toString = () => {
                return `[object:vm ${def.name} (${vm.idx})]`;
            };
        }
        // create component instance associated to the vm and the element
        createComponent(vm, Ctor);
        // link component to the wire service
        linkComponent(vm);
    }
    function rehydrate(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.isTrue(vm.elm instanceof HTMLElement, `rehydration can only happen after ${vm} was patched the first time.`);
        }
        if (vm.idx > 0 && vm.isDirty) {
            const children = renderComponent(vm);
            vm.isScheduled = false;
            patchShadowRoot(vm, children);
            processPostPatchCallbacks(vm);
        }
    }
    function patchErrorBoundaryVm(errorBoundaryVm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(errorBoundaryVm && "component" in errorBoundaryVm, `${errorBoundaryVm} is not a vm.`);
            assert.isTrue(errorBoundaryVm.elm instanceof HTMLElement, `rehydration can only happen after ${errorBoundaryVm} was patched the first time.`);
            assert.isTrue(errorBoundaryVm.isDirty, "rehydration recovery should only happen if vm has updated");
        }
        const children = renderComponent(errorBoundaryVm);
        const { elm, cmpRoot, fallback, children: oldCh } = errorBoundaryVm;
        errorBoundaryVm.isScheduled = false;
        errorBoundaryVm.children = children; // caching the new children collection
        // patch function mutates vnodes by adding the element reference,
        // however, if patching fails it contains partial changes.
        // patch failures are caught in flushRehydrationQueue
        patchChildren(elm, cmpRoot, oldCh, children, fallback);
        processPostPatchCallbacks(errorBoundaryVm);
    }
    function patchShadowRoot(vm, children) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        const { elm, cmpRoot, fallback, children: oldCh } = vm;
        vm.children = children; // caching the new children collection
        if (children.length === 0 && oldCh.length === 0) {
            return; // nothing to do here
        }
        let error;
        if (process.env.NODE_ENV !== 'production') {
            startMeasure(vm, 'patch');
        }
        try {
            // patch function mutates vnodes by adding the element reference,
            // however, if patching fails it contains partial changes.
            patchChildren(elm, cmpRoot, oldCh, children, fallback);
        }
        catch (e) {
            error = Object(e);
        }
        finally {
            if (process.env.NODE_ENV !== 'production') {
                endMeasure(vm, 'patch');
            }
            if (!isUndefined(error)) {
                const errorBoundaryVm = getErrorBoundaryVMFromOwnElement(vm);
                if (isUndefined(errorBoundaryVm)) {
                    throw error; // tslint:disable-line
                }
                recoverFromLifeCycleError(vm, errorBoundaryVm, error);
                // synchronously render error boundary's alternative view
                // to recover in the same tick
                if (errorBoundaryVm.isDirty) {
                    patchErrorBoundaryVm(errorBoundaryVm);
                }
            }
        }
    }
    function processPostPatchCallbacks(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        const { rendered } = Services;
        if (rendered) {
            invokeServiceHook(vm, rendered);
        }
        const { renderedCallback } = vm.def;
        if (!isUndefined(renderedCallback)) {
            if (process.env.NODE_ENV !== 'production') {
                startMeasure(vm, 'renderedCallback');
            }
            invokeComponentCallback(vm, renderedCallback);
            if (process.env.NODE_ENV !== 'production') {
                endMeasure(vm, 'renderedCallback');
            }
        }
    }
    let rehydrateQueue = [];
    function flushRehydrationQueue() {
        startGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);
        if (process.env.NODE_ENV !== 'production') {
            assert.invariant(rehydrateQueue.length, `If rehydrateQueue was scheduled, it is because there must be at least one VM on this pending queue instead of ${rehydrateQueue}.`);
        }
        const vms = rehydrateQueue.sort((a, b) => a.idx - b.idx);
        rehydrateQueue = []; // reset to a new queue
        for (let i = 0, len = vms.length; i < len; i += 1) {
            const vm = vms[i];
            try {
                rehydrate(vm);
            }
            catch (error) {
                const errorBoundaryVm = getErrorBoundaryVMFromParentElement(vm);
                if (isUndefined(errorBoundaryVm)) {
                    if (i + 1 < len) {
                        // pieces of the queue are still pending to be rehydrated, those should have priority
                        if (rehydrateQueue.length === 0) {
                            addCallbackToNextTick(flushRehydrationQueue);
                        }
                        ArrayUnshift.apply(rehydrateQueue, ArraySlice.call(vms, i + 1));
                    }
                    // we need to end the measure before throwing.
                    endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);
                    // rethrowing the original error will break the current tick, but since the next tick is
                    // already scheduled, it should continue patching the rest.
                    throw error; // tslint:disable-line
                }
                // we only recover if error boundary is present in the hierarchy
                recoverFromLifeCycleError(vm, errorBoundaryVm, error);
                if (errorBoundaryVm.isDirty) {
                    patchErrorBoundaryVm(errorBoundaryVm);
                }
            }
        }
        endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);
    }
    function recoverFromLifeCycleError(failedVm, errorBoundaryVm, error) {
        if (isUndefined(error.wcStack)) {
            error.wcStack = getErrorComponentStack(failedVm.elm);
        }
        resetShadowRoot(failedVm); // remove offenders
        const { errorCallback } = errorBoundaryVm.def;
        if (process.env.NODE_ENV !== 'production') {
            startMeasure(errorBoundaryVm, 'errorCallback');
        }
        // error boundaries must have an ErrorCallback
        invokeComponentCallback(errorBoundaryVm, errorCallback, [error, error.wcStack]);
        if (process.env.NODE_ENV !== 'production') {
            endMeasure(errorBoundaryVm, 'errorCallback');
        }
    }
    function destroyChildren(children) {
        for (let i = 0, len = children.length; i < len; i += 1) {
            const vnode = children[i];
            if (isNull(vnode)) {
                continue;
            }
            const { elm } = vnode;
            if (isUndefined(elm)) {
                continue;
            }
            try {
                // if destroy fails, it really means that the service hook or disconnect hook failed,
                // we should just log the issue and continue our destroying procedure
                vnode.hook.destroy(vnode);
            }
            catch (e) {
                if (process.env.NODE_ENV !== 'production') {
                    const vm = getCustomElementVM(elm);
                    assert.logError(`Internal Error: Failed to disconnect component ${vm}. ${e}`, elm);
                }
            }
        }
    }
    // This is a super optimized mechanism to remove the content of the shadowRoot
    // without having to go into snabbdom. Especially useful when the reset is a consequence
    // of an error, in which case the children VNodes might not be representing the current
    // state of the DOM
    function resetShadowRoot(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        const { children: oldCh, fallback } = vm;
        vm.children = EmptyArray;
        if (isTrue(fallback)) {
            // faux-shadow does not have a real cmpRoot instance, instead
            // we need to remove the content of the host entirely
            innerHTMLSetter.call(vm.elm, '');
        }
        else {
            ShadowRootInnerHTMLSetter.call(vm.cmpRoot, '');
        }
        // proper destroying mechanism for those vnodes that requires it
        destroyChildren(oldCh);
    }
    function scheduleRehydration(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        if (!vm.isScheduled) {
            vm.isScheduled = true;
            if (rehydrateQueue.length === 0) {
                addCallbackToNextTick(flushRehydrationQueue);
            }
            ArrayPush.call(rehydrateQueue, vm);
        }
    }
    function getErrorBoundaryVMFromParentElement(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        const { elm } = vm;
        const parentElm = elm && getParentOrHostElement(elm);
        return getErrorBoundaryVM(parentElm);
    }
    function getErrorBoundaryVMFromOwnElement(vm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        const { elm } = vm;
        return getErrorBoundaryVM(elm);
    }
    function getErrorBoundaryVM(startingElement) {
        let elm = startingElement;
        let vm;
        while (!isNull(elm)) {
            vm = getInternalField(elm, ViewModelReflection);
            if (!isUndefined(vm) && !isUndefined(vm.def.errorCallback)) {
                return vm;
            }
            elm = getParentOrHostElement(elm);
        }
    }
    /**
     * Returns the component stack. Used for errors messages only.
     *
     * @param {Element} startingElement
     *
     * @return {string} The component stack for errors.
     */
    function getErrorComponentStack(startingElement) {
        const wcStack = [];
        let elm = startingElement;
        do {
            const currentVm = getInternalField(elm, ViewModelReflection);
            if (!isUndefined(currentVm)) {
                const tagName = tagNameGetter.call(elm);
                const is = elm.getAttribute('is');
                ArrayPush.call(wcStack, `<${StringToLowerCase.call(tagName)}${is ? ' is="${is}' : ''}>`);
            }
            elm = getParentOrHostElement(elm);
        } while (!isNull(elm));
        return wcStack.reverse().join('\n\t');
    }
    /**
     * Finds the parent of the specified element. If shadow DOM is enabled, finds
     * the host of the shadow root to escape the shadow boundary.
     * @param {HTMLElement} elm
     * @return {HTMLElement | null} the parent element, escaping any shadow root boundaries, if it exists
     */
    function getParentOrHostElement(elm) {
        const parentElement = parentElementGetter.call(elm);
        // If this is a shadow root, find the host instead
        return (isNull(parentElement) && isNativeShadowRootAvailable$1) ? getHostElement(elm) : parentElement;
    }
    /**
     * Finds the host element, if it exists.
     * @param {HTMLElement} elm
     * @return {HTMLElement | null} the host element if it exists
     */
    function getHostElement(elm) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(isNativeShadowRootAvailable$1, 'getHostElement should only be called if native shadow root is available');
            assert.isTrue(isNull(parentElementGetter.call(elm)), `getHostElement should only be called if the parent element of ${elm} is null`);
        }
        const parentNode = parentNodeGetter.call(elm);
        return parentNode instanceof NativeShadowRoot
            ? ShadowRootHostGetter.call(parentNode)
            : null;
    }
    function isNodeFromTemplate(node) {
        if (isFalse(node instanceof Node)) {
            return false;
        }
        return !isUndefined(getNodeOwnerKey$1(node));
    }
    function getNodeOwnerKey$1(node) {
        return node[OwnerKey$1];
    }
    function setNodeOwnerKey$1(node, value) {
        if (process.env.NODE_ENV !== 'production') {
            // in dev-mode, we are more restrictive about what you can do with the owner key
            defineProperty(node, OwnerKey$1, {
                value,
                enumerable: true,
            });
        }
        else {
            // in prod, for better perf, we just let it roll
            node[OwnerKey$1] = value;
        }
    }
    function getNodeKey$1(node) {
        return node[OwnKey$1];
    }
    function setNodeKey(node, value) {
        if (process.env.NODE_ENV !== 'production') {
            // in dev-mode, we are more restrictive about what you can do with the own key
            defineProperty(node, OwnKey$1, {
                value,
                enumerable: true,
            });
        }
        else {
            // in prod, for better perf, we just let it roll
            node[OwnKey$1] = value;
        }
    }
    function getCustomElementVM(elm) {
        if (process.env.NODE_ENV !== 'production') {
            const vm = getInternalField(elm, ViewModelReflection);
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        return getInternalField(elm, ViewModelReflection);
    }
    function getComponentVM(component) {
        if (process.env.NODE_ENV !== 'production') {
            const vm = getHiddenField(component, ViewModelReflection);
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        return getHiddenField(component, ViewModelReflection);
    }
    function getShadowRootVM(root) {
        // TODO: this eventually should not rely on the symbol, and should use a Weak Ref
        if (process.env.NODE_ENV !== 'production') {
            const vm = getInternalField(root, ViewModelReflection);
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
        }
        return getInternalField(root, ViewModelReflection);
    }
    // slow path routine
    // NOTE: we should probably more this routine to the faux shadow folder
    // and get the allocation to be cached by in the elm instead of in the VM
    function allocateInSlot(vm, children) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(vm && "cmpRoot" in vm, `${vm} is not a vm.`);
            assert.invariant(isObject(vm.cmpSlots), `When doing manual allocation, there must be a cmpSlots object available.`);
        }
        const { cmpSlots: oldSlots } = vm;
        const cmpSlots = vm.cmpSlots = create(null);
        for (let i = 0, len = children.length; i < len; i += 1) {
            const vnode = children[i];
            if (isNull(vnode)) {
                continue;
            }
            const data = vnode.data;
            const slotName = ((data.attrs && data.attrs.slot) || '');
            const vnodes = cmpSlots[slotName] = cmpSlots[slotName] || [];
            // re-keying the vnodes is necessary to avoid conflicts with default content for the slot
            // which might have similar keys. Each vnode will always have a key that
            // starts with a numeric character from compiler. In this case, we add a unique
            // notation for slotted vnodes keys, e.g.: `@foo:1:1`
            vnode.key = `@${slotName}:${vnode.key}`;
            ArrayPush.call(vnodes, vnode);
        }
        if (!vm.isDirty) {
            // We need to determine if the old allocation is really different from the new one
            // and mark the vm as dirty
            const oldKeys = keys(oldSlots);
            if (oldKeys.length !== keys(cmpSlots).length) {
                markComponentAsDirty(vm);
                return;
            }
            for (let i = 0, len = oldKeys.length; i < len; i += 1) {
                const key = oldKeys[i];
                if (isUndefined(cmpSlots[key]) || oldSlots[key].length !== cmpSlots[key].length) {
                    markComponentAsDirty(vm);
                    return;
                }
                const oldVNodes = oldSlots[key];
                const vnodes = cmpSlots[key];
                for (let j = 0, a = cmpSlots[key].length; j < a; j += 1) {
                    if (oldVNodes[j] !== vnodes[j]) {
                        markComponentAsDirty(vm);
                        return;
                    }
                }
            }
        }
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const ConnectingSlot = createFieldName('connecting');
    const DisconnectingSlot = createFieldName('disconnecting');
    function callNodeSlot(node, slot) {
        if (process.env.NODE_ENV !== 'production') {
            assert.isTrue(node, `callNodeSlot() should not be called for a non-object`);
        }
        const fn = getInternalField(node, slot);
        if (!isUndefined(fn)) {
            fn();
        }
        return node; // for convenience
    }
    // monkey patching Node methods to be able to detect the insertions and removal of
    // root elements created via createElement.
    assign(Node.prototype, {
        appendChild(newChild) {
            const appendedNode = appendChild.call(this, newChild);
            return callNodeSlot(appendedNode, ConnectingSlot);
        },
        insertBefore(newChild, referenceNode) {
            const insertedNode = insertBefore.call(this, newChild, referenceNode);
            return callNodeSlot(insertedNode, ConnectingSlot);
        },
        removeChild(oldChild) {
            const removedNode = removeChild.call(this, oldChild);
            return callNodeSlot(removedNode, DisconnectingSlot);
        },
        replaceChild(newChild, oldChild) {
            const replacedNode = replaceChild.call(this, newChild, oldChild);
            callNodeSlot(replacedNode, DisconnectingSlot);
            callNodeSlot(newChild, ConnectingSlot);
            return replacedNode;
        },
    });
    /**
     * This method is almost identical to document.createElement
     * (https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
     * with the slightly difference that in the options, you can pass the `is`
     * property set to a Constructor instead of just a string value. E.g.:
     *
     * const el = createElement('x-foo', { is: FooCtor });
     *
     * If the value of `is` attribute is not a constructor,
     * then it throws a TypeError.
     */
    function createElement$2(sel, options = {}) {
        if (!isObject(options) || isNull(options)) {
            throw new TypeError();
        }
        let Ctor = options.is;
        if (isCircularModuleDependency(Ctor)) {
            Ctor = resolveCircularModuleDependency(Ctor);
        }
        let { mode, fallback } = options;
        // TODO: for now, we default to open, but eventually it should default to 'closed'
        if (mode !== 'closed') {
            mode = 'open';
        }
        // TODO: for now, we default to true, but eventually it should default to false
        fallback = isUndefined(fallback) || isTrue(fallback) || isFalse(isNativeShadowRootAvailable);
        // Create element with correct tagName
        const element = document.createElement(sel);
        if (!isUndefined(getNodeKey$1(element))) {
            // There is a possibility that a custom element is registered under tagName,
            // in which case, the initialization is already carry on, and there is nothing else
            // to do here.
            return element;
        }
        const def = getComponentDef(Ctor);
        setElementProto(element, def);
        if (isTrue(fallback)) {
            patchCustomElementProto(element, {
                def
            });
        }
        if (process.env.NODE_ENV !== 'production') {
            patchCustomElementWithRestrictions(element, EmptyObject);
        }
        // In case the element is not initialized already, we need to carry on the manual creation
        createVM(sel, element, Ctor, { mode, fallback, isRoot: true });
        // Handle insertion and removal from the DOM manually
        setInternalField(element, ConnectingSlot, () => {
            const vm = getCustomElementVM(element);
            startHydrateMeasure(vm);
            removeVM(vm); // moving the element from one place to another is observable via life-cycle hooks
            appendVM(vm);
            renderVM(vm);
            endHydrateMeasure(vm);
        });
        setInternalField(element, DisconnectingSlot, () => {
            const vm = getCustomElementVM(element);
            removeVM(vm);
        });
        return element;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // when used with exactly one argument, we assume it is a function invocation.
    function readonly(obj) {
        if (process.env.NODE_ENV !== 'production') {
            // TODO: enable the usage of this function as @readonly decorator
            if (arguments.length !== 1) {
                assert.fail("@readonly cannot be used as a decorator just yet, use it as a function with one argument to produce a readonly version of the provided value.");
            }
        }
        return reactiveMembrane.getReadOnlyProxy(obj);
    }

    function buildCustomElementConstructor(Ctor, options) {
        var _a;
        if (isCircularModuleDependency(Ctor)) {
            Ctor = resolveCircularModuleDependency(Ctor);
        }
        const { props, bridge: BaseElement } = getComponentDef(Ctor);
        const normalizedOptions = { fallback: false, mode: 'open', isRoot: true };
        if (isObject(options) && !isNull(options)) {
            const { mode, fallback } = options;
            // TODO: for now, we default to open, but eventually it should default to 'closed'
            if (mode === 'closed') {
                normalizedOptions.mode = mode;
            }
            // fallback defaults to false to favor shadowRoot
            normalizedOptions.fallback = isTrue(fallback) || isFalse(isNativeShadowRootAvailable);
        }
        return _a = class extends BaseElement {
                constructor() {
                    super();
                    const tagName = StringToLowerCase.call(tagNameGetter.call(this));
                    if (isTrue(normalizedOptions.fallback)) {
                        const def = getComponentDef(Ctor);
                        patchCustomElementProto(this, {
                            def,
                        });
                    }
                    createVM(tagName, this, Ctor, normalizedOptions);
                    if (process.env.NODE_ENV !== 'production') {
                        patchCustomElementWithRestrictions(this, EmptyObject);
                    }
                }
                connectedCallback() {
                    const vm = getCustomElementVM(this);
                    appendVM(vm);
                    renderVM(vm);
                }
                disconnectedCallback() {
                    const vm = getCustomElementVM(this);
                    removeVM(vm);
                }
                attributeChangedCallback(attrName, oldValue, newValue) {
                    if (oldValue === newValue) {
                        // ignoring similar values for better perf
                        return;
                    }
                    const propName = getPropNameFromAttrName(attrName);
                    if (isUndefined(props[propName])) {
                        // ignoring unknown attributes
                        return;
                    }
                    if (!isAttributeLocked(this, attrName)) {
                        // ignoring changes triggered by the engine itself during:
                        // * diffing when public props are attempting to reflect to the DOM
                        // * component via `this.setAttribute()`, should never update the prop.
                        // Both cases, the the setAttribute call is always wrap by the unlocking
                        // of the attribute to be changed
                        return;
                    }
                    // reflect attribute change to the corresponding props when changed
                    // from outside.
                    this[propName] = newValue;
                }
            },
            // collecting all attribute names from all public props to apply
            // the reflection from attributes to props via attributeChangedCallback.
            _a.observedAttributes = ArrayMap.call(getOwnPropertyNames(props), (propName) => props[propName].attr),
            _a;
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */

    exports.createElement = createElement$2;
    exports.getComponentDef = getComponentDef;
    exports.isComponentConstructor = isComponentConstructor;
    exports.getComponentConstructor = getComponentConstructor;
    exports.LightningElement = BaseLightningElement;
    exports.register = register;
    exports.unwrap = unwrap$1;
    exports.registerTemplate = registerTemplate;
    exports.sanitizeAttribute = sanitizeAttribute;
    exports.registerComponent = registerComponent;
    exports.registerDecorators = registerDecorators;
    exports.isNodeFromTemplate = isNodeFromTemplate;
    exports.dangerousObjectMutation = dangerousObjectMutation;
    exports.api = api;
    exports.track = track;
    exports.readonly = readonly;
    exports.wire = wire;
    exports.decorate = decorate;
    exports.buildCustomElementConstructor = buildCustomElementConstructor;
    exports.Element = BaseLightningElement;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
/** version: 0.34.6 */
