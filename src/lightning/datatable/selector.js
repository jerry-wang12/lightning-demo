import {
    resolveRowClassNames,
    getRows,
    getRowByKey,
    getRowsTotal,
    getRowIndexByKey,
    rowKeyExists,
} from './rows';
import {
    getColumns,
    getStateColumnIndex,
    SELECTABLE_ROW_CHECKBOX,
} from './columns';
import { isPositiveInteger } from './utils';

const MAX_ROW_SELECTION_DEFAULT = undefined;

export function getSelectorDefaultState() {
    return {
        selectedRowsKeys: {},
        maxRowSelection: MAX_ROW_SELECTION_DEFAULT,
    };
}

export function handleSelectAllRows(event) {
    event.stopPropagation();
    markAllRowsSelected(this.state);
    this.fireSelectedRowsChange(this.getSelectedRows());
}

export function handleDeselectAllRows(event) {
    event.stopPropagation();
    markAllRowsDeselected(this.state);
    this.fireSelectedRowsChange(this.getSelectedRows());
}

/**
 * Will select the cell identified by rowKeyValue, colKeyValue.
 * This will reflect as aria-selected="true" attribute in the cell td or th.
 *
 * Note: This change is volatile, and will be reset (lost) in the next index regeneration.
 *
 * @param {Object} state - the state of the datatable
 * @param {String} rowKeyValue - the row key of the cell to select
 * @param {String} colKeyValue - the col key of the cell to select
 */
export function markSelectedCell(state, rowKeyValue, colKeyValue) {
    const row = getRowByKey(state, rowKeyValue);
    const colIndex = getStateColumnIndex(state, colKeyValue);

    if (row && colIndex) {
        row.cells[colIndex].ariaSelected = 'true';
    }
}

/**
 * Will deselect the cell identified by rowKeyValue, colKeyValue.
 * This will reflect in removing aria-selected attribute in the cell td or th (if it was previously added).
 *
 * Note: This change is volatile, and will be reset (lost) in the next index regeneration.
 *
 * @param {Object} state - the state of the datatable
 * @param {String} rowKeyValue - the row key of the cell to select
 * @param {String} colKeyValue - the col key of the cell to select
 */
export function markDeselectedCell(state, rowKeyValue, colKeyValue) {
    const row = getRowByKey(state, rowKeyValue);
    const colIndex = getStateColumnIndex(state, colKeyValue);

    if (row && colIndex) {
        row.cells[colIndex].ariaSelected = false;
    }
}

/**
 * Returns the last rowKey that was clicked, false otherwise.
 * @param {Object} state - the datatable state.
 * @return {String | undefined } the row key or false.
 */
function getLastRowSelection(state) {
    const lastSelectedRowKey = state.selectionLastSelectedRow;
    const keyIsValid =
        lastSelectedRowKey !== undefined &&
        getRowIndexByKey(state, lastSelectedRowKey) !== undefined;

    return keyIsValid ? lastSelectedRowKey : undefined;
}

function setLastRowSelection(state, rowKeyValue) {
    state.selectionLastSelectedRow = rowKeyValue;
}

export function handleSelectRow(event) {
    event.stopPropagation();
    const { rowKeyValue, isMultiple } = event.detail;
    let fromRowKey = rowKeyValue;

    if (isMultiple) {
        fromRowKey = getLastRowSelection(this.state) || rowKeyValue;
    }

    markSelectedRowsInterval(this.state, fromRowKey, rowKeyValue);
    setLastRowSelection(this.state, rowKeyValue);
    this.fireSelectedRowsChange(this.getSelectedRows());
}

function markSelectedRowsInterval(state, startRowKey, endRowKey) {
    const rows = getRows(state);
    const { start, end } = getRowIntervalIndexes(state, startRowKey, endRowKey);
    const maxRowSelection = getMaxRowSelection(state) || getRowsTotal(state);
    let i = start,
        maxSelectionReached;

    do {
        markRowSelected(state, rows[i].key);
        maxSelectionReached =
            getCurrentSelectionLength(state) >= maxRowSelection;
        i++;
    } while (i <= end && !maxSelectionReached);
}

