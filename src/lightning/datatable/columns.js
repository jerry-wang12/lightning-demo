import { isObjectLike } from './utils';
import { getRowNumberColumnDef, hasRowNumberColumn } from './rowNumber';
import { isTreeType, isValidTypeForTree } from './types';
import { updateColumnSortingState } from './sort';
import { generateColKeyValue } from './keys';
import { hasEditableColumn, normalizeEditable } from './inlineEdit';

export function getColumnsDefaultState() {
    return {
        columns: [],
    };
}

export function getColumns(state) {
    return state.columns;
}

export function hasColumns(state) {
    return getColumns(state).length > 0;
}

export const SELECTABLE_ROW_CHECKBOX = 'SELECTABLE_CHECKBOX';

const SELECTABLE_COLUMN = {
    type: SELECTABLE_ROW_CHECKBOX,
    fixedWidth: 32,
    tabIndex: -1,
    internal: true,
};

export function normalizeColumns(state, columns, types) {
    if (columns.length !== 0) {
        let firstColumnForReaders = 0;
        // workaround https://git.soma.salesforce.com/raptor/raptor/issues/763
        const normalizedColumns = Object.assign([], columns);

        if (!state.hideCheckboxColumn) {
            firstColumnForReaders++;
            normalizedColumns.unshift(SELECTABLE_COLUMN);
        }

        if (hasRowNumberColumn(state) || hasEditableColumn(columns)) {
            firstColumnForReaders++;
            normalizedColumns.unshift(getRowNumberColumnDef());
        }

        state.columns = normalizedColumns.map((column, index) => {
            const normalizedColumn = Object.assign(
                getColumnDefaults(column),
                column
            );
            if (isCustomerColumn(normalizedColumn)) {
                normalizeColumnDataType(normalizedColumn, types);
                normalizeEditable(normalizedColumn);
                updateColumnSortingState(normalizedColumn, state);
            }
            if (isTreeType(normalizedColumn.type)) {
                normalizedColumn.typeAttributes = getNormalizedSubTypeAttribute(
                    normalizedColumn.type,
                    normalizedColumn.typeAttributes
                );
            }
            return Object.assign(normalizedColumn, {
                tabIndex: -1,
                colKeyValue: generateColKeyValue(normalizedColumn, index),
                isScopeCol: index === firstColumnForReaders,
            });
        });
    } else {
        state.columns = [];
    }
}

function normalizeColumnDataType(column, types) {
    if (!types.isValidType(column.type)) {
        column.type = getRegularColumnDefaults().type;
    }
}

/**
 * Normalizes the subType and subTypeAttributes in the typeAttributes.
 * @param {String} type the type of this column
 * @param {Object} typeAttributes the type attributes of the column
 * @returns {Object} a new typeAttributes object with the sybtype and subTypeAttributes normalized.
 */
export function getNormalizedSubTypeAttribute(type, typeAttributes) {
    const typeAttributesOverrides = {};
    if (!isValidTypeForTree(typeAttributes.subType)) {
        typeAttributesOverrides.subType = getColumnDefaults({ type }).subType;
    }
    if (!typeAttributes.subTypeAttributes) {
        typeAttributesOverrides.subTypeAttributes = {};
    }

    return Object.assign({}, typeAttributes, typeAttributesOverrides);
}

function getRegularColumnDefaults() {
    return {
        type: 'text',
        typeAttributes: {},
        cellAttributes: {},
    };
}

function getActionColumnDefaults() {
    return {
        fixedWidth: 50,
        resizable: false,
    };
}

function getTreeColumnDefaults() {
    return {
        type: 'tree',
        subType: 'text',
        typeAttributes: {},
        cellAttributes: {},
    };
}

function getColumnDefaults(column) {
    switch (column.type) {
        case 'action':
            return getActionColumnDefaults();
        case 'tree':
            return getTreeColumnDefaults();
        default:
            return getRegularColumnDefaults();
    }
}

export function isCustomerColumn(column) {
    return column.internal !== true;
}

export function getTypeAttributesValues(column) {
    if (isObjectLike(column.typeAttributes)) {
        return column.typeAttributes;
    }
    return {};
}

export function getSubTypeAttributesValues(column) {
    if (isObjectLike(column.typeAttributes.subTypeAttributes)) {
        return column.typeAttributes.subTypeAttributes;
    }
    return {};
}

export function getCellAttributesValues(column) {
    if (isObjectLike(column.cellAttributes)) {
        return column.cellAttributes;
    }
    return {};
}

/**
 * Return the index in dt.columns (user definition) related to colKeyValue.
 *      -1 if no column with that key exist or if its internal.
 * @param {Object} state The datatable state
 * @param {String} colKeyValue The generated key for the column
 * @return {Number} The index in dt.columns. -1 if not found or if its internal.
 */
export function getUserColumnIndex(state, colKeyValue) {
    const stateColumnIndex = getStateColumnIndex(state, colKeyValue);
    let internalColumns = 0;

    if (state.columns[stateColumnIndex].internal) {
        return -1;
    }

    for (let i = 0; i < stateColumnIndex; i++) {
        if (state.columns[i].internal) {
            internalColumns++;
        }
    }

    return stateColumnIndex - internalColumns;
}

/**
 * Return the index in state.columns (internal definition) related to colKeyValue.
 *
 * @param {Object} state The datatable state
 * @param {String} colKeyValue The generated key for the column
 * @return {number} The index in state.columns.
 */
export function getStateColumnIndex(state, colKeyValue) {
    return state.headerIndexes[colKeyValue];
}

/**
 *
 * @param {Object} state - The datatable state
 * @param {String} fieldName - the field name of the column
 * @returns {number} The index in state.columns, -1 if it does not exist
 */
export function getColumnIndexByFieldName(state, fieldName) {
    let i = 0;
    const columns = getColumns(state);
    const existFieldName = columns.some((column, index) => {
        i = index;
        return column.fieldName === fieldName;
    });

    return existFieldName ? i : -1;
}
