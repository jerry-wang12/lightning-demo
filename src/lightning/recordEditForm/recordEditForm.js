import labelApiNameMismatch from '@salesforce/label/LightningRecordEditForm.apiNameMismatch';
import labelInvalidId from '@salesforce/label/LightningRecordEditForm.invalidID';
import { LightningElement, api, track, wire } from 'lwc';
import { getRecordUi, getRecordCreateDefaults } from 'lightning/uiRecordApi';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import {
    createOrSaveRecord,
    getFormValues,
    getFieldSet,
    createErrorEvent,
    filterByPicklistsInForm,
    formHasPicklists,
    validateForm,
} from 'lightning/recordEditUtils';

// TODO: Use getFieldSet and createErrorEvent from lightning-field-utils
// so record-edit-form and record-view-form use the same functions
import { normalizeRecordId } from 'lightning/recordUtils';
import { DependencyManager } from 'lightning/fieldDependencyManager';

// This is the default master recordTypeId in salesforce
const MASTER_RECORD_TYPE_ID = '012000000000000AAA';

/**
 * Represents a record edit layout that displays one or more fields, provided by lightning-input-field.
 */
export default class LightningRecordEditForm extends LightningElement {
    /**
     * Names of the fields to include in the form.
     * @type {string[]}
     */
    @api fieldNames;

    /**
     * The ID of the record type, which is required if you created
     * multiple record types but don't have a default.
     * @type {string}
     */
    @api recordTypeId;

    /**
     * A CSS class for the form element.
     * @type {string}
     */
    @api formClass;

    optionalFields = [];
    fieldSet;
    _recordId;
    _layout;
    _pendingAction = false;
    _wiredApiName = null;
    _wiredRecordId = null;
    _wiredLayoutTypes = null;
    _createMode = false;
    _layoutMode = false; // no optional fields!
    _objectApiName = null;
    _connected = false;
    _recordIdError = false;
    _rendered = false;
    _pendingError;

    // used to trigger picklist values wire
    _wiredPicklistApiName = null;
    _wiredRecordTypeId = null;

    @track recordUi;
    @track errors;

    _fields;
    _inputComponents;

    /**
     * switch between edit and create mode,
     * triggering correct wires
     */
    checkMode() {
        if (this._recordId) {
            this._createMode = false;
            // trigger record ui wire
            this._wiredRecordId = [this._recordId];
            this._wiredApiName = null;
        } else if (!this._recordIdError && this.objectApiName) {
            this._createMode = true;
            // trigger record create defaults wire
            this._wiredApiName = this.objectApiName;
            this._wiredRecordId = null;
        }

        if (this._layout) {
            this._wiredLayoutTypes = [this._layout];
            this._layoutMode = true;
        } else {
            this._layoutMode = false;
            this._wiredLayoutTypes = ['Full']; // default to full layout
        }
    }

    connectedCallback() {
        this.fieldSet = getFieldSet(this.objectApiName);
        // special case for person accounts
        if (
            this.objectApiName === 'Account' ||
            this.objectApiName === 'PersonAccount'
        ) {
            this.fieldSet.add('IsPersonAccount');
        }

        this.checkMode();
        // make sure mode check happens only when needed
        // not all the time
        this._connected = true;
    }

    renderedCallback() {
        // populate the initial set of optionalfields
        this._rendered = true;
        if (this._pendingError) {
            this.handleErrors(this._pendingError);
        }
        this.handleRegister();
    }

    set layoutType(val) {
        this._layout = val;
        this.checkMode();
    }

    /**
     * The type of layout to use to display the form fields. Possible values: Compact, Full.
     * @type {string}
     */
    @api
    get layoutType() {
        return this._layout;
    }

    set recordId(id) {
        if (!id) {
            this._createMode = true;
            this._recordId = null; // normalize falsy to null
        }
        this._recordId = normalizeRecordId(id);
        if (!this._recordId && !this._createMode) {
            const error = { message: labelInvalidId };
            this.handleErrors(error);
            this._recordIdError = true;
            return;
        }
        this._recordIdError = false;

        // switch to edit mode
        this._wiredApiName = null;
        this._createMode = false;
        this._wiredRecordId = [this._recordId];
        if (this._connected) {
            this.checkMode();
        }
    }

