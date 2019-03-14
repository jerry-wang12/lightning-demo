import labelShowActions from '@salesforce/label/LightningPrimitiveCellActions.showActions';
import {
    assert,
    classListMutation,
    normalizeString,
} from 'lightning/utilsPrivate';
import { LightningElement, api, track } from 'lwc';
import mediaTile from './mediaTile.html';
import standardTile from './standardTile.html';

const VALID_TYPE_VALUES = ['standard', 'media'];

const i18n = {
    showActions: labelShowActions,
};

/**
 * A grouping of related information associated with a record.
 */
export default class LightningTile extends LightningElement {
    /**
     * The text label that displays in the tile and hover text.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * The URL of the page that the link goes to.
     * @type {string}
     */
    @api href = '';
    @track _type = 'standard';
    @track _actions = [];

    /**
     * A list of actions that's displayed in a dropdown menu.
     * @type {list}
     */
    @api
    get actions() {
        return this._actions;
    }

    set actions(actions) {
        this._actions = actions;
    }

    /**
     * The tile type. Valid values are 'standard' and 'media'.
     * The default is 'standard'.
     * @type {string}
     * @default standard
     */
    @api
    get type() {
        return this._type;
    }

    set type(value) {
        assert(
            VALID_TYPE_VALUES.indexOf(value) !== -1,
            `Invalid type attribute value of ${value}. Must be one of ${VALID_TYPE_VALUES}.`
        );
        this._type = normalizeString(value, {
            fallbackValue: 'standard',
            validValues: VALID_TYPE_VALUES,
        });
        if (this._connected) {
            this.setClassesAndTemplate();
        }
    }

    handleActionSelect(event) {
        this.dispatchEvent(
            new CustomEvent('actiontriggered', {
                detail: {
                    action: event.detail.value,
                },
            })
        );
    }

    setClassesAndTemplate() {
        classListMutation(this.classList, {
            'slds-media': this.isMedia,
            'slds-hint-parent': this.hasActions,
        });
    }

    connectedCallback() {
        this._connected = true;
        this.classList.add('slds-tile');
        this.setClassesAndTemplate();
    }

    render() {
        return this.isMedia ? mediaTile : standardTile;
    }

    get isMedia() {
        return this.type === 'media';
    }

    get hasActions() {
        return Object.keys(this.actions).length > 0;
    }

    get buttonAlternateText() {
        return `${i18n.showActions}`;
    }
}
