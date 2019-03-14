import { assert } from 'lightning/utilsPrivate';

const MODAL_TYPE = 'modal';
const POPOVER_TYPE = 'panel';

function normalizeInt(x) {
    const parsed = parseInt(x, 10);
    return isNaN(parsed) ? 0 : parsed;
}

class OverlayOptions {
    constructor() {
        this._options = {
            panelType: MODAL_TYPE,
            visible: true,
            panelConfig: {},
        };
    }

    get options() {
        if (this._options.panelType === POPOVER_TYPE) {
            if (this._options.panelConfig.showCloseButton == null) {
                this._options.panelConfig.showCloseButton = false;
            }
            if (this._options.panelConfig.showPointer == null) {
                this._options.panelConfig.showPointer = true;
            }
        }

        // Set isCustomPanel to true, make sure AVP always is ui:modal or ui:panel.
        this._options.panelConfig.isCustomPanel = true;
        return this._options;
    }

    id(value) {
        this._options.panelConfig.devNameOrId = value;
    }

    panelType(value) {
        this._options.panelType = value;
    }

    modal() {
        this._options.panelType = MODAL_TYPE;
    }

    popover() {
        this._options.panelType = POPOVER_TYPE;
    }

    bodyClass(value) {
        this._options.panelConfig.bodyClass = value || '';
    }

    body(value) {
        this._options.panelConfig.body = value || null;
    }

    // modal specific
    modalClass(value) {
        this._options.panelConfig.modalClass = value || '';
        return this;
    }

    headerClass(value) {
        this._options.panelConfig.headerClass = value || '';
    }

    footerClass(value) {
        this._options.panelConfig.footerClass = value || '';
    }

    classNames(value) {
        this._options.panelConfig.classNames = value || '';
    }

    flavor(value) {
        this._options.panelConfig.flavor = value || '';
    }

    title(value) {
        if (value != null && value !== '') {
            this._options.panelConfig.header = null;
            this._options.panelConfig.title = value;
        }
    }

    header(value) {
        if (value != null) {
            if (typeof value === 'string') {
                this._options.panelConfig.header = null;
                this._options.panelConfig.title = value;
            } else {
                this._options.panelConfig.header = value;
                this._options.panelConfig.title = null;
            }
        }
    }

    footer(value) {
        this._options.panelConfig.footer = value;
    }

    showCloseButton(value) {
        this._options.panelConfig.showCloseButton = !!value;
    }

    closeCallback(value) {
        if (typeof value === 'function') {
            this._options.onDestroy = value;
        }
    }

    // Popover specific
    referenceSelector(value) {
        this._options.panelConfig.referenceElementSelector = value || '';
    }

    reference(value) {
        this._options.panelConfig.referenceElement = value;
    }

    // positioning

    showPointer(value) {
        this._options.panelConfig.showPointer = !!value;
    }

    direction(value) {
        this._options.panelConfig.direction = value;
    }

    padding(value) {
        this._options.panelConfig.pad = normalizeInt(value);
    }

    advancedConfig(value) {
        if (typeof value === 'object') {
            this._options.panelConfig.advancedConfig = value;
        }
    }

    boundingElement(value) {
        this._options.panelConfig.boundingElement = value;
    }

    pointerPadding(value) {
        this._options.panelConfig.pointerPad = normalizeInt(value);
    }

    boundingBoxPadding(value) {
        this._options.panelConfig.boundingBoxPad = normalizeInt(value);
    }

    boxDirectionPadding(value) {
        this._options.panelConfig.boxDirectionPad = normalizeInt(value);
    }

    align(value) {
        this._advancedConfig.align = normalizeInt(value);
    }

    targetAlign(value) {
        this._advancedConfig.targetAlign = normalizeInt(value);
    }

    verticalPadding(value) {
        this._advancedConfig.vertPad = normalizeInt(value);
    }

    // More attributes support W-5455858
    autoFocus(value) {
        this._options.panelConfig.autoFocus = !!value;
    }

    trapFocus(value) {
        this._options.panelConfig.trapFocus = !!value;
    }

    closeOnClickOut(value) {
        this._options.panelConfig.closeOnClickOut = !!value;
    }

    useTransition(value) {
        this._options.panelConfig.useTransition = !!value;
    }

    scopeScrollables(value) {
        this._options.panelConfig.scopeScrollables = !!value;
    }

    closeAction(value) {
        if (typeof value === 'function') {
            this._options.panelConfig.closeAction = value;
        }
    }

    // Extra attribte pass to custome panel
    customAttributes(value) {
        value = value || {};
        const keys = Object.keys(value);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            assert(
                !this[key],
                `${key} is a predefined option, can not be overridden by customAttributes`
            );
            if (!this[key]) {
                this._options.panelConfig[key] = value[key];
            }
        }
    }

    get _advancedConfig() {
        this._options.panelConfig.advancedConfig =
            this._options.panelConfig.advancedConfig || {};
        return this._options.panelConfig.advancedConfig;
    }
}

export function parseOptions(options = {}) {
    const config = new OverlayOptions();
    const keys = Object.keys(options);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (typeof config[key] === 'function' && options[key] != null) {
            config[key].apply(config, [options[key]]);
        }
    }

    return config.options;
}
