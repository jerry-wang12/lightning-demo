import { showAdvancedSearch } from './advancedSearch';
import * as CONSTANTS from './constants';
import { api, LightningElement, track, wire } from 'lwc';
import { createErrorEvent } from 'lightning/fieldUtils';
import { FieldConstraintApi } from 'lightning/inputUtils';
import { normalizeRecordId } from 'lightning/recordUtils';
import { getLookupActions } from 'lightning/uiActionsApi';
import { getLookupRecords } from 'lightning/uiLookupsApi';
import { getRecordUi } from 'lightning/uiRecordApi';
import { log } from './logging';
import * as utils from './utils';

/**
 * Displays an input lookup for the Desktop.
 */
export default class LightningLookupDesktop extends LightningElement {
    // ================================================================================
    // PUBLIC PROPERTIES
    // ================================================================================
    /**
     * Checks the lookup validity, and fires an 'invalid' event if it's in invalid state.
     * @return {Boolean} - The validity status of the lookup.
     */
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Indicates whether the field is disabled.
     * @type {Boolean}
     */
    @api disabled = false;

    /**
     * @return {String} - The lookup field name.
     */
    @api
    get fieldName() {
        return this._fieldName;
    }

    /**
     * Sets the field name for the lookup.
     * @param {String|FieldId} value - The lookup field name.
     */
    set fieldName(value) {
        this._fieldName = value;
        this.updateState();
    }

    /**
     * Sets focus on the input element.
     */
    @api
    focus() {
        if (!this._connected) {
            return;
        }

        const combobox = this.template.querySelector(
            CONSTANTS.LIGHTNING_COMBOBOX
        );

        if (combobox) {
            combobox.focus();
        }
    }

    /**
     * The text label for the field.
     * @type {String}
     */
    @api label;

    /**
     * @return {Number} - The maximum number of values supported by the lookup.
     */
    @api
    get maxValues() {
        return this._maxValues;
    }

    /**
     * Sets the maximum number of values that can be inserted into the lookup.
     * @param {Number} value - The maximum number of values for the lookup.
     */
    set maxValues(value) {
        this.updateMaxValues(value);
    }

    /**
     * @return {Object} - The source record's objectInfos.
     */
    @api
    get objectInfos() {
        return this._objectInfos;
    }

    /**
     * Sets the source record's objectInfos.
     * @param {Object} value - The source record's objectInfos.
     */
    set objectInfos(value) {
        this._objectInfos = value;
        this.updateState();
    }

    /**
     * @return {String} - The source record representation.
     */
    @api
    get record() {
        return this._record;
    }

    /**
     * Sets the source record representation.
     * @param {Object} value - The source record.
     */
    set record(value) {
        this._record = value;
        this.updateState();
    }

    /**
     * Shows validation message based on the validity status.
     * @return {Boolean} - The validity status of the lookup.
     */
    @api
    reportValidity() {
        const combobox = this.template.querySelector(
            CONSTANTS.LIGHTNING_COMBOBOX
        );

        if (combobox) {
            return this._constraint.reportValidity(message => {
                combobox.setCustomValidity(message);
                combobox.reportValidity();
            });
        }

        return false;
    }

    /**
     * Sets a custom validity message.
     * @param {String} message - The validation message to be shown in an error state.
     */
    @api
    setCustomValidity(message) {
        const combobox = this.template.querySelector(
            CONSTANTS.LIGHTNING_COMBOBOX
        );

        if (combobox) {
            this._constraint.setCustomValidity(message);
            combobox.setCustomValidity(message);
        }
    }

    /**
     * TODO - Remove when @wire(getLookupActions) response is invocable.
     * @return {Boolean} Indicates whether or not to show the create new option.
     */
    @api
    get showCreateNew() {
        return this._showCreateNew;
    }

    /**
     * TODO - Remove when @wire(getLookupActions) response is invocable.
     * Sets the flag to enable or disable create new option.
     * If set to true, a backend validation is made using @wire(getLookupActions) to check if
     * create action from lookup is supported for the given target api, and option is added accordingly.
     * @param {Boolean} value - A flag to enable or disable create new option.
     */
    set showCreateNew(value) {
        this._showCreateNew = value;
        this.updateState();
    }

    /**
     * Displays a validation message if the lookup is in invalid state.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    /**
     * Gets the validity constraint of the lookup.
     * @return {Object} - The current validity constraint.
     */
    @api
    get validity() {
        return this._constraint.validity;
    }

    /**
     * @return {Array} An array of selected lookup values.
     */
    @api
    get values() {
        return this._values;
    }

    /**
     * Sets the values for the lookup.
     * @param {Array} value - An array of record ids.
     */
    set values(value) {
        // Update values, and pills.
        this.updateValues(value, [], false);
    }

    // ================================================================================
    // REACTIVE PROPERTIES
    // ================================================================================
    /**
     * The field level help text.
     * @type {String}
     */
    @track fieldLevelHelp;

    /**
     * The list of entities used to display. Format is {text, value}
     * @type {Array}
     */
    @track filterItems;

    /**
     * The name of entity field for accessibility purposes.
     * @type {String}
     */
    @track filterLabel;

