import labelClipText from '@salesforce/label/LightningDatatable.clipText';
import labelShowActions from '@salesforce/label/LightningDatatable.showActions';
import labelWrapText from '@salesforce/label/LightningDatatable.wrapText';
import { LightningElement, api, track, unwrap } from 'lwc';

const i18n = {
    clipText: labelClipText,
    showActions: labelShowActions,
    wrapText: labelWrapText,
};

export default class PrimitiveHeaderActions extends LightningElement {
    static delegatesFocus = true;
    @api colKeyValue;

    @track containerRect;
    @track
    state = {
        internalActions: [],
        customerActions: [],
        internalTabIndex: 0,
    };

    @api
    get actions() {
        return this._actions;
    }

    set actions(value) {
        this._actions = value;
        this.updateActions();
    }

    @api
    focus() {
        const btnMenu = this.template.querySelector('lightning-button-menu');

        if (btnMenu) {
            btnMenu.focus();
        }
    }

    @api
    get tabIndex() {
        return -1;
    }

    set tabIndex(value) {
        this.setAttribute('tabindex', value);
        this.state.internalTabIndex = value;
    }

    get i18n() {
        return i18n;
    }

    get computedMenuAlignment() {
        return this.state.actionMenu.menuAlignment;
    }

    updateActions() {
        const actionTypeReducer = type => (actions, action) => {
            const overrides = { _type: type, _action: action };
            actions.push(Object.assign({}, action, overrides));

            return actions;
        };

        this.state.internalActions = this.getActionsByType(
            'internalActions'
        ).reduce(actionTypeReducer('internal'), []);

        this.state.customerActions = this.getActionsByType(
            'customerActions'
        ).reduce(actionTypeReducer('customer'), []);

        this.state.actionMenu = {
            menuAlignment: this._actions.menuAlignment,
        };
    }

    get hasActions() {
        return (
            this.state.internalActions.length > 0 ||
            this.state.customerActions.length > 0
        );
    }
    get hasActionsDivider() {
        return (
            this.state.internalActions.length > 0 &&
            this.state.customerActions.length > 0
        );
    }

    getActionsByType(type) {
        return Array.isArray(this._actions[type]) ? this._actions[type] : [];
    }

    handleMenuOpen(event) {
        event.preventDefault();
        event.stopPropagation();
        this.elementRect = this.template
            .querySelector('lightning-button-menu')
            .getBoundingClientRect();

        this.dispatchEvent(
            new CustomEvent('privatecellheaderactionmenuopening', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    saveContainerPosition: containerRect => {
                        this.containerRect = containerRect;
                    },
                },
            })
        );
    }

    handleActionSelect(evt) {
        const action = evt.detail.value;

        this.dispatchEvent(
            new CustomEvent('privatecellheaderactiontriggered', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    action: unwrap(action._action),
                    actionType: action._type,
                    colKeyValue: this.colKeyValue,
                },
            })
        );
    }
}
