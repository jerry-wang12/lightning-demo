const GET_LINK_INFO_EVENT = 'lightningroutingservicegetlinkinfo';

export const urlTypes = {
    standard: 'standard_webPage',
};

export class LinkInfo {
    constructor(url, dispatcher) {
        this.url = url;
        this.dispatcher = dispatcher;
        Object.freeze(this);
    }
}

export function registerLinkProvider(element, providerFn) {
    element.addEventListener(GET_LINK_INFO_EVENT, providerFn);
}

export function unregisterLinkProvider(element, providerFn) {
    element.removeEventListener(GET_LINK_INFO_EVENT, providerFn);
}

/*
 * Mock getLinkInfo
 *
 * @returns {Promise[LinkInfo]}
 */
export function getLinkInfo(element, stateRef) {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
        const getLinkInfoEvent = new CustomEvent(GET_LINK_INFO_EVENT, {
            detail: {
                stateRef,
                callback: (err, linkInfo) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(linkInfo);
                    }
                },
            },
            bubbles: true,
            composed: true,
            cancelable: true,
        });
        element.dispatchEvent(getLinkInfoEvent);
    });
}

/**
 * Determines the route for the given url and updates the element
 * state with the correct url and dispatcher.
 *
 * @param {HTMLElement} element Element from which to dispatch the routing event
 * @param {string} url Link to route
 * @param {function} callback on the returned LinkInfo
 *
 * @returns {Promise} Promise[LinkInfo]
 */
export function updateRawLinkInfo(element, url) {
    return getLinkInfo(element, {
        stateType: urlTypes.standard,
        attributes: {
            url,
        },
    });
}