export function handleDeselectRow(event) {
    event.stopPropagation();
    const { rowKeyValue, isMultiple } = event.detail;
    let fromRowKey = rowKeyValue;

    if (isMultiple) {
        fromRowKey = getLastRowSelection(this.state) || rowKeyValue;
    }

    markDeselectedRowsInterval(this.state, fromRowKey, rowKeyValue);
    setLastRowSelection(this.state, rowKeyValue);
    this.fireSelectedRowsChange(this.getSelectedRows());
}

function getRowIntervalIndexes(state, startRowKey, endRowKey) {
    const start =
        startRowKey === 'HEADER' ? 0 : getRowIndexByKey(state, startRowKey);
    const end = getRowIndexByKey(state, endRowKey);

    return {
        start: Math.min(start, end),
        end: Math.max(start, end),
    };
}

function markDeselectedRowsInterval(state, startRowKey, endRowKey) {
    const rows = getRows(state);
    const { start, end } = getRowIntervalIndexes(state, startRowKey, endRowKey);

    for (let i = start; i <= end; i++) {
        markRowDeselected(state, rows[i].key);
    }
}

export function getSelectedRowsKeys(state) {
    return Object.keys(state.selectedRowsKeys).filter(
        key => state.selectedRowsKeys[key]
    );
}

function getSelectedDiff(state, value) {
    const selectedRowsKeys = state.selectedRowsKeys;
    return value.filter(key => !selectedRowsKeys[key]);
}

function getDeselectedDiff(state, value) {
    const currentSelectedRowsKeys = state.selectedRowsKeys;
    return Object.keys(currentSelectedRowsKeys).filter(
        key => currentSelectedRowsKeys[key] && !value[key]
    );
}

function normalizeSelectedRowsKey(value) {
    return value.reduce((map, key) => {
        map[key] = true;
        return map;
    }, {});
}

function markRowsSelectedByKeys(state, keys) {
    keys.forEach(rowKeyValue => {
        const row = getRowByKey(state, rowKeyValue);
        row.isSelected = true;
        row.ariaSelected = 'true';
        row.classnames = resolveRowClassNames(row);
    });
}

function markRowsDeselectedByKeys(state, keys) {
    keys.forEach(rowKeyValue => {
        const row = getRowByKey(state, rowKeyValue);
        row.isSelected = false;
        row.ariaSelected = false;
        row.classnames = resolveRowClassNames(row);
    });
}

function filterValidKeys(state, keys) {
    return keys.filter(key => rowKeyExists(state, key));
}

export function setSelectedRowsKeys(state, value) {
    if (Array.isArray(value)) {
        const maxRowSelection = getMaxRowSelection(state);
        const previousSelectionLength = getCurrentSelectionLength(state);
        let selectedRows = filterValidKeys(state, value);
        if (selectedRows.length > maxRowSelection) {
            // eslint-disable-next-line no-console
            console.warn(`The number of keys in selectedRows for lightning:datatable
            exceeds the limit defined by maxRowSelection.`);
            selectedRows = selectedRows.slice(0, maxRowSelection);
        }
        const normalizedSelectedRowsKeys = normalizeSelectedRowsKey(
            selectedRows
        );
        const selectionOperations = getSelectedDiff(state, selectedRows);
        const deselectionOperations = getDeselectedDiff(
            state,
            normalizedSelectedRowsKeys
        );
        markRowsSelectedByKeys(state, selectionOperations);
        markRowsDeselectedByKeys(state, deselectionOperations);
        state.selectedRowsKeys = normalizedSelectedRowsKeys;

        if (selectedRows.length === maxRowSelection && maxRowSelection > 1) {
            markDeselectedRowDisabled(state);
        } else if (
            selectedRows.length < maxRowSelection &&
            previousSelectionLength === maxRowSelection
        ) {
            markDeselectedRowEnabled(state);
        }
    } else {
        // eslint-disable-next-line no-console
        console.error(`The "selectedRows" passed into "lightning:datatable"
        must be an Array with the keys of the selected rows. We receive instead ${value}`);
        markAllRowsDeselected(state);
    }
}

