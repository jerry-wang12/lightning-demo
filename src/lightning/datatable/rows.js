import { assert } from 'lightning/utilsPrivate';
import { classSet, isObjectLike } from './utils';
import { createRowKeysGenerator, generateColKeyValue } from './keys';
import { isTreeType, getAttributesNames } from './types';
import {
    isSelectedRow,
    isDisabledRow,
    getRowSelectionInputType,
} from './selector';
import { getTreeStateIndicatorFieldNames, getStateTreeColumn } from './tree';
import {
    getColumns,
    getTypeAttributesValues,
    getSubTypeAttributesValues,
    getCellAttributesValues,
    isCustomerColumn,
} from './columns';
import { isRowNumberColumn, getRowNumberErrorColumnDef } from './rowNumber';
import { getRowError } from './errors';
import { getDirtyValue } from './inlineEdit';

export function getRowsDefaultState() {
    return {
        data: [],
        keyField: undefined,
        rows: [],
        indexes: {},
    };
}

export function setData(state, data) {
    if (Array.isArray(data)) {
        state.data = data;
    } else {
        state.data = [];
    }
}

export function getData(state) {
    return state.data;
}

export function getRows(state) {
    return state.rows;
}

export function setKeyField(state, value) {
    assert(
        typeof value === 'string',
        `The "keyField" value expected in lightning:datatable must be type String.`
    );
    if (typeof value === 'string') {
        state.keyField = value;
    } else {
        state.keyField = undefined;
    }
}

export function getKeyField(state) {
    return state.keyField;
}

export function hasValidKeyField(state) {
    const keyField = getKeyField(state);
    return typeof keyField === 'string';
}

/**
 * It resolve the css classes for a row based on the row.isSelected state
 * @param {object} row - a row object in state.rows collection
 * @returns {string} the classSet string
 */
export function resolveRowClassNames(row) {
    const classes = classSet('slds-hint-parent');
    if (row.isSelected) {
        classes.add('slds-is-selected');
    }

    return classes.toString();
}

/**
 *
 * @param {object} state - data table state
 * @param {string} rowKeyValue - computed id for the row
 * @param {string} colKeyValue - computed id for the column
 *
 * @return {object} The user row that its related to the action.
 */
export function getUserRowByCellKeys(state, rowKeyValue, colKeyValue) {
    const rowIndex = state.indexes[rowKeyValue][colKeyValue][0];
    return getData(state)[rowIndex];
}

/**
 * It compute the state.rows collection based on the current normalized (data, columns)
 * and generate cells indexes map(state.indexes)
 * @param {object} state - the current datatable state
 */
export function updateRowsAndCellIndexes() {
    const { state, privateTypes: types } = this;
    const { keyField } = state;
    const data = getData(state);
    const columns = getColumns(state);
    const { computeUniqueRowKey } = createRowKeysGenerator(keyField);
    const scopeCol = columns.find(
        colData => types.isValidType(colData.type) && colData.isScopeCol
    );
    // initializing indexes
    state.indexes = {};

    state.rows = data.reduce((prev, rowData, rowIndex) => {
        const row = {
            key: computeUniqueRowKey(rowData), // attaching unique key to the row
            cells: [],
        };
        const rowErrors = getRowError(state, row.key);

        state.indexes[row.key] = { rowIndex };

        row.inputType = getRowSelectionInputType(state);
        row.isSelected = isSelectedRow(state, row.key);
        row.ariaSelected = row.isSelected ? 'true' : false;
        row.isDisabled = isDisabledRow(state, row.key);
        row.classnames = resolveRowClassNames(row);
        Object.assign(row, getRowStateForTree(rowData, state));
        row.tabIndex = -1;

        columns.reduce((currentRow, colData, colIndex) => {
            const { fieldName } = colData;
            const colKeyValue = generateColKeyValue(colData, colIndex);
            const dirtyValue = getDirtyValue(state, row.key, colKeyValue);
            const computedCellValue =
                dirtyValue !== undefined ? dirtyValue : rowData[fieldName];
            const colType = types.getType(colData.type);
            // cell object creation
            const cell = {
                columnType: colData.type,
                columnSubType: colData.typeAttributes
                    ? colData.typeAttributes.subType
                    : undefined,
                dataLabel: colData.label,
                value: computedCellValue, // value based on the fieldName
                rowKeyValue: row.key, // unique row key value
                colKeyValue, // unique column key value
                tabIndex: -1, // tabindex
                isCheckbox: colData.type === 'SELECTABLE_CHECKBOX',
                class: computeCellClassNames(colData, rowErrors, dirtyValue),
                hasError:
                    rowErrors.fieldNames &&
                    rowErrors.fieldNames.includes(colData.fieldName),
                isDataType:
                    types.isValidType(colData.type) && !colData.isScopeCol,
                isDataTypeScope:
                    types.isValidType(colData.type) && colData.isScopeCol,
                wrapText: state.wrapText[colKeyValue], // wrapText state
                style:
                    colType && colType.type === 'custom'
                        ? 'padding: 0px;'
                        : undefined,
            };
            if (isCustomerColumn(colData)) {
                Object.assign(
                    cell,
                    computeCellTypeAttributes(rowData, colData, types),
                    computeCellAttributes(rowData, colData),
                    computeCellEditable(colData)
                );
                if (isTreeType(colData.type)) {
                    Object.assign(cell, computeCellStateTypeAttributes(row));
                }
            } else if (isRowNumberColumn(colData)) {
                const scopeColValue = rowData[scopeCol.fieldName];
                const errorColumnDef = getRowNumberErrorColumnDef(
                    rowErrors,
                    scopeColValue
                );
                Object.assign(
                    cell,
                    computeCellTypeAttributes(rowData, errorColumnDef, types)
                );
            }

            // adding cell indexes to state.indexes
            // Keeping the hash for backward compatibility, but we need to have 2 indexes, 1 for columns and one for rows,
            // because of memory usage and also at certain point we might have the data but not the columns
            state.indexes[row.key][colKeyValue] = [rowIndex, colIndex];

            currentRow.push(cell);
            return currentRow;
        }, row.cells);

        prev.push(row);
        return prev;
    }, []);
}

