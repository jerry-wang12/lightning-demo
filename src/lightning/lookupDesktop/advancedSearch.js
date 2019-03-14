// eslint-disable-next-line lwc/no-compat-create
import { createComponent } from 'aura';
import { showCustomOverlay } from 'lightning/deprecatedOverlayUtils';

/**
 * Shows advanced search panel having scoped search results.
 * @param {Object} attrs - Attributes for lookupAdvanced component.
 * Schema -
 * {
 *      additionalFields: {Array},
 *      contextId: {String},
 *      dependentFieldBindings: {Map},
 *      entities: {Array},
 *      field: {String},
 *      groupId: {String},
 *      label: {String},
 *      maxValues: {Integer},
 *      placeholder: {String},
 *      recordId: {String},
 *      saveCallback: {Function},
 *      scopeMap: {Object},
 *      scopeSets: {Object},
 *      source: {String},
 *      term: {String},
 * }
 */
export function showAdvancedSearch(attrs) {
    showCustomOverlay({
        isTransient: true,
        isScrollable: false,
        isFullScreen: true,
        flavor: 'large',
        autoFocus: false,
        title: attrs.label,
    }).then(panel => {
        updatePanel(panel._panelInstance, attrs);
    });
}

/**
 * Updates panel by setting it's body and footer.
 * @param {Object} panel - Instance of panel created, an Aura Component.
 * @param {Object} attrs - Attributes for lookupAdvanced component.
 */
function updatePanel(panel, attrs) {
    if (!panel || !attrs) {
        return;
    }
    setPanelFooter(panel)
        .then(setPanelBody(panel, attrs))
        .catch(error => {
            throw new Error(error);
        });
}

/**
 * Sets an instance of lookupAdvanced to panel's body.
 * @param {Object} panel - Instance of panel, an Aura Component.
 * @param {Object} attrs - Attributes for lookupAdvanced component.
 * @returns {Promise} a promise used to resolve the creation of lookupAdvanced.
 */
function setPanelBody(panel, attrs) {
    attrs.panel = panel;
    const promise = new Promise((resolve, reject) => {
        createComponent(
            'forceSearch:lookupAdvanced',
            attrs,
            (cmp, status, error) => {
                if (status === 'SUCCESS') {
                    panel.update({
                        body: cmp,
                    });
                    resolve();
                } else {
                    reject(error);
                }
            }
        );
    });
    return promise;
}

/**
 * Sets an instance of lookupAdvancedFooter to panel's footer.
 * @param {Object} panel - Instance of panel, an Aura Component.
 * @return {Promise} a promise used to resolve the creation of
 * lookupAdvancedFooter.
 */
function setPanelFooter(panel) {
    const promise = new Promise((resolve, reject) => {
        createComponent(
            'forceSearch:lookupAdvancedFooter',
            { 'aura:id': 'lookupAdvancedFooter' },
            (cmp, status, error) => {
                if (status === 'SUCCESS') {
                    panel.set('v.footer', cmp);
                    resolve();
                } else {
                    reject(error);
                }
            }
        );
    });
    return promise;
}