export function getMaxRowSelection(state) {
    return state.maxRowSelection;
}

export function getHideSelectAllCheckbox(state) {
    return getMaxRowSelection(state) === 1;
}

export function setMaxRowSelection(state, value) {
    markAllRowsDeselected(state);
    if (isPositiveInteger(value)) {
        const previousMaxRowSelection = getMaxRowSelection(state);
        state.maxRowSelection = Number(value);
        if (
            inputTypeNeedsToChange(
                previousMaxRowSelection,
                getMaxRowSelection(state)
            )
        ) {
            updateRowSelectionInputType(state);
            updateSelectionState(state);
        }
    } else {
        state.maxRowSelection = MAX_ROW_SELECTION_DEFAULT;
        // eslint-disable-next-line no-console
        console.error(
            `The maxRowSelection value passed into lightning:datatable
            should be a positive integer. We receive instead (${value}).`
        );
    }
}

export function inputTypeNeedsToChange(
    previousMaxRowSelection,
    newMaxRowSelection
) {
    return (
        (previousMaxRowSelection === 1 &&
            isMultiSelection(newMaxRowSelection)) ||
        (isMultiSelection(previousMaxRowSelection) &&
            newMaxRowSelection === 1) ||
        (previousMaxRowSelection === 0 || newMaxRowSelection === 0)
    );
}

export function isMultiSelection(value) {
    return value > 1 || value === undefined;
}

export function updateRowSelectionInputType(state) {
    const type = getRowSelectionInputType(state);
    const rows = getRows(state);

    resetSelectedRowsKeys(state);
    rows.forEach(row => {
        row.inputType = type;
        row.isSelected = false;
        row.ariaSelected = false;
        row.isDisabled = isDisabledRow(state, row.key);
    });
}

export function isSelectedRow(state, rowKeyValue) {
    return !!state.selectedRowsKeys[rowKeyValue];
}

export function isDisabledRow(state, rowKeyValue) {
    if (!isSelectedRow(state, rowKeyValue)) {
        const maxRowSelection = getMaxRowSelection(state);

        // W-4819182 when selection is 1, we should not disable selection.
        return (
            maxRowSelection !== 1 &&
            getCurrentSelectionLength(state) === maxRowSelection
        );
    }

    return false;
}

export function getRowSelectionInputType(state) {
    if (getMaxRowSelection(state) === 1) {
        return 'radio';
    }
    return 'checkbox';
}

export function markDeselectedRowDisabled(state) {
    const rows = getRows(state);
    rows.forEach(row => {
        if (!isSelectedRow(state, row.key)) {
            row.isDisabled = true;
        }
    });
}

export function markDeselectedRowEnabled(state) {
    const rows = getRows(state);
    rows.forEach(row => {
        if (!isSelectedRow(state, row.key)) {
            row.isDisabled = false;
        }
    });
}

export function getCurrentSelectionLength(state) {
    return getSelectedRowsKeys(state).length;
}

export function markRowSelected(state, rowKeyValue) {
    const row = getRowByKey(state, rowKeyValue);
    const maxRowSelection = getMaxRowSelection(state) || getRowsTotal(state);
    const previousSelectionLength = getCurrentSelectionLength(state);

    row.isSelected = true;
    row.ariaSelected = 'true';
    row.classnames = resolveRowClassNames(row);

    if (maxRowSelection > 1) {
        addKeyToSelectedRowKeys(state, row.key);
        if (previousSelectionLength + 1 === maxRowSelection) {
            markDeselectedRowDisabled(state);
        }
    } else {
        if (previousSelectionLength === 1) {
            const previousSelectedRow = getRowByKey(
                state,
                Object.keys(state.selectedRowsKeys)[0]
            );
            previousSelectedRow.isSelected = false;
            previousSelectedRow.ariaSelected = false;
            previousSelectedRow.classnames = resolveRowClassNames(
                previousSelectedRow
            );
            resetSelectedRowsKeys(state);
        }
        addKeyToSelectedRowKeys(state, row.key);
    }
}

