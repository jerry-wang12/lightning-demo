import labelAdd from '@salesforce/label/LightningLookup.add';
import labelAdvancedSearch from '@salesforce/label/LightningLookup.searchForInObject';
import labelCreateNew from '@salesforce/label/LightningLookup.createNewObject';
import labelCurrentSelection from '@salesforce/label/LightningLookup.currentSelection';
import labelMruHeader from '@salesforce/label/LightningLookup.recentObject';
import labelSearch from '@salesforce/label/LightningLookup.search';
import labelSearchObjectsPlaceholder from '@salesforce/label/LightningLookup.searchObjectsPlaceholder';
import labelSearchPlaceholder from '@salesforce/label/LightningLookup.searchPlaceholder';
import labelSelectObject from '@salesforce/label/LightningLookup.selectObject';
import {
    ACTION_ADVANCED_SEARCH,
    ACTION_CREATE_NEW,
    ICON_ADD,
    ICON_CHECK,
    ICON_DEFAULT,
    ICON_SEARCH,
    ICON_SIZE_SMALL,
    ICON_SIZE_X_SMALL,
    OPTION_TYPE_CARD,
    OPTION_TYPE_INLINE,
    PILL_TYPE_ICON,
} from './constants';

const i18n = {
    add: labelAdd,
    advancedSearch: labelAdvancedSearch,
    createNew: labelCreateNew,
    currentSelection: labelCurrentSelection,
    mruHeader: labelMruHeader,
    search: labelSearch,
    searchObjectsPlaceholder: labelSearchObjectsPlaceholder,
    searchPlaceholder: labelSearchPlaceholder,
    selectEntity: labelSelectObject,
};

/**
 * Compares given array to check if they have identical (string) elements
 * irrespective of their positions.
 * Note - Does not perform deep comparison.
 * @param {Array} array1 - Source array.
 * @param {Array} array2 - Desination array for comparison.
 * @returns {Boolean} true if array1 and array2 have same elements.
 */
function arraysIdentical(array1 = [], array2 = []) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }

    if (array1.length !== array2.length) {
        return false;
    }
    const sortedArray1 = Object.assign([], array1).sort();
    const sortedArray2 = Object.assign([], array2).sort();

    return sortedArray1.toString() === sortedArray2.toString();
}

/**
 * Get advanced search action item for display.
 * @param {String} term - A search term.
 * @param {String} label - Plural name of target api.
 * @returns {Object} - An advanced search action item.
 */
function computeAdvancedSearchOption(term, label) {
    if (term === null || term === undefined) {
        term = '';
    }
    if (label === null || label === undefined) {
        label = '';
    }
    return {
        highlight: true,
        iconAlternativeText: `${i18n.search}`,
        iconName: ICON_SEARCH,
        iconSize: ICON_SIZE_X_SMALL,
        text: `${i18n.advancedSearch}`
            .replace('{0}', term)
            .replace('{1}', label),
        type: OPTION_TYPE_CARD,
        value: ACTION_ADVANCED_SEARCH,
    };
}

/**
 * Returns a CSV string of dependent field bindings given a Record
 * representaiton and a list of dependent fields.
 * @param  {Object} record - A record representation.
 * @param  {Array} dependentFields - An array of depedent field api names.
 * @return {Object} - A CSV string of dependent field bindings.
 */
function computeBindingsString(record, dependentFields) {
    if (!record || !dependentFields || !dependentFields.length) {
        return null;
    }
    return dependentFields
        .map(field => {
            const value =
                record.fields && record.fields[field]
                    ? record.fields[field].value
                    : null;
            return `${field}=${value}`;
        })
        .join(',');
}

/**
 * Returns a map of dependent field bindings given a Record representaiton and
 * a list of dependent fields.
 * @param  {Object} record - A record representation.
 * @param  {Array} dependentFields - An array of depedent field api names.
 * @return {Object} - A map of dependent field bindings.
 */