    /**
     * The ID of the record to be displayed.
     * @type {string}
     */
    @api
    get recordId() {
        return this._recordId;
    }

    set objectApiName(val) {
        let apiName;
        // duck typing for string vs object
        if (val.objectApiName) {
            apiName = val.objectApiName;
        } else {
            apiName = val;
        }
        this._objectApiName = apiName;
        if (this.fieldSet) {
            this.fieldSet.objectApiName = apiName;
        }
        if (this._connected) {
            this.checkMode();
        }
    }

    /**
     * The API name of the object.
     * @type {string}
     * @required
     */
    @api
    get objectApiName() {
        return this._objectApiName;
    }

    @wire(getRecordUi, {
        recordIds: '$_wiredRecordId',
        layoutTypes: '$_wiredLayoutTypes',
        modes: ['View'],
        optionalFields: '$optionalFields',
    })
    wiredRecordUi(value) {
        this.handleData(value);
    }

    @wire(getRecordCreateDefaults, {
        objectApiName: '$_wiredApiName',
        recordTypeId: '$recordTypeId',
        optionalFields: '$optionalFields',
    })
    wiredRecordCreateDefaults(value) {
        this.handleData(value);
    }

    @wire(getPicklistValuesByRecordType, {
        objectApiName: '$_wiredPicklistApiName',
        recordTypeId: '$_wiredRecordTypeId',
    })
    wiredPicklistValuesByRecordType(value) {
        this.handlePicklistValues(value);
    }

    handleData({ error, data }) {
        if (error) {
            this.handleErrors(error);
            return;
        } else if (!data) {
            return;
        }

        this.wiredRecord = data;
        const record = data.records
            ? data.records[this._recordId]
            : data.record;

        if (record.apiName !== this.objectApiName) {
            const message = labelApiNameMismatch
                .replace('{0}', this.objectApiName)
                .replace('{1}', record.apiName);
            this.handleErrors({ message });
            return;
        }
        const viewData = {
            record,
            objectInfo: data.objectInfos[this.objectApiName],
            objectInfos: data.objectInfos,
            createMode: !this._recordId,
        };

        this.recordUi = viewData;
        this.getInputAndOutputComponents().forEach(field => {
            field.wireRecordUi(viewData);
        });

        if (formHasPicklists(viewData.objectInfo, this.optionalFields)) {
            // trigger picklist values wire and then fire load event
            this.triggerPicklistWire();
        } else {
            // no picklists, fire load event
            this.dispatchLoadEvent();
        }
    }

    triggerPicklistWire() {
        const oldRecordTypeId = this._wiredRecordTypeId;
        const oldObjectApiName = this._wiredPicklistApiName;

        this._wiredPicklistApiName = this.objectApiName;
        this._wiredRecordTypeId = this.recordTypeId || MASTER_RECORD_TYPE_ID;

        // if apiName and recordTypeId haven't changed, use the same picklist values. Wire service will not fetch the values again.
        if (
            oldObjectApiName === this._wiredPicklistApiName &&
            oldRecordTypeId === this._wiredRecordTypeId
        ) {
            this.handlePicklistValues(this._picklistValues);
        }
    }

    handlePicklistValues(value) {
        this._picklistValues = value;
        const { error, data } = value;

        if (error) {
            this.handleErrors(error);
        } else if (!data) {
            return;
        }

        const filteredPicklistValues = filterByPicklistsInForm(
            this.recordUi.objectInfo,
            data.picklistFieldValues || data,
            this.optionalFields
        );
        this._picklistValuesInForm = filteredPicklistValues;

        this.initDependencyManager({
            dependentFields: this.recordUi.objectInfo.dependentFields,
            picklistValues: filteredPicklistValues,
        });
        this.getInputFieldComponents().forEach(field => {
            field.wirePicklistValues(filteredPicklistValues);
        });

        // picklist values are loaded at the end, after record data are wired
        this.dispatchLoadEvent();
    }

    validateForm() {
        const cmps = this.getInputFieldComponents();
        return validateForm(cmps);
    }

    /**
     * Submits the form.
     * @param {string[]} fields - Record fields.
     */
    @api
    submit(fields) {
        this.doSubmit(fields).catch(err => {
            this.handleErrors(err);
        });
    }