    /**
     * The utility icon name for the combobox input.
     * @type {String}
     */
    @track inputIconName;

    /**
     * The max size (in characters) for the combobox input.
     * @type {Number}
     */
    @track inputMaxlength;

    /**
     * Selected value to pass to combobox as input pill.
     * Note - Should only get used in a single-value lookup.
     * @type {Object}
     */
    @track inputPill = null;

    /**
     * The combobox input text value.
     * @type {String}
     */
    @track inputText = '';

    /**
     * The list of items used to display in combobox.
     * @type {Array}
     */
    @track items = [];

    /**
     * Indicates if the field is required.
     * @type {Boolean}
     */
    @track isRequired;

    /**
     * Selected records to pass to combobox pill container.
     * Note - Should only get used in a multi-value lookup.
     * @type {Array}
     */
    @track pills = [];

    /**
     * A localized placeholder for the input.
     * @type {String}
     */
    @track placeholder = '';

    /**
     * Indicates if the data is being received over wire. This is used to control the spinner.
     * @type {Boolean}
     */
    @track showActivityIndicator;

    // ================================================================================
    // PRIVATE PROPERTIES
    // ================================================================================
    /**
     * Indicates whether or not the abort processing of wire items in flight.
     * @type {Boolean}
     */
    _abortWireItems = false;

    /**
     * Api names used to obtain lookup actions using @wire(getLookupActions).
     * For example - ['Opportunity','Account']
     * @type {Boolean}
     */
    _actionObjectApiNames;

    /**
     * Request params sent to the @wire(getLookupActions).
     * @type {Object}
     */
    _actionRequestParams;

    /**
     * Indicates whether or not the component is connected.
     * @type {Boolean}
     */
    _connected = false;

    /**
     * The field api name to trigger @wire(getLookupRecords).
     * Note - Should be only used to trigger the wire.
     * @type {String}
     */
    _fieldApiName;

    /**
     * The source record's field info.
     * @type {Object}
     */
    _fieldInfo;

    /**
     * The qualified field name.
     * @type {String|FieldId}
     */
    _fieldName;

    /**
     * Indicates whether or not the @wire(getLookupActions) is in progress.
     * @type {Boolean}
     */
    _getLookupActionsInProgress;

    /**
     * Indicates whether or not the @wire(getLookupRecords) is in progress.
     * @type {Boolean}
     */
    _getLookupRecordsInProgress;

    /**
     * Indicates whether or not the @wire(getRecordUi) is in progress.
     * @type {Boolean}
     */
    _getRecordUiInProgress;

    /**
     * Indicates whether or not the lookup dropdown has been opened previously.
     * @type {Boolean}
     */
    _hasDropdownOpened;

    /**
     * The maximum number of values supported by the lookup.
     * @type {Number}
     */
    _maxValues = 1;

    /**
     * The source record's objectInfos.
     * @type {Object}
     */
    _objectInfos;

    /**
     * The additional optional fields for the @wire(getRecordUi).
     * @type {Array}
     */
    _optionalFields;

    /**
     * Internal copy of pills. It gets used to populate inputPill as well as pills in the
     * combobox pill container.
     * @type {Array}
     */
    _pills = [];

    /**
     * The source record.
     * @type {Object}
     */
    _record;

    /**
     * The record ids for the @wire(getRecordUi) to resolve pills.
     * @type {Array}
     */
    _recordIds;

    /**
     * The reference api infos for given field.
     * For example -
     * {
     *  'Opportunity': {
     *          apiName: 'Opportunity',
     *          color: 'FCB95B',
     *          createNewEnabled: true,
     *          iconAlternativeText: 'Opportunity',
     *          iconName: 'standard:opportunity',
     *          iconUrl: 'http://.../standard/foo.png',
     *          keyPrefix: '006',
     *          label: 'Opportunity',
     *          labelPlural: 'Opportunities',
     *          nameField: 'Name',
     *          optionalNameField: 'Opportunity.Name',
     *      },
     *  'Account': {..},
     *  ...
     * }
     * @type {Object}
     */
    _referenceInfos = {};

    /**
     * Request params sent to the @wire(getLookupRecords).
     * @type {Object}
     */
    _requestParams = {
        [CONSTANTS.QUERY_PARAMS_Q]: '',
        [CONSTANTS.QUERY_PARAMS_SEARCH_TYPE]: CONSTANTS.SEARCH_TYPE_RECENT,
        [CONSTANTS.QUERY_PARAMS_PAGE]: CONSTANTS.DEFAULT_PAGE,
        [CONSTANTS.QUERY_PARAMS_PAGE_SIZE]: CONSTANTS.DEFAULT_PAGE_SIZE,
        [CONSTANTS.QUERY_PARAMS_DEPENDENT_FIELD_BINDINGS]: null,
    };

    /**
     * Indicates whether or not to show the create new option.
     * @type {Boolean}
     */
    _showCreateNew = false;

    /**
     * The source record's object info.
     * @type {Object}
     */
    _sourceObjectInfo = {};