function computeBindingsMap(record, dependentFields) {
    if (!record || !dependentFields || !dependentFields.length) {
        return null;
    }
    const dependentFieldBindings = {};
    dependentFields.forEach(field => {
        const value =
            record.fields && record.fields[field]
                ? record.fields[field].value
                : null;
        dependentFieldBindings[field] = value;
    });
    return dependentFieldBindings;
}

/**
 * Get create new action item for display.
 * @param {String} label - Plural name of target api.
 * @returns {Object} - A create new action item.
 */
function computeCreateNewOption(label = '') {
    if (label === null) {
        label = '';
    }
    return {
        iconAlternativeText: `${i18n.add}`,
        iconName: ICON_ADD,
        iconSize: ICON_SIZE_X_SMALL,
        text: `${i18n.createNew}`.replace('{0}', label),
        type: OPTION_TYPE_CARD,
        value: ACTION_CREATE_NEW,
    };
}

/**
 * Gets deduped, and trimmed items.
 * @param {Array} items - The original list of items to be deduped.
 * @param {Array} valuesToIgnore - The list of values to ignore.
 * @param {Number} count - The count of number of items to return.
 * @returns {Array} - The the deduped and trimmed items list.
 */
function computeDedupedItems(items = [], valuesToIgnore = [], count) {
    if (items === null) {
        items = [];
    }

    if (valuesToIgnore === null) {
        valuesToIgnore = [];
    }

    const dedupedItems = items.filter(item => {
        return valuesToIgnore.indexOf(item.value) < 0;
    });

    if (Number.isInteger(count) && count > 0 && dedupedItems.length > count) {
        dedupedItems.length = count;
    }

    return dedupedItems;
}

/**
 * Computes custom event to notify change, error, createnew etc.
 * @param {String} type - The type of event being dispatched.
 * @param {Object} detail - The event data.
 * @param {Boolean} bubbles - Whether or not the event bubbles.
 * @returns {Object} - A custom event.
 */
function computeEvent(type, detail, bubbles = true) {
    if (!type) {
        return {};
    }

    if (bubbles === null) {
        bubbles = true;
    }

    // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
    return new CustomEvent(type, {
        composed: bubbles,
        bubbles,
        detail,
    });
}

/**
 * Computes the field API name, qualified with an object name if possible.
 * @param {String|FieldId} fieldName - The value from which to get the field API name.
 * @param {String} sourceApiName - The source record's api name.
 * @return {String} - The field API name.
 */
function computeFieldApiName(fieldName = '', sourceApiName = '') {
    if (fieldName === null) {
        fieldName = '';
    }

    if (sourceApiName === null) {
        sourceApiName = '';
    }

    let apiName = '';

    if (typeof fieldName === 'string' && fieldName.length) {
        const idx = fieldName.indexOf('.');
        if (idx >= 1) {
            apiName = fieldName;
        }
    } else if (
        typeof fieldName === 'object' &&
        typeof fieldName.objectApiName === 'string' &&
        typeof fieldName.fieldApiName === 'string'
    ) {
        apiName = fieldName.objectApiName + '.' + fieldName.fieldApiName;
    }

    if (!apiName.length && fieldName.length && sourceApiName.length) {
        apiName = sourceApiName + '.' + fieldName;
    }

    return apiName;
}

/**
 * Computes a map of field info like isRequired, dependentFields, etc.
 * @param {Object} objectInfos - Source record's objectInfos.
 * @param {String} apiName - An api name.
 * @param {String} fieldApiName - The qualified field name.
 * @returns {Object} - A map of field infos.
 */