export function computeCellAttributes(row, column) {
    const cellAttributesValues = getCellAttributesValues(column);
    return Object.keys(cellAttributesValues).reduce((attrs, attrName) => {
        const attrValue = cellAttributesValues[attrName];
        attrs[attrName] = resolveAttributeValue(attrValue, row);

        return attrs;
    }, {});
}

export function computeCellTypeAttributes(row, column, types) {
    if (column.typeAttributes && column.typeAttributes.subType) {
        return computeCellSubTypeAttributes(row, column);
    }
    const attributesNames = types.getType(column.type).typeAttributes;
    const typeAttributesValues = getTypeAttributesValues(column);

    return attributesNames.reduce((attrs, attrName, index) => {
        const typeAttributeName = `typeAttribute${index}`;

        attrs[typeAttributeName] = resolveAttributeValue(
            typeAttributesValues[attrName],
            row
        );

        return attrs;
    }, {});
}

export function computeCellSubTypeAttributes(row, column) {
    const attributesNames = getAttributesNames(column.typeAttributes.subType);
    const typeAttributesValues = getSubTypeAttributesValues(column);

    return attributesNames.reduce((attrs, attrName, index) => {
        const typeAttributeName = `typeAttribute${index}`;
        attrs[typeAttributeName] = resolveAttributeValue(
            typeAttributesValues[attrName],
            row
        );

        return attrs;
    }, {});
}

function computeCellEditable(column) {
    return {
        editable: column.editable,
    };
}

function computeCellClassNames(column, rowErrors, dirtyValue) {
    const classNames = classSet('');
    classNames.add({ 'slds-cell-edit': column.editable === true });
    classNames.add({ 'slds-tree__item': isTreeType(column.type) });
    classNames.add({
        'slds-has-error':
            rowErrors.fieldNames &&
            rowErrors.fieldNames.includes(column.fieldName),
    });
    classNames.add({ 'slds-is-edited': dirtyValue !== undefined });
    return classNames.toString();
}

/**
 * Attaches if the row containing this cell hasChildren or not and isExpanded or not
 * attributes to typeAttribute21 and typeAttribute22 respectively
 * typeAttribute0-typeAttribute20 are reserved for  types supported by tree
 * @param {object}row - current row which is stored in state.rows
 * @returns {{typeAttribute21, typeAttribute22: boolean}} typeAttributes
 * describing state of the row associated
 */
function computeCellStateTypeAttributes(row) {
    return {
        typeAttribute21: row.hasChildren,
        typeAttribute22: row.isExpanded === 'true',
    };
}

export function getRowIndexByKey(state, key) {
    if (!state.indexes[key]) {
        return undefined;
    }

    return state.indexes[key].rowIndex;
}

export function getRowByKey(state, key) {
    const rows = getRows(state);
    return rows[getRowIndexByKey(state, key)];
}

export function rowKeyExists(state, key) {
    return !!state.indexes[key];
}

export function getRowsTotal(state) {
    return getRows(state).length;
}

function resolveAttributeValue(attrValue, row) {
    if (isObjectLike(attrValue)) {
        const fieldName = attrValue.fieldName;
        if (fieldName) {
            return row[fieldName];
        }
    }

    return attrValue;
}

function getRowStateForTree(row, state) {
    const column = getStateTreeColumn(state);
    if (column) {
        return {
            level: getRowLevel(column, row),
            posInSet: getRowPosInSet(column, row),
            setSize: getRowSetSize(column, row),
            isExpanded: isRowExpanded(column, row),
            hasChildren: getRowHasChildren(column, row),
        };
    }
    return {};
}

export function getRowLevel(column, row) {
    const typeAttributesValues = getTypeAttributesValues(column);
    const attrValue = resolveAttributeValue(
        typeAttributesValues[getTreeStateIndicatorFieldNames().level],
        row
    );
    return attrValue ? attrValue : 1;
}

function getRowPosInSet(column, row) {
    const typeAttributesValues = getTypeAttributesValues(column);
    const attrValue = resolveAttributeValue(
        typeAttributesValues[getTreeStateIndicatorFieldNames().position],
        row
    );
    return attrValue ? attrValue : 1;
}

function getRowSetSize(column, row) {
    const typeAttributesValues = getTypeAttributesValues(column);
    const attrValue = resolveAttributeValue(
        typeAttributesValues[getTreeStateIndicatorFieldNames().setsize],
        row
    );
    return attrValue ? attrValue : 1;
}

export function isRowExpanded(column, row) {
    const typeAttributesValues = getTypeAttributesValues(column);
    const hasChildren = resolveAttributeValue(
        typeAttributesValues[getTreeStateIndicatorFieldNames().children],
        row
    );
    if (hasChildren) {
        const attrValue = resolveAttributeValue(
            typeAttributesValues[getTreeStateIndicatorFieldNames().expanded],
            row
        );
        return !!attrValue + '';
    }
    return undefined;
}

export function getRowHasChildren(column, row) {
    const typeAttributesValues = getTypeAttributesValues(column);
    const hasChildren = resolveAttributeValue(
        typeAttributesValues[getTreeStateIndicatorFieldNames().children],
        row
    );
    return !!hasChildren;
}
