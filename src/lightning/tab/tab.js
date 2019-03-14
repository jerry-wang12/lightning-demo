import { LightningElement, api, track } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';

/**
 * A single tab in a tabset component.
 */
export default class LightningTab extends LightningElement {
    @track _loadContent = false;

    connectedCallback() {
        this._connected = true;

        this.dispatchEvent(
            new CustomEvent('privatetabregister', {
                cancelable: true,
                bubbles: true,
                composed: true,
                detail: {
                    setDeRegistrationCallback: deRegistrationCallback => {
                        this._deRegistrationCallback = deRegistrationCallback;
                    },
                },
            })
        );
    }

    @api
    loadContent() {
        this._loadContent = true;

        this.dispatchEvent(new CustomEvent('active'));
    }

    disconnectedCallback() {
        this._connected = false;

        if (this._deRegistrationCallback) {
            this._deRegistrationCallback();
        }
    }

    /**
     * The optional string to be used during tabset's select event to determine which tab was clicked.
     * This string is also used by active-tab-value in tabset to open a tab.
     * @type {string}
     */
    @api
    get value() {
        return this._value;
    }

    set value(newValue) {
        this._value = String(newValue);
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * The text displayed in the tab header.
     * @type {string}
     */
    @api
    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * Specifies text that displays in a tooltip over the tab content.
     * @type {string}
     */
    @api
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * The Lightning Design System name of an icon to display to the left of the tab label.
     * Specify the name in the format 'utility:down' where 'utility' is the category, and
     * 'down' is the icon to be displayed. Only utility icons can be used.
     * @type {string}
     */
    @api
    get iconName() {
        return this._iconName;
    }

    set iconName(value) {
        this._iconName = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * The alternative text for the icon specified by icon-name.
     * @type {string}
     */
    @api
    get iconAssistiveText() {
        return this._iconAssistiveText;
    }

    set iconAssistiveText(value) {
        this._iconAssistiveText = value;
        this._dispatchDataChangeEventIfConnected();
    }

    /**
     * Specifies whether there's an error in the tab content.
     * An error icon is displayed to the right of the tab label.
     * @type {boolean}
     */
    @api
    get showErrorIndicator() {
        return this._showErrorIndicator;
    }

    set showErrorIndicator(value) {
        this._showErrorIndicator = normalizeBoolean(value);
        this._dispatchDataChangeEventIfConnected();
    }

    _dispatchDataChangeEventIfConnected() {
        if (this._connected) {
            this.dispatchEvent(
                new CustomEvent('privatetabdatachange', {
                    cancelable: true,
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }
}