function computeFieldInfo(objectInfos, apiName, fieldApiName) {
    let computedFieldInfo = {};

    if (!objectInfos || !apiName || !fieldApiName) {
        return computedFieldInfo;
    }

    const fieldName = computeUnqualifiedFieldApiName(fieldApiName);
    const objectInfo = objectInfos[apiName] || {};
    const fieldInfo = objectInfo.fields ? objectInfo.fields[fieldName] : null;

    if (fieldInfo) {
        computedFieldInfo = {
            // See https://sfdc.co/dependent-lookups for more information.
            dependentFields: fieldInfo.filteredLookupInfo
                ? fieldInfo.filteredLookupInfo.controllingFields
                : undefined,
            fieldName,
            inlineHelpText: fieldInfo.inlineHelpText,
            isRequired: fieldInfo.required,
            references: fieldInfo.referenceToInfos,
            relationshipName: fieldInfo.relationshipName,
        };
    }

    return computedFieldInfo;
}

/**
 * Gets entity items for multi-entity filter.
 * @param {Object} references - A map of reference apis having name fields and action details.
 * @param {String} chosenApi - Selected api that gets check icon.
 * @returns {List} - An array of filter items that can be consumed by the combobox.
 */
function computeFilterItems(references = {}, chosenApi) {
    if (references === null) {
        references = {};
    }

    const referenceApiNames = Object.keys(references);

    let items = null;

    if (referenceApiNames.length > 1) {
        // Alphabetically sort api names.
        referenceApiNames.sort();
        items = [];
        referenceApiNames.forEach(apiName => {
            const item = {
                text: references[apiName].label,
                type: OPTION_TYPE_INLINE,
                value: apiName,
            };

            if (chosenApi && apiName === chosenApi) {
                item.highlight = true;
                item.iconAlternativeText = `${i18n.currentSelection}`;
                item.iconName = ICON_CHECK;
                item.iconSize = ICON_SIZE_X_SMALL;
            }

            items.push(item);
        });
    }

    return items;
}

/**
 * Gets filter label for the multi-entity lookup.
 * @returns {String} - Filter dropdown label for the multi-entity.
 */
function computeFilterLabel() {
    return `${i18n.selectEntity}`;
}

/**
 * Determines the SLDS icon string given an objectInfo. If the icon cannot be
 * resolved from the given objectInfo, 'standard:default' is returned.
 * TODO: This needs to be done through an API.
 * @param  {Object} objectInfo - An objectInfo.
 * @return {String} - A slds icon string.
 */
function computeIconName(objectInfo) {
    if (!objectInfo || !objectInfo.themeInfo || !objectInfo.themeInfo.iconUrl) {
        return ICON_DEFAULT;
    }
    const iconUrl = objectInfo.themeInfo.iconUrl;
    const parts = iconUrl.split('/');
    const icon = parts.pop().replace(/(_\d+)(\.\w*)/gi, '');
    const category = parts.pop();
    return `${category}:${icon}`;
}

/**
 * Computes heading for the display items.
 * @param {String} label - Plural name of target api.
 * @returns {List} - The new items with heading set.
 */
function computeHeading(label = '') {
    return `${i18n.mruHeader}`.replace('{0}', label);
}

/**
 * Returns items with text slices for highlighting.
 *
 * For example -
 * items = [{ text: "salesforce", subText: "(213)111-4444",...}]
 * term = "sal force"
 * returns -
 * [
 *    {
 *      "text": [
 *        {
 *          "text": "sal",
 *          "highlight": true
 *        },
 *        {
 *          "text": "es"
 *        },
 *        {
 *            "text": "force",
 *            "highlight": true
 *        }
 *      ],
 *      "subText": [
 *        {
 *          "text": "(213)111-4444"
 *        }
 *      ],
 *      ...
 *    }
 *  ]
 *
 * Important caveats -
 *
 * Handling term with substrings:
 * --------------------------------
 * Term is broken up into parts for matching by splitting it using whitespaces.
 * Matching for each part starts from the begining till the end of the original text.
 * Parts that are subtrings of each other may get merged while highlighting.
 * For example -
 * text = "salesforce.com account"
 * term = "salesforce.com a"
 * "salesforce.com" would be highlighted but not "a" because it's a substring of "salesforce.com"
 * however for the term "salesforce.com acc" both "salesforce.com" and "acc" would be highlighted.
 *
 * Handling term with wildcards:
 * --------------------------------
 * Wildcards are not dropped while matching.
 * For example -
 * text = "salesforce.com"
 * term = "sales*"
 * would NOT result in highlighting of "sales". However if text was "sales*foo"
 * then the subtring "sales*" would be highlighted.
 *
 * @param {Array} items - Items representing records.
 * @param {String} term - A search term for matching.
 * @return {Array} - An array of items with text split for highlighting.
 */