export function markRowDeselected(state, rowKeyValue) {
    const row = getRowByKey(state, rowKeyValue);
    const maxRowSelection = getMaxRowSelection(state);

    row.isSelected = false;
    row.ariaSelected = false;
    row.classnames = resolveRowClassNames(row);
    removeKeyFromSelectedRowKeys(state, row.key);

    if (getCurrentSelectionLength(state) === maxRowSelection - 1) {
        markDeselectedRowEnabled(state);
    }
}

export function resetSelectedRowsKeys(state) {
    state.selectedRowsKeys = {};
}

export function markAllRowsSelected(state) {
    const rows = getRows(state);
    const maxRowSelection = getMaxRowSelection(state);

    resetSelectedRowsKeys(state);
    rows.forEach((row, index) => {
        if (index < maxRowSelection || maxRowSelection === undefined) {
            row.isSelected = true;
            row.ariaSelected = 'true';
            row.classnames = resolveRowClassNames(row);
            addKeyToSelectedRowKeys(state, row.key);
        } else {
            row.isDisabled = true;
            row.isSelected = false;
            row.ariaSelected = false;
            row.classnames = resolveRowClassNames(row);
        }
    });
}

export function markAllRowsDeselected(state) {
    const rows = getRows(state);

    resetSelectedRowsKeys(state);
    rows.forEach(row => {
        row.isDisabled = false;
        row.isSelected = false;
        row.ariaSelected = false;
        row.classnames = resolveRowClassNames(row);
    });
    return state;
}

export function syncSelectedRowsKeys(state, selectedRows) {
    let changed = false;
    const { selectedRowsKeys, keyField } = state;

    if (Object.keys(selectedRowsKeys).length !== selectedRows.length) {
        changed = true;
        state.selectedRowsKeys = updateSelectedRowsKeysFromSelectedRows(
            selectedRows,
            keyField
        );
    } else {
        changed = selectedRows.some(row => !selectedRowsKeys[row[keyField]]);
        if (changed) {
            state.selectedRowsKeys = updateSelectedRowsKeysFromSelectedRows(
                selectedRows,
                keyField
            );
        }
    }

    updateSelectionState(state);

    return {
        ifChanged: callback => {
            if (changed && typeof callback === 'function') {
                callback(selectedRows);
            }
        },
    };
}

export function handleRowSelectionChange() {
    updateSelectionState(this.state);
}

function updateSelectedRowsKeysFromSelectedRows(selectedRows, keyField) {
    return selectedRows.reduce((selectedRowsKeys, row) => {
        selectedRowsKeys[row[keyField]] = true;
        return selectedRowsKeys;
    }, {});
}

function addKeyToSelectedRowKeys(state, key) {
    state.selectedRowsKeys[key] = true;
}

function removeKeyFromSelectedRowKeys(state, key) {
    // not using delete this.state.selectedRowsKeys[key]
    // because that cause perf issues
    state.selectedRowsKeys[key] = false;
}

export function updateSelectionState(state) {
    const selectBoxesColumnIndex = getSelectBoxesColumnIndex(state);
    if (selectBoxesColumnIndex >= 0) {
        state.columns[selectBoxesColumnIndex] = Object.assign(
            {},
            state.columns[selectBoxesColumnIndex],
            {
                bulkSelection: getBulkSelectionState(state),
                isBulkSelectionDisabled: isBulkSelectionDisabled(state),
            }
        );
    }
}

export function getBulkSelectionState(state) {
    const selected = getCurrentSelectionLength(state);
    const total = getMaxRowSelection(state) || getRowsTotal(state);
    if (selected === 0) {
        return 'none';
    } else if (selected === total) {
        return 'all';
    }
    return 'some';
}

export function isBulkSelectionDisabled(state) {
    return getRowsTotal(state) === 0 || getMaxRowSelection(state) === 0;
}

function getSelectBoxesColumnIndex(state) {
    const columns = getColumns(state) || [];
    let selectBoxColumnIndex = -1;

    columns.some((column, index) => {
        if (column.type === SELECTABLE_ROW_CHECKBOX) {
            selectBoxColumnIndex = index;
            return true;
        }

        return false;
    });

    return selectBoxColumnIndex;
}