    /**
     * The target record's api name to trigger @wire(getLookupRecords).
     * Note - Should be only used to trigger wire. Please use _targetObjectInfo.apiName for other use cases.
     * @type {Object}
     */
    _targetApiName;

    /**
     * The target record's object info.
     * @type {Object}
     */
    _targetObjectInfo = {};

    /**
     * An array of values of the selected lookup.
     * @type {Array}
     */
    _values;

    /**
     * Items obtained from @wire(getLookupRecords).
     * @type {Array}
     */
    _wireItems = [];

    // ================================================================================
    // ACCESSOR METHODS
    // ================================================================================
    /**
     * Gets the validity constaint.
     */
    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    this.isRequired &&
                    (!Array.isArray(this._values) || !this._values.length),
            });
        }
        return this._constraintApi;
    }

    /**
     * Returns an input text for the entity filter.
     * @returns {String} See desc.
     */
    get filterInputText() {
        return this._targetObjectInfo.label;
    }

    // ================================================================================
    // LIFECYCLE METHODS
    // ================================================================================
    constructor() {
        super();
        this.inputIconName = CONSTANTS.ICON_SEARCH;
        this.inputMaxlength = CONSTANTS.INPUT_MAX_LENGTH;
        this.filterLabel = utils.computeFilterLabel();
    }

    connectedCallback() {
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
    }

    // ================================================================================
    // WIRE METHODS
    // ================================================================================
    @wire(getLookupActions, {
        objectApiNames: '$_actionObjectApiNames',
    })
    wiredLookupActions({ error, data }) {
        // Update wire status.
        this.updateWireStatus('getLookupActions', false);

        if (error) {
            this.fireEvent(CONSTANTS.EVENT_LDS_ERROR, error);
            return;
        } else if (!data) {
            return;
        }

        try {
            for (const apiName in data.actions) {
                if (
                    data.actions.hasOwnProperty(apiName) &&
                    this._referenceInfos.hasOwnProperty(apiName)
                ) {
                    this._referenceInfos[
                        apiName
                    ].createNewEnabled = utils.hasCreateFromLookup(
                        data.actions[apiName].actions
                    );
                }
            }
        } catch (e) {
            this.fireEvent(CONSTANTS.EVENT_ERROR, { error: e });
        }
    }

    @wire(getLookupRecords, {
        fieldApiName: '$_fieldApiName',
        requestParams: '$_requestParams',
        targetApiName: '$_targetApiName',
    })
    wiredLookupRecords({ error, data }) {
        // Update wire status.
        this.updateWireStatus('getLookupRecords', false);

        if (error) {
            this.resetCombobox();
            this.fireEvent(CONSTANTS.EVENT_LDS_ERROR, error);
            return;
        } else if (!data || this._abortWireItems) {
            return;
        }

        try {
            const records = data ? data.records : [];

            this._wireItems = records.map(record => {
                const fields = record.fields;
                return {
                    iconAlternativeText: this._targetObjectInfo
                        .iconAlternativeText,
                    iconName: this._targetObjectInfo.iconName,
                    iconSize: CONSTANTS.ICON_SIZE_SMALL,
                    subText: fields.hasOwnProperty('DisambiguationField')
                        ? fields.DisambiguationField.value
                        : null,
                    text:
                        fields[
                            this._referenceInfos[this._targetObjectInfo.apiName]
                                .nameField
                        ].value,
                    type: CONSTANTS.OPTION_TYPE_CARD,
                    value: fields.Id.value,
                };
            });

            /*
             * During init both getLookupActions and getLookupRecords wire actions are in progress simultaneously.
             * Delaying updating record items until both actions are received.
             * TODO - W-5313904 - Handle this with Promises
             */
            if (this._getLookupActionsInProgress) {
                let counter = 0;
                const delayedUpdateItems = () => {
                    if (this._getLookupActionsInProgress && counter < 100) {
                        counter++;
                        // eslint-disable-next-line lwc/no-set-timeout
                        setTimeout(delayedUpdateItems, 100);
                    } else {
                        this.updateItems();
                    }
                };
                // eslint-disable-next-line lwc/no-set-timeout
                setTimeout(delayedUpdateItems, 100);
            } else {
                // Update display items.
                this.updateItems();
            }
        } catch (e) {
            this.fireEvent(CONSTANTS.EVENT_ERROR, { error: e });
        }
    }

    @wire(getRecordUi, {
        layoutTypes: [CONSTANTS.LAYOUT_TYPE_FULL],
        modes: [CONSTANTS.MODE_VIEW],
        optionalFields: '$_optionalFields',
        recordIds: '$_recordIds',
    })
    wiredRecordUi({ error, data }) {
        // Update wire status.
        this.updateWireStatus('getRecordUi', false);

        if (error) {
            this.fireEvent(CONSTANTS.EVENT_LDS_ERROR, error);
            return;
        } else if (!data) {
            return;
        }

        try {
            const pills = [];
            const invalidValues = [];

            for (const r in data.records) {
                if (data.records.hasOwnProperty(r)) {
                    const record = data.records[r];
                    const apiName = record.apiName;
                    // Process records of supported target apis.
                    if (this._referenceInfos.hasOwnProperty(apiName)) {
                        const iconName = utils.computeIconName(
                            this._objectInfos[apiName]
                        );
                        const pill = {
                            iconAlternativeText: apiName,
                            iconName,
                            label:
                                record.fields[
                                    this._referenceInfos[apiName].nameField
                                ].value,
                            type: CONSTANTS.PILL_TYPE_ICON,
                            value: record.id,
                        };
                        pills.push(pill);
                    } else {
                        // Collect values with invalid reference apis.
                        invalidValues.push(record.id);
                    }
                }
            }

            if (invalidValues.length > 0 && this._values) {
                // Remove invalid values from this._values
                const values = this._values.filter(
                    value => !invalidValues.includes(value)
                );
                // Update values, and pills.
                this.updateValues(values, pills, false);
            } else {
                // Update pills only as no invalid values found.
                this.updatePills(pills);
            }
        } catch (e) {
            this.fireEvent(CONSTANTS.EVENT_ERROR, { error: e });
        }
    }

    // ================================================================================
    // PRIVATE METHODS
    // ================================================================================
    /**
     * Aborts processing data from the wire action in flight.
     */
    abortWireAction() {
        this._abortWireItems = true;
        this._wireItems = [];
        this.updateWireStatus('getLookupRecords', false);
    }

    /**
     * Callback method executed by the parent component to update values after handling "createnew" event.
     * @param {Array} values - An array of newly created record ids.
     */
    createNewCallback(values = []) {
        if (!Array.isArray(values) || !values.length) {
            return;
        }

        // Append new values to exisitng values.
        const newValues = Object.assign([], this._values).concat(values);

        // Update values, pills, and fire change event.
        this.updateValues(newValues);
    }

    /**
     * Fires an event with details for parent component to handle.
     * @param {String} type - The type of event being dispatched.
     * @param {Object} detail - The event data.
     * @param {Boolean} bubbles - Whether or not the event bubbles.
     */
    fireEvent(type, detail, bubbles = true) {
        let event;
        switch (type) {
            case CONSTANTS.EVENT_ERROR:
                // eslint-disable-next-line no-console
                console.error(detail.error.message);
                event = utils.computeEvent(type, detail, bubbles);
                break;
            case CONSTANTS.EVENT_LDS_ERROR:
                // eslint-disable-next-line no-console
                console.error(detail.message);
                event = createErrorEvent(detail);
                break;
            default:
                event = utils.computeEvent(type, detail, bubbles);
                break;
        }

        // Trigger event.
        if (event) {
            this.dispatchEvent(event);
        }
    }

    /**
     * Handles advanced search by showing scoped results in a panel.
     */
    handleAdvancedSearchAction() {
        // Log click on advanced search option interaction.
        log(
            CONSTANTS.LOG_EVENT_CLICK,
            CONSTANTS.LOG_SCOPE_INPUT_LOOKUP_DESKTOP,
            CONSTANTS.LOG_TARGET_MRU_ACTION_ITEM,
            {
                scopeName: this._targetObjectInfo.apiName,
                type: CONSTANTS.LOG_ACTION_SEARCH_OPTION,
            }
        );

        const scopeMap = utils.computeScopeMap(this._targetObjectInfo);
        const saveCallback = values => {
            // Advanced search returns an array of selected values.
            if (values && values.length > 0) {
                // Select first value as selected value.
                const selectedValue = values[0];
                const recordId = selectedValue.id;
                if (
                    !Array.isArray(this._values) ||
                    !this._values.includes(recordId)
                ) {
                    const vals = Object.assign([], this._values);
                    vals.push(recordId);

                    // Compute pill if label is available.
                    // This avoids unnecessary triggering of wire.
                    if (selectedValue.Name) {
                        const pill = {
                            iconAlternativeText: this._targetObjectInfo
                                .iconAlternativeText,
                            iconName: this._targetObjectInfo.iconName,
                            label: selectedValue.Name,
                            type: CONSTANTS.PILL_TYPE_ICON,
                            value: recordId,
                        };

                        const pills = Object.assign([], this._pills);
                        pills.push(pill);

                        // Update values with pills.
                        this.updateValues(vals, pills);
                    } else {
                        // Update values, and resolve pills later.
                        this.updateValues(vals);
                    }

                    // Reset combobox.
                    this.resetCombobox();
                    this.focus();
                }
            }
        };
        const fieldName = utils.computeUnqualifiedFieldApiName(
            this._fieldApiName
        );
        const lookupAdvancedAttributes = {
            additionalFields: [],
            contextId: '',
            dependentFieldBindings: utils.computeBindingsMap(
                this._record,
                this._fieldInfo.dependentFields
            ),
            entities: [scopeMap],
            field: fieldName,
            groupId: CONSTANTS.ADVANCED_SEARCH_GROUP_ID,
            label: this.label,
            maxValues: CONSTANTS.ADVANCED_SEARCH_MAX_VALUES,
            placeholder: this.placeholder,
            recordId:
                Array.isArray(this._values) && this._values.length
                    ? this._values[0]
                    : '',
            saveCallback,
            scopeMap,
            scopeSets: { DEFAULT: [scopeMap] },
            source: this._sourceObjectInfo.apiName,
            term: this.inputText,
        };

        try {
            // Show advanced search modal.
            showAdvancedSearch(lookupAdvancedAttributes);
        } catch (error) {
            this.fireEvent(CONSTANTS.EVENT_ERROR, { error });
        }
    }

    /**
     * Handles create new option selection.
     */
    handleCreateNewAction() {
        // Log click on create new option interaction.
        log(
            CONSTANTS.LOG_EVENT_CLICK,
            CONSTANTS.LOG_SCOPE_INPUT_LOOKUP_DESKTOP,
            CONSTANTS.LOG_TARGET_MRU_ACTION_ITEM,
            {
                scopeName: this._targetObjectInfo.apiName,
                sourceName: this._sourceObjectInfo.apiName,
                type: CONSTANTS.LOG_ACTION_CREATE_NEW_OPTION,
            }
        );
        // Fire an event to notify parent to handle create new action.
        this.fireEvent(CONSTANTS.EVENT_CREATE_NEW, {
            value: this._targetObjectInfo.apiName,
            callback: this.createNewCallback.bind(this),
        });

        // Reset combobox.
        this.resetCombobox();
    }

    /**
     * Handles the input's focus event.
     */
    handleDropdownOpenRequest() {
        // Log lookup activation.
        log(
            CONSTANTS.LOG_EVENT_CLICK,
            CONSTANTS.LOG_SCOPE_INPUT_LOOKUP_DESKTOP,
            CONSTANTS.LOG_TARGET_INPUT,
            {
                scopeName: this._targetObjectInfo.apiName,
            }
        );

        // On the first focus update the internal state that triggers wire..
        if (!this._hasDropdownOpened) {
            this._hasDropdownOpened = true;
            // Executes wire actions deferred until user's first interaction.
            this.updateState();
        }

        // Show MRU items only if -
        // 1) There is no wire action in flight AND
        // 2) User has not typed any inputText.
        if (!this._getLookupRecordsInProgress && !this.inputText.length) {
            this.updateTerm('');
        }
    }

    /**
     * Handles the oninput and onchange events from the combobox input, triggering an update to @wire parameters.
     * @param {Object} event - The input's oninput/onchange event.
     */
    handleInputTextChange(event) {
        // Stop combobox event propagation.
        event.stopPropagation();

        // No-op if event detail is empty.
        if (!event.detail) {
            return;
        }

        const term = event.detail.text || '';

        // Update term.
        this.updateTerm(term);
    }

    /**
     * Handles the pillremove event fired from combo-box when a selected option is removed.
     * @param {Object} event - Contains details of the event being handled.
     */
    handlePillRemove(event) {
        // Log input pill removal interaction.
        log(
            CONSTANTS.LOG_EVENT_PILL_REMOVE,
            CONSTANTS.LOG_SCOPE_INPUT_LOOKUP_DESKTOP,
            CONSTANTS.LOG_TARGET_RECORD_PILL_ITEM,
            {
                scopeName: this._targetObjectInfo.apiName,
            }
        );

        if (this._maxValues === 1) {
            // Update values, and pills.
            this.updateValues([]);
        } else if (this._maxValues > 1) {
            // No-op if event detail is empty.
            if (!event.detail) {
                return;
            }

            const removedValue = event.detail.item.value;

            if (removedValue && this._values && this._pills) {
                // Remove deleted value.
                const values = this._values.filter(v => {
                    return v !== removedValue;
                });

                // Remove pill for the removed value.
                const pills = this._pills.filter(p => {
                    return p.value !== removedValue;
                });

                // Update values, and pills.
                this.updateValues(values, pills);
            }
        }

        // Reset combobox.
        this.resetCombobox();
    }

    /**
     * Handles record option selection
     * @param {String} recordId - The record id of the option.
     */
    handleRecordOptionSelect(recordId) {
        // No-op if record id is empty.
        if (!recordId) {
            return;
        }

        // No-op if maxValues count is reached.
        if (
            Array.isArray(this._values) &&
            this._values.length === this._maxValues
        ) {
            return;
        }

        const isMRU =
            this._requestParams[CONSTANTS.QUERY_PARAMS_SEARCH_TYPE] ===
            CONSTANTS.SEARCH_TYPE_RECENT;
        const itemCount = this.items.length;
        const position = this.items.findIndex(item => {
            return item.value === recordId;
        });

        // Log click on record option interaction.
        log(
            CONSTANTS.LOG_EVENT_CLICK,
            CONSTANTS.LOG_SCOPE_INPUT_LOOKUP_DESKTOP,
            CONSTANTS.LOG_TARGET_MRU_ITEM,
            {
                recordId,
                position,
                qType: isMRU
                    ? CONSTANTS.LOG_CONTEXT_Q_TYPE_MRU
                    : CONSTANTS.LOG_CONTEXT_Q_TYPE_TYPEAHEAD,
                mruVisibleCount: isMRU ? itemCount : 0,
                typeAheadVisibleCount: isMRU ? 0 : itemCount,
                scopeName: this._targetObjectInfo.apiName,
            }
        );

        if (!Array.isArray(this._values) || !this._values.includes(recordId)) {
            // Append new value to the existing list.
            const values = Object.assign([], this._values);
            values.push(recordId);

            // Selected recordId is always expected to be present in the wireItems.
            // Use it to populate pill info so as to avoid triggering wire.
            const wireItem = this._wireItems.find(record => {
                return record.value === recordId;
            });

            const pills = Object.assign([], this._pills);

            pills.push({
                iconAlternativeText: wireItem.iconAlternativeText,
                iconName: wireItem.iconName,
                iconSize: wireItem.iconSize,
                label: wireItem.text,
                type: CONSTANTS.PILL_TYPE_ICON,
                value: wireItem.value,
            });

            // Update values, and pills.
            this.updateValues(values, pills);

            // Reset combobox.
            this.resetCombobox();
        }
    }

    /**
     * Handles the select event fired from combo-box when an option is selected.
     * @param {Object} event - Contains details of the event being handled.
     */
    handleSelect(event) {
        const value = event.detail.value;
        switch (value) {
            case CONSTANTS.ACTION_ADVANCED_SEARCH:
                this.handleAdvancedSearchAction();
                break;
            case CONSTANTS.ACTION_CREATE_NEW:
                this.handleCreateNewAction();
                break;
            default:
                this.handleRecordOptionSelect(value);
                break;
        }
    }

    /**
     * Handles entity filter change.
     * @param {Object} event - The filter's onchange event object.
     */
    handleSelectFilter(event) {
        if (!event.detail) {
            return;
        }

        // Log click on filter item interaction.
        log(
            CONSTANTS.LOG_EVENT_CLICK,
            CONSTANTS.LOG_SCOPE_ENTITY_SELECTOR,
            CONSTANTS.LOG_TARGET_FILTER_ITEM,
            {
                scopeName: this._targetObjectInfo.apiName,
            }
        );

        const selectedEntity = event.detail.value;

        // No-op if newly selected target api is the same as the previous one.
        if (selectedEntity === this._targetObjectInfo.apiName) {
            return;
        }

        // If it's a single value lookup then clear values for the previous target api.
        if (this._maxValues === 1) {
            this.updateValues([]);
        }

        // Update target object info as per newly selected entity.
        this._targetObjectInfo = utils.computeObjectInfo(
            this._objectInfos,
            selectedEntity
        );

        // Update internal state.
        this.updateState();
    }

    /**
     * Resets combobox, and aborts receiving new items.
     */
    resetCombobox() {
        if (this.items.length) {
            this.items = [];
        }
        this.inputText = '';
        this.abortWireAction();
    }

    /**
     * Adds advanced search action option to the display items.
     */
    setAdvancedSearchOption() {
        const term = this.inputText || '';
        // Insert the advanced search action if a valid search term found.
        if (utils.isValidSearchTerm(term)) {
            const advancedSearchOption = utils.computeAdvancedSearchOption(
                term,
                this._targetObjectInfo.labelPlural
            );
            this.items.unshift(advancedSearchOption);
            // Trigger items setter for the combobox.
            this.items = this.items.slice();
        }
    }

    /**
     * Adds the create new action option to the display items.
     */
    setCreateNewOption() {
        if (
            this.showCreateNew && // TODO - Remove when @wire(getLookupActions) response is invocable.
            this._referenceInfos[this._targetObjectInfo.apiName]
                .createNewEnabled
        ) {
            this.items.push(
                utils.computeCreateNewOption(this._targetObjectInfo.label)
            );
            // Trigger items setter for the combobox.
            this.items = this.items.slice();
        }
    }

    /**
     * Checks if combobox items should be displayed.
     * @returns {Boolean} - True if items should be shown.
     */
    shouldDisplayItems() {
        let displayItems;

        if (!this._hasDropdownOpened) {
            displayItems = false;
        } else if (this._maxValues === 1 && this.inputPill) {
            // Don't show items if it's a single-value lookup, and inputPill is already present.
            displayItems = false;
        } else {
            displayItems = true;
        }

        // Clear display items.
        if (!displayItems && this.items.length) {
            this.items = [];
        }

        return displayItems;
    }

    /**
     * Updates combobox filter items.
     */
    updateFilterItems() {
        // For single-value lookup, if an inputPill is present then filter items shouldn't be shown.
        if (this._maxValues === 1 && this.inputPill) {
            this.filterItems = null;
        } else {
            this.filterItems = utils.computeFilterItems(
                this._referenceInfos,
                this._targetObjectInfo.apiName
            );
        }

        this.updatePlaceholder();
    }

    /**
     * Updates the list of items displayed in the grouped-combobox dropdown,
     * adding the advanced search option if a valid search term is present.
     */
    updateItems() {
        // No-op if items are not expected to be displayed.
        if (!this.shouldDisplayItems()) {
            return;
        }

        // Clear previous items.
        if (this.items.length) {
            this.items = [];
        }

        const term = this.inputText || '';
        const filteredItems = utils.computeDedupedItems(
            this._wireItems,
            this._values,
            CONSTANTS.DEFAULT_LIST_SIZE
        );

        if (filteredItems.length > 0) {
            if (!term.length) {
                // Show MRU items with the heading.
                this.items = [
                    {
                        label: utils.computeHeading(
                            this._targetObjectInfo.labelPlural
                        ),
                        items: filteredItems,
                    },
                ];
            } else if (term.length > 0) {
                // Get items with highlighting.
                this.items = utils.computeHighlightedItems(filteredItems, term);
            }
        }

        // Add advanced search option.
        this.setAdvancedSearchOption();

        // Add create new option.
        this.setCreateNewOption();
    }

    /**
     * Updates max value count. Also updates existing values, and pills correspondingly.
     * @param {Number} count - The maximum number of values supported by the lookup.
     */
    updateMaxValues(count) {
        // Update internal state of maxValues.
        this._maxValues = count;

        // No-op if values are not defined.
        if (!Array.isArray(this._values) || !this._values.length) {
            return;
        }

        let pills;

        // Trim existing values as per new max count.
        if (this._values.length > this._maxValues) {
            const values = this._values.slice(0, this._maxValues);
            // Trim existing pills as per new max count.
            const pillValues = this._pills.map(pill => {
                return pill.value;
            });

            if (utils.arraysIdentical(pillValues, this._values)) {
                // Trim pills if they are up to date with the values.
                pills = this._pills.slice(0, this._maxValues);
                this.updateValues(values, pills, false);
            } else {
                this.updateValues(values, [], false);
            }
        } else {
            pills = Object.assign([], this._pills);
            // Update pills arrangement only since values remain the same.
            this.updatePills(pills);
        }
    }

    /**
     * Updates the pill using info it obtained via argument, local data or wire.
     * @param {Array} pills - An array of pills infos representing values.
     */
    updatePills(pills = []) {
        // Check if any pills are missing, if so then trigger @wire(getRecordUi) to resolve them.
        const pillValues = pills.map(pill => {
            return pill.value;
        });

        let pillsResolved = utils.arraysIdentical(pillValues, this._values);

        if (!pillsResolved) {
            try {
                // Try to resolve pill from the source record itself to avoid hitting wire.
                const values = utils.computeRecordValues(
                    this._record,
                    this._fieldApiName
                );
                if (utils.arraysIdentical(values, this._values)) {
                    pills = utils.computeRecordPills(
                        this._record,
                        this._fieldInfo,
                        this._referenceInfos
                    );
                    if (pills.length) {
                        pillsResolved = true;
                    }
                }
            } catch (error) {
                this.fireEvent(CONSTANTS.EVENT_ERROR, { error });
            }
        }

        if (pillsResolved) {
            // Update internal copy of pills.
            this._pills = pills;

            // Pills are empty, hence clear input as well as container pills.
            if (!pills.length) {
                this.inputPill = null;
                this.pills = [];
            } else if (pills.length > 0) {
                // inputPill, and pills can never co-exist.
                if (this._maxValues === 1) {
                    this.inputPill = this._pills[0];
                    this.pills = [];
                } else if (this._maxValues > 1) {
                    this.pills = this._pills;
                    this.inputPill = null;
                }
            }

            // Check if items should be displayed, and clear if necessary.
            this.shouldDisplayItems();

            // Update filter items.
            this.updateFilterItems();

            // Grab the focus after populating pills.
            this.focus();
            return;
        }

        if (!pillsResolved && this._values.length) {
            // Trigger wire to get record representations of live values, and update pills.
            this.updateWireStatus('getRecordUi', true);
            this._optionalFields = utils.computeOptionalNameFields(
                this._referenceInfos
            );
            this._recordIds = this._values.slice();
        }
    }

    /**
     * Updates combobox input placeholder
     */
    updatePlaceholder() {
        const referenceApiNames = Object.keys(this._referenceInfos);

        // If it's a multi-entity lookup then the placeholder should be "Search..."
        const label =
            referenceApiNames.length === 1
                ? this._targetObjectInfo.labelPlural
                : null;
        this.placeholder = utils.computePlaceholder(label);
    }

    /**
     * Updates _requestParams to trigger @wire's observable.
     * @param {String} key - A property on _requestParams.
     * @param {String} value - A value corresponding to the property.
     */
    updateRequestParams(key, value) {
        // No-op if items are not expected to be displayed.
        if (!this.shouldDisplayItems()) {
            return;
        }

        this._requestParams[key] = value;
        this._requestParams = Object.assign({}, this._requestParams);

        // Trigger wire.
        this._targetApiName = this._targetObjectInfo.apiName;

        if (this._targetApiName && this._fieldApiName) {
            this.updateWireStatus('getLookupRecords', true);
        }
    }

    /**
     * Updates lookup's internal state.
     */
    updateState() {
        if (
            !this._fieldName ||
            !Object.keys(this._record || {}).length ||
            !Object.keys(this._objectInfos || {}).length
        ) {
            return;
        }

        try {
            // Update source object info.
            this._sourceObjectInfo = utils.computeObjectInfo(
                this._objectInfos,
                this._record.apiName
            );

            // Update field info.
            this._fieldApiName = utils.computeFieldApiName(
                this._fieldName,
                this._sourceObjectInfo.apiName
            );
            this._fieldInfo = utils.computeFieldInfo(
                this._objectInfos,
                this._sourceObjectInfo.apiName,
                this._fieldApiName
            );
            this.isRequired = this._fieldInfo.isRequired;
            this.fieldLevelHelp = this._fieldInfo.inlineHelpText;
            this._referenceInfos = utils.computeReferenceInfos(
                this._objectInfos,
                this._fieldInfo.references
            );

            // Update dependent field bindings for the request params.
            this.updateRequestParams(
                CONSTANTS.QUERY_PARAMS_DEPENDENT_FIELD_BINDINGS,
                utils.computeBindingsString(
                    this._record,
                    this._fieldInfo.dependentFields
                )
            );

            // Update target info.
            // Select first field reference apiName as target api if targetObjectInfo is empty or stale.
            if (
                utils.isEmptyObject(this._targetObjectInfo) ||
                !this._referenceInfos.hasOwnProperty(
                    this._targetObjectInfo.apiName
                )
            ) {
                let targetApi;
                const fieldReferences = this._fieldInfo.references;
                if (Array.isArray(fieldReferences) && fieldReferences.length) {
                    targetApi = fieldReferences[0].apiName;
                }

                this._targetObjectInfo = utils.computeObjectInfo(
                    this._objectInfos,
                    targetApi
                );
            } else {
                // Update state could be triggered due to updating of objectInfos hence re-create
                // targetObjectInfo for it's apiName.
                this._targetObjectInfo = utils.computeObjectInfo(
                    this._objectInfos,
                    this._targetObjectInfo.apiName
                );
            }

            // Update filter items for entity selection.
            this.updateFilterItems();

            // Update values.
            if (this._values === undefined) {
                const values = utils.computeRecordValues(
                    this._record,
                    this._fieldApiName
                );
                // Don't fire change event since default values is assigned from the record.
                this.updateValues(values, [], false);
            }

            // Update action info.
            // Defer wire action until user activates the lookup.
            const referenceApiNames = Object.keys(this._referenceInfos);
            if (this.showCreateNew && this._hasDropdownOpened) {
                // Trigger wire only if new reference apis found.
                this.updateWireStatus('getLookupActions', true);
                this._actionObjectApiNames = referenceApiNames;
            }

            // Reset combobox.
            this.resetCombobox();
        } catch (error) {
            this.fireEvent(CONSTANTS.EVENT_ERROR, { error });
        }
    }

    /**
     * Updates term state, triggering the @wire service on term change.
     * @param  {String} term - The search term.
     */
    updateTerm(term) {
        // Update combobox input text value.
        this.inputText = term;

        // Allow processing of the wire items.
        this._abortWireItems = false;

        // Determine if it's a MRU or TypeAhead request, and update request params.
        this.updateRequestParams(
            CONSTANTS.QUERY_PARAMS_SEARCH_TYPE,
            utils.isValidTypeAheadTerm(term)
                ? CONSTANTS.SEARCH_TYPE_TYPEAHEAD
                : CONSTANTS.SEARCH_TYPE_RECENT
        );

        // Update search term, and trigger wire.
        this.updateRequestParams(CONSTANTS.QUERY_PARAMS_Q, term.trim());
    }

    /**
     * Updates the live value, sets the pills and fires 'change' event if requested.
     * Typically 'change' event should be triggered when values are committed by the user.
     * @param {Array} values - An array of record ids.
     * @param {Array} pills - An array of pill infos corresponding to the values.
     * @param {Boolean} triggerEvent - Whether or not to fire change event.
     */
    updateValues(values = [], pills = [], triggerEvent = true) {
        if (values === null) {
            values = [];
        }

        if (!Array.isArray(values)) {
            return;
        }

        if (values.length) {
            values = values
                .filter(val => val) // Drop empty.
                .map(val => normalizeRecordId(val.trim())) // Convert to 18-char record ids.
                .filter((elem, index, self) => {
                    return index === self.indexOf(elem); // De-deupe.
                });
        }

        // No-op if values remain unchanged.
        if (utils.arraysIdentical(values, this._values)) {
            return;
        }

        // Trim values as per the max count.
        if (values.length > this._maxValues) {
            values = values.slice(0, this._maxValues);
        }

        // Update internal copy of values.
        this._values = values;

        // Update pills.
        this.updatePills(pills);

        if (triggerEvent) {
            // Fire an event to notify that values have been changed.
            this.fireEvent(CONSTANTS.EVENT_CHANGE, {
                value: this._values,
            });
        }
    }

    /**
     * Updates the wire activity status.
     * @param {String} adapterName - Name of the wire adapter.
     * @param {Boolean} inProgress - True if wire action is in progress.
     */
    updateWireStatus(adapterName, inProgress = true) {
        if (!adapterName) {
            return;
        }

        const flag = '_' + adapterName + 'InProgress';

        // Update internal status.
        this[flag] = inProgress;

        // Update combobox input spinner.
        this.showActivityIndicator =
            this._getLookupActionsInProgress ||
            this._getLookupRecordsInProgress ||
            this._getRecordUiInProgress;
    }
}