function computeHighlightedItems(items, term) {
    const output = [];

    // No-op if items or term is empty.
    if (!items || items.length === 0 || !term) {
        return output;
    }

    // Get unique parts of the term.
    // For example -
    // term = "sal sal sales"
    // words = ["sal","sales"]
    const words = term
        .trim()
        .split(' ')
        .filter((w, i, ar) => {
            return ar.indexOf(w) === i;
        });

    items.forEach(item => {
        const outputItem = Object.assign({}, item);

        // Creating text list to process text and subText.
        const textList = [];

        // Process text only if it's not empty
        if (item.text) {
            textList.push({ type: 'text', text: item.text });
        } else {
            outputItem.text = null;
        }

        // Process subText only if it's not empty
        if (item.subText) {
            textList.push({ type: 'subText', text: item.subText });
        } else {
            outputItem.subText = null;
        }

        textList.forEach(textItem => {
            // Get matching indexes for the search term.
            const intervals = getMatchingIndexes(textItem.text, words);
            // If match not found, then return the original text.
            if (intervals.length === 0) {
                outputItem[textItem.type] = [{ text: textItem.text }];
            } else {
                // Get slices of matching text with highlight markers.
                outputItem[textItem.type] = splitTextFromMatchingIndexes(
                    textItem.text,
                    intervals
                );
            }
        });

        output.push(outputItem);
    });

    return output;
}

/**
 * Computes a map of object info for a given api.
 * @param {Object} objectInfos - Source record's objectInfos.
 * @param {String} apiName - An api name.
 * @returns {Object} - A map of object infos for the given api.
 */
function computeObjectInfo(objectInfos, apiName) {
    if (!objectInfos || !apiName) {
        return {};
    }

    const objectInfo = objectInfos[apiName] || {};
    const themeInfo = objectInfo.themeInfo || {};

    return {
        apiName,
        color: themeInfo.color || '',
        iconAlternativeText: apiName,
        iconName: computeIconName(objectInfo),
        iconUrl: themeInfo.iconUrl || '',
        keyPrefix: objectInfo.keyPrefix,
        label: objectInfo.label,
        labelPlural: objectInfo.labelPlural,
    };
}

/**
 * Computes an array of optional name fields required for @wire(getRecordUi)
 * For example - ['Opportunity.Name', 'User.Name'...]
 * @param {Object} references - A map of reference apis having name fields and action details.
 * @returns {Array} - An array of name fields.
 */
function computeOptionalNameFields(references = {}) {
    if (references === null) {
        references = {};
    }

    const optionalNameFields = [];
    for (const reference in references) {
        if (
            references.hasOwnProperty(reference) &&
            references[reference].hasOwnProperty('optionalNameField')
        ) {
            optionalNameFields.push(references[reference].optionalNameField);
        }
    }
    return optionalNameFields;
}

/**
 * Gets placeholder text for lookup input.
 * @param {String} label - Plural name of target api.
 * @returns {String} - Placeholder text for lookup input.
 */
function computePlaceholder(label) {
    let placeholder;
    if (label) {
        // Returns "Search <label>", for example - "Search Accounts".
        placeholder = `${i18n.searchObjectsPlaceholder}`.replace('{0}', label);
    } else {
        // Returns "Search..."
        placeholder = `${i18n.searchPlaceholder}`;
    }
    return placeholder;
}

/**
 * Computes a list of pills for the record values.
 * @param  {Object} record - A record representation.
 * @param {Object} fieldInfo - The record's field info.
 * @param {Object} referenceInfos - The reference api infos.
 * @returns {Array} - An array of pills for the record field values.
 */