    doSubmit(fields) {
        return new Promise((resolve, reject) => {
            this._pendingAction = true;
            const originalRecord = this._createMode
                ? null
                : this.recordUi.record;
            const newRecord = {
                fields: fields ? fields : this.getFormValues(),
                // api gets mad if you have an api name for edit, don't have one for create
                apiName: this._createMode ? this._objectApiName : null,
            };

            // add recordTypeId if it is provided
            if (this.recordTypeId) {
                newRecord.fields.RecordTypeId = this.recordTypeId;
            }

            createOrSaveRecord(
                newRecord,
                originalRecord,
                this.recordUi.objectInfo
            ).then(
                savedRecord => {
                    this._pendingAction = false;
                    const lightningMessages = this.querySelector(
                        'lightning-messages'
                    );
                    if (lightningMessages) {
                        lightningMessages.setError(null);
                    }
                    this.dispatchEvent(
                        // eslint-disable-next-line lightning-global/no-custom-event-bubbling
                        new CustomEvent('success', {
                            composed: true,
                            bubbles: true,
                            detail: savedRecord,
                        })
                    );
                    resolve();
                },
                err => {
                    this._pendingAction = false;
                    reject(err);
                }
            );
        });
    }

    getFormValues() {
        return getFormValues(this.getInputFieldComponents());
    }

    handleError(err) {
        err.stopPropagation();
        this.handleErrors(err.detail.error);
    }

    handleErrors(err) {
        const messages = this.querySelector('lightning-messages');

        // error arrived before render so we'll have to handle it later
        if (!this._rendered) {
            this._pendingError = err;
            return;
        }
        this._pendingError = null;

        if (messages) {
            messages.setError(err);
        }
        this.getInputFieldComponents().forEach(field => {
            field.setErrors(err);
        });

        this.dispatchEvent(createErrorEvent(err));
    }

    dispatchLoadEvent() {
        this.dispatchEvent(
            new CustomEvent('load', {
                detail: {
                    ...this.wiredRecord,
                    picklistValues: this._picklistValuesInForm,
                },
            })
        );
    }

    handleRegister() {
        this.fieldSet.concat(this.getFields());
        this.optionalFields = this.fieldSet.getList();
    }

    registerDependentField(e) {
        e.stopPropagation();

        const { fieldName, fieldElement } = e.detail;
        this._depManager.registerField({ fieldName, fieldElement });
    }

    updateDependentFields(e) {
        e.stopPropagation();

        if (this._depManager) {
            this._depManager.handleFieldValueChange(
                e.detail.fieldName,
                e.detail.value
            );
        }
    }

    handleSubmit(e) {
        // submit buttons can't work in slots,
        // so we listen for clicks on submit buttons
        // TODO discuss with A11Y team
        if (e.target.type !== 'submit') {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (!this.validateForm()) {
            // trigger native validation popups
            this.template.querySelector('form').reportValidity();
            return;
        }

        // cleanly clone and unwrap fields
        const fields = JSON.parse(JSON.stringify(this.getFormValues()));
        // eslint-disable-next-line lightning-global/no-custom-event-bubbling
        const evt = new CustomEvent('submit', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: { fields },
        });
        this.dispatchEvent(evt);

        // I think this should work, because events always
        // execute in the same stack, so tailing this
        // handler with setTimeout will cause it to wait until
        // the event has propogated to check for prevent default
        // there are some hacks with stopImmediatePropogation,
        // but they rely on re-firing the event, which won't work in
        // this situation
        // eslint-disable-next-line lwc/no-set-timeout
        setTimeout(() => {
            if (this._pendingAction) {
                return;
            }
            if (evt.defaultPrevented) {
                return;
            }

            this._pendingAction = true;
            this.doSubmit().catch(err => {
                this.handleErrors(err);
            });
        }, 0);
    }

    getInputFieldComponents() {
        return [...this.querySelectorAll('lightning-input-field')];
    }

    getInputAndOutputComponents() {
        return [
            ...this.querySelectorAll(
                'lightning-input-field,lightning-output-field'
            ),
        ];
    }

    getFields() {
        return this.getInputAndOutputComponents().map(field => {
            return field.fieldName;
        });
    }

    initDependencyManager(dependencyInfo) {
        if (!this._depManager) {
            this._depManager = new DependencyManager(dependencyInfo);
        } else {
            this._depManager.registerDependencyInfo(dependencyInfo);
        }
    }
}
