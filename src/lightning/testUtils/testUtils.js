/**
Returns the shadowRoot property of a given Lightning web component.

Use this utility instead of directly accessing the the element's ShadowRoot
to future-proof your test logic as LWC's Shadow DOM API implementation
evolves over time.

@param {LWCElement} element The Lightning web component element to retrieve
the shadowRoot property off of
@returns {ShadowRoot} The shadow root of the given element
**/
export function getShadowRoot(element) {
    if (!element || !element.shadowRoot) {
        const tagName =
            element && element.tagName && element.tagName.toLowerCase();
        throw new Error(
            `Attempting to retrieve the shadow root of '${tagName ||
                element}' but no shadowRoot property found`
        );
    }
    return element.shadowRoot;
}

/**
Non-recursively queries the template of the provided element using the
provided selector.
@param {LWCElement} element The Lightning web component element for which we
    want to query the template.
@param {String} selector The selector used to match the descendant element.
@returns {Element}
**/
export function shadowQuerySelector(element, selector) {
    return getShadowRoot(element).querySelector(selector);
}

/**
Non-recursively queries the template of the provided element using the
provided selector.
@param {LWCElement} element The Lightning web component element for which we
    want to query the template.
@param {String} selector The selector used to match the descendant element.
@returns {Element[]}
**/
export function shadowQuerySelectorAll(element, selector) {
    return Array.from(getShadowRoot(element).querySelectorAll(selector));
}

export function testConnectedElement(element, attributes, ...tests) {
    Object.assign(element, attributes);
    document.body.appendChild(element);
    return tests
        .reduce((promise, test) => promise.then(test), Promise.resolve())
        .then(
            value => {
                document.body.removeChild(element);
                return value;
            },
            value => {
                document.body.removeChild(element);
                return Promise.reject(value);
            }
        );
}

export function verifyClassSet(node, classSet) {
    const nodeClasses = node.getAttribute('class').split(' ');
    const expectedClasses = Object.keys(classSet).filter(className => {
        return classSet[className];
    });
    const hasExpectedClasses = expectedClasses.reduce((soFar, className) => {
        return soFar && nodeClasses.indexOf(className) !== -1;
    }, true);
    const hasUnexpectedClasses = Object.keys(classSet)
        .filter(className => {
            return !classSet[className];
        })
        .reduce((soFar, className) => {
            return soFar || nodeClasses.indexOf(className) !== -1;
        }, false);
    expect(hasExpectedClasses).toBe(true);
    expect(hasUnexpectedClasses).toBe(false);
}

// gather all input elements across shadow boundries
// through brute force
export function getInputElements(element) {
    return querySelectorAll(element, 'input');
}

export function querySelector(element, selector) {
    return Element.prototype.querySelector.call(element, selector);
}

export function querySelectorAll(element, selector) {
    return Array.from(
        Element.prototype.querySelectorAll.call(element, selector)
    );
}

export function isElementWithFocus(element) {
    let currentFocusedElement = document.activeElement;
    while (currentFocusedElement && currentFocusedElement !== element) {
        currentFocusedElement = currentFocusedElement.shadowRoot
            ? currentFocusedElement.shadowRoot.activeElement
            : null;
    }

    return currentFocusedElement === element;
}

export function getElementWithFocus() {
    let focusedElement = document.activeElement;
    let currentFocusedElement = focusedElement;

    while (focusedElement && focusedElement.shadowRoot) {
        focusedElement = getShadowRoot(currentFocusedElement).activeElement;
        if (focusedElement) {
            currentFocusedElement = focusedElement;
        }
    }

    return currentFocusedElement;
}