function computeRecordPills(record, fieldInfo, referenceInfos) {
    let pills = [];

    if (!record || !fieldInfo || !referenceInfos) {
        return pills;
    }

    const relationshipFieldValue =
        record.fields[fieldInfo.relationshipName].value;

    // No-op if relationship field value is empty.
    if (!relationshipFieldValue) {
        return pills;
    }

    // No-op if field value and relationship field value are inconsistent.
    if (
        relationshipFieldValue.fields.Id.value !==
        record.fields[fieldInfo.fieldName].value
    ) {
        return pills;
    }

    const apiName = relationshipFieldValue.apiName;

    if (apiName in referenceInfos) {
        const referenceInfo = referenceInfos[apiName];
        const pill = {
            iconAlternativeText: referenceInfo.iconAlternativeText,
            iconName: referenceInfo.iconName,
            iconSize: ICON_SIZE_SMALL,
            label: relationshipFieldValue.fields[referenceInfo.nameField].value,
            type: PILL_TYPE_ICON,
            value: relationshipFieldValue.fields.Id.value,
        };
        pills = [pill];
    }

    return pills;
}

/**
 * Computes a list of values from record for the given field.
 * @param  {Object} record - A record representation.
 * @param {String} fieldApiName - The qualified field name.
 * @returns {Array} - An array of the record field values.
 */
function computeRecordValues(record, fieldApiName) {
    if (!record || !fieldApiName) {
        return [];
    }

    const fieldName = computeUnqualifiedFieldApiName(fieldApiName);
    const recordField = record.fields[fieldName];

    return recordField.value && recordField.value.length
        ? [recordField.value]
        : [];
}

/**
 * Computes a map of supported references apis with their infos like nameField, label, iconName etc.
 * @param {Object} objectInfos - Source record's objectInfos.
 * @param {Object} referenceToInfos - References for the field.
 * @returns {Object} - A map of reference infos.
 */
function computeReferenceInfos(objectInfos = {}, referenceToInfos = []) {
    if (objectInfos === null) {
        objectInfos = {};
    }

    if (referenceToInfos === null) {
        referenceToInfos = [];
    }

    const references = {};
    for (const reference of referenceToInfos) {
        const apiName = reference.apiName;
        const nameFields = reference.nameFields;
        let nameField;
        if (Array.isArray(nameFields) && nameFields.length > 0) {
            if (nameFields.length > 1) {
                nameField = 'Name';
            } else {
                nameField = nameFields[0];
            }
            const objectInfo = computeObjectInfo(objectInfos, apiName);
            objectInfo.createNewEnabled = undefined;
            objectInfo.nameField = nameField;
            objectInfo.optionalNameField = apiName + '.' + nameField;
            references[apiName] = objectInfo;
        }
    }
    return references;
}

/**
 * Computes map of attributes for given object.
 * Common keys include name, label, labelPlural and iconUrl.
 * @param {Object} objectInfo - An objectInfo.
 * @returns {Object} - A map of attributes.
 */
function computeScopeMap(objectInfo = {}) {
    if (objectInfo === null) {
        objectInfo = {};
    }

    return {
        iconUrl: objectInfo.iconUrl,
        label: objectInfo.label,
        labelPlural: objectInfo.labelPlural,
        name: objectInfo.apiName,
    };
}

/**
 * Computes the field API name from a qualified field name.
 * For example - Opportunity.AccountId returns 'AccountId'
 * @param {String} fieldApiName - The qualified field name.
 * @return {String} - The unqualified field name.
 */
function computeUnqualifiedFieldApiName(fieldApiName = '') {
    if (fieldApiName === null) {
        fieldApiName = '';
    }
    const idx = fieldApiName.indexOf('.');
    // The object api name must non-empty.
    if (idx < 1) {
        return '';
    }
    return fieldApiName.substring(idx + 1);
}

