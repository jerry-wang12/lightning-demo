import labelLoadingActions from '@salesforce/label/LightningPrimitiveCellActions.loadingActions';
import labelShowActions from '@salesforce/label/LightningPrimitiveCellActions.showActions';
import { LightningElement, api, track } from 'lwc';
import { normalizeString } from 'lightning/utilsPrivate';

const DEFAULT_MENU_ALIGNMENT = 'auto-right';
const VALID_MENU_ALIGNMENT = [
    'auto-right',
    'auto-left',
    'auto',
    'left',
    'center',
    'right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
];

const i18n = {
    loadingActions: labelLoadingActions,
    showActions: labelShowActions,
};

export default class PrimitiveCellActions extends LightningElement {
    @api rowKeyValue;
    @api colKeyValue;
    @api rowActions;

    @track containerRect;

    @track
    state = {
        actions: [],
        menuAlignment: DEFAULT_MENU_ALIGNMENT,
        internalTabIndex: false,
    };

    @api
    get tabIndex() {
        return -1;
    }

    set tabIndex(newValue) {
        this.state.internalTabIndex = newValue;
    }

    @api
    get menuAlignment() {
        return this.state.menuAlignment;
    }

    set menuAlignment(value) {
        this.state.menuAlignment = normalizeString(value, {
            fallbackValue: DEFAULT_MENU_ALIGNMENT,
            validValues: VALID_MENU_ALIGNMENT,
        });
    }

    @api
    focus() {
        this.template.querySelector('lightning-button-menu').focus();
    }

    get computedMenuAlignment() {
        return this.menuAlignment;
    }

    get buttonAlternateText() {
        return `${i18n.showActions}`;
    }

    get spinnerAlternateText() {
        return `${i18n.loadingActions}`;
    }

    handleActionSelect(event) {
        this.dispatchEvent(
            new CustomEvent('privatecellactiontriggered', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    rowKeyValue: this.rowKeyValue,
                    colKeyValue: this.colKeyValue,
                    action: event.detail.value,
                },
            })
        );
    }

    handleMenuOpen() {
        this.elementRect = this.template
            .querySelector('lightning-button-menu')
            .getBoundingClientRect();

        const detail = {
            rowKeyValue: this.rowKeyValue,
            colKeyValue: this.colKeyValue,
            doneCallback: this.finishLoadingActions.bind(this),
            saveContainerPosition: containerRect => {
                this.containerRect = containerRect;
            },
        };

        if (typeof this.rowActions === 'function') {
            this.state.isLoadingActions = true;
            this.state.actions = [];

            detail.actionsProviderFunction = this.rowActions;
            // This callback should always be async
            Promise.resolve().then(() => {
                this.dispatchEvent(
                    new CustomEvent('privatecellactionmenuopening', {
                        composed: true,
                        bubbles: true,
                        cancelable: true,
                        detail,
                    })
                );
            });
        } else {
            this.state.actions = this.rowActions;
        }
    }

    finishLoadingActions(actions) {
        this.state.isLoadingActions = false;
        this.state.actions = actions;
    }
}