/**
 * Checks if the given term is contains any CJK characters.
 * @param {String} term - A search term.
 * @return {Boolean} - True if the term contains any CJK characters.
 */
function hasCJK(term = '') {
    if (term === null) {
        return false;
    }

    if (typeof term !== 'string') {
        return false;
    }

    const chars = term.trim().split('');
    for (let i = 0; i < chars.length; i++) {
        if (
            /^[\u1100-\u1200\u3040-\uFB00\uFE30-\uFE50\uFF00-\uFFF0]+$/.test(
                chars[i]
            )
        ) {
            return true;
        }
    }
    return false;
}

/**
 * Checks if at least one action supports "CreateFromLookup".
 * @param {Array} actions - An array of lookup actions received from @wire(getLookupActions)
 * @returns {Boolean} - True if "CreateFromLookup" action was found.
 */
function hasCreateFromLookup(actions = []) {
    if (actions === null) {
        actions = [];
    }

    let hasCreateNew = false;

    if (!Array.isArray(actions) || actions.length === 0) {
        return hasCreateNew;
    }

    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const actionListContext = action.hasOwnProperty('actionListContext')
            ? action.actionListContext
            : null;
        const actionApiName = action.hasOwnProperty('apiName')
            ? action.apiName
            : null;
        hasCreateNew =
            actionListContext === 'Lookup' &&
            actionApiName === 'CreateFromLookup';
        if (hasCreateNew) {
            return hasCreateNew;
        }
    }

    return hasCreateNew;
}

/**
 * Checks if object has no keys.
 * @param {String} obj - An object to be validated.
 * @returns {Boolean} - True if object has no keys.
 */
function isEmptyObject(obj) {
    if (obj === undefined || obj === null) {
        return false;
    }

    // eslint-disable-next-line guard-for-in
    for (const name in obj) {
        return false;
    }
    return true;
}

/**
 * Checks if the given term is a valid search term.
 * @param {String} term - A search term.
 * @return {Boolean} - True if the term is a valid search string.
 */
function isValidSearchTerm(term) {
    if (!term) {
        return false;
    }
    const normalizedTerm = term.replace(/[()"?*]+/g, '').trim();
    return normalizedTerm.length >= 2 || hasCJK(normalizedTerm);
}

/**
 * Checks if the given term is a valid typeahead search term.
 * @param {String} term - A search term.
 * @return {Boolean} - True if the term is a valid typeahead string.
 */
function isValidTypeAheadTerm(term) {
    if (!term) {
        return false;
    }
    const normalizedTerm = term.replace(/[()"?*]+/g, '').trim();
    return (
        normalizedTerm.length < 255 &&
        (normalizedTerm.length > 2 || hasCJK(normalizedTerm))
    );
}

/**
 * Returns matching indexes for the terms found in the given text.
 *
 * For example -
 * text = "salesforce"
 * words = ["sal","force"]
 * returns - [[0,3],[5,10]]
 *
 * @param {String} text - Original text for matchin search term.
 * @param {String} words - Distinct words or term parts.
 * @return {Array} - An array of intervals.
 */
function getMatchingIndexes(text, words) {
    let output = [];

    // No-op if text to match or term is missing.
    if (!text || !words) {
        return output;
    }

    const matchIndexes = {};
    // Convert text to lower case for matching.
    const lowerCasedText = text.toLowerCase();

    for (let t = 0; t < words.length; t++) {
        const word = words[t];
        // Convert word to lower case for matching.
        const lowerCasedWord = word.toLowerCase();

        let index = 0,
            start = 0,
            numMatches = 0;

        while (start < text.length && index !== -1 && numMatches < 1) {
            index = lowerCasedText.indexOf(lowerCasedWord, start);
            // Match found.
            if (index > -1) {
                // Get end index for the current term.
                const endIndex = index + lowerCasedWord.length;
                // If some term part was found previously with the same start
                // index then update the endIndex having longest part.
                // For example -
                // text = "salesforce"
                // words = ["sal", "salesf"]
                //
                // For "sal", matchIndexes would be {0:3}
                // For "salesf", matchIndexes would be updated to {0:6}
                if (matchIndexes[index]) {
                    if (matchIndexes[index] < endIndex) {
                        matchIndexes[index] = endIndex;
                    }
                } else {
                    // No matching term part found for the index, make a new entry.
                    matchIndexes[index] = endIndex;
                }
                numMatches++;
                // Increment the start pointer.
                start = endIndex;
            }
        }
    }

    // Convert indexes map into an array of indexes.
    output = Object.keys(matchIndexes).map(interval => {
        return [parseInt(interval, 10), matchIndexes[interval]];
    });

    return output;
}

/**
 * Merges overlapping intervals.
 *
 * For example -
 * intervals = [[0,3],[1,4],[5,7]]
 * returns - [[0,4],[5,7]]
 *
 * @param {Array} intervals - An array of intervals to merge.
 * @return {Array} - An array of merged intervals.
 */
function mergeIntervals(intervals) {
    if (!intervals || !intervals.length) {
        return [];
    }

    intervals.sort((a, b) => {
        return a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];
    });

    let prev = intervals[0];
    const output = [prev];

    for (const curr of intervals) {
        if (curr[0] <= prev[1]) {
            prev[1] = Math.max(prev[1], curr[1]);
        } else {
            output.push(curr);
            prev = curr;
        }
    }

    return output;
}

/**
 * Splits text using indexes and adds highlight marker.
 *
 * For example -
 * text = "salesforce"
 * intervals = [[0,3]]
 * returns -
 * [
 *  {
 *    "text": "sal",
 *    "highlight": true
 *  },
 *  {
 *    "text": "esforce"
 *  }
 * ]
 *
 * @param {String} text - Original text for matching indexes.
 * @param {Array} intervals - An array of intervals to highlight.
 * @return {Array} - An array of text items with highlighting.
 */
function splitTextFromMatchingIndexes(text, intervals) {
    const output = [];

    // No-op if text or intervals is missing.
    if (!text || !intervals || intervals.length === 0) {
        return output;
    }

    // Merge intervals to avoid incorrect slicing.
    const _intervals = mergeIntervals(intervals);

    // Sort array based on first value.
    _intervals.sort((prev, next) => {
        return prev[0] > next[0];
    });

    let prevMatchEndIdx = 0;

    for (let i = 0; i < _intervals.length; i++) {
        const startIdx = _intervals[i][0];
        const endIdx = _intervals[i][1];

        // Push part before start index.
        const prevText = text.substring(prevMatchEndIdx, startIdx);
        if (prevText) {
            output.push({ text: prevText });
        }

        // Push part having match.
        output.push({
            text: text.substring(startIdx, endIdx),
            highlight: true,
        });

        // Update previous match index with current end index.
        prevMatchEndIdx = endIdx;
    }

    // Push remaining text.
    const remainingText = text.substring(prevMatchEndIdx);
    if (remainingText) {
        output.push({ text: remainingText });
    }

    return output;
}

export {
    arraysIdentical,
    computeAdvancedSearchOption,
    computeBindingsString,
    computeBindingsMap,
    computeCreateNewOption,
    computeDedupedItems,
    computeEvent,
    computeFieldApiName,
    computeFieldInfo,
    computeFilterItems,
    computeFilterLabel,
    computeIconName,
    computeHeading,
    computeHighlightedItems,
    computeObjectInfo,
    computeOptionalNameFields,
    computePlaceholder,
    computeRecordPills,
    computeRecordValues,
    computeReferenceInfos,
    computeScopeMap,
    computeUnqualifiedFieldApiName,
    hasCJK,
    hasCreateFromLookup,
    isEmptyObject,
    isValidSearchTerm,
    isValidTypeAheadTerm,
    mergeIntervals,
    splitTextFromMatchingIndexes,
};
