import { unwrap } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import {
    startPositioning,
    stopPositioning,
    Direction,
} from 'lightning/positionLibrary';
import {
    setFocusActiveCell,
    reactToTabLeft,
    reactToTabRight,
} from './keyboard';
import { updateRowsAndCellIndexes, getRowByKey, getKeyField } from './rows';
import {
    getColumnIndexByFieldName,
    getColumns,
    getStateColumnIndex,
} from './columns';
import { setErrors } from './errors';
import {
    markDeselectedCell,
    markSelectedCell,
    isSelectedRow,
    getCurrentSelectionLength,
    getSelectedRowsKeys,
} from './selector';

const VALID_EDITABLE_TYPE = {
    text: true,
    percent: true,
    phone: true,
    email: true,
    url: true,
    currency: true,
    number: true,
    boolean: true,
    'date-local': true,
    date: true,
};

const PANEL_SEL = '[data-iedit-panel="true"]';

function isEditableType(type) {
    return !!VALID_EDITABLE_TYPE[type];
}

export function getInlineEditDefaultState() {
    return {
        inlineEdit: {
            dirtyValues: {},
        },
    };
}

/**
 * @param {Object} state - Datatable instance.
 * @return {Array} - An array of objects, each object describing the dirty values in the form { colName : dirtyValue }.
 *                   A special key is the { [keyField]: value } pair used to identify the row containing this changed values.
 */
export function getDirtyValues(state) {
    return getChangesForCustomer(state, state.inlineEdit.dirtyValues);
}

/**
 * Sets the dirty values in the datatable.
 *
 * @param {Object} state Datatable state for the inline edit.
 * @param {Array} value An array of objects, each object describing the dirty values in the form { colName : dirtyValue }.
 *                      A special key is the { [keyField]: value } pair used to identify the row containing this changed values.
 */
export function setDirtyValues(state, value) {
    const keyField = getKeyField(state);
    const dirtyValues = Array.isArray(value) ? value : [];

    state.inlineEdit.dirtyValues = dirtyValues.reduce((result, rowValues) => {
        const changes = getRowChangesFromCustomer(state, rowValues);
        delete changes[keyField];

        result[rowValues[keyField]] = changes;

        return result;
    }, {});
}

export function normalizeEditable(column) {
    if (isEditableType(column.type)) {
        column.editable = normalizeBoolean(column.editable);
    } else {
        column.editable = false;
    }
}

export function hasEditableColumn(columns) {
    return columns.some(column => column.editable);
}

export function isInlineEditTriggered(state) {
    return Object.keys(state.inlineEdit.dirtyValues).length > 0;
}

export function cancelInlineEdit(dt) {
    dt.state.inlineEdit.dirtyValues = {};
    setErrors(dt.state, {});
    updateRowsAndCellIndexes.call(dt);
}

export function handleEditCell(event) {
    startPanelPositioning(this, event.target.parentElement);

    const inlineEdit = this.state.inlineEdit;

    if (inlineEdit.isPanelVisible) {
        // A special case when we are trying to open a edit but we have one open. (click on another edit while editing)
        // in this case we will need to process the values before re-open the edit panel with the new values or we may lose the edition.
        processInlineEditFinish(
            this,
            'loosed-focus',
            inlineEdit.rowKeyValue,
            inlineEdit.colKeyValue
        );
    }

    const { rowKeyValue, colKeyValue } = event.detail;

    inlineEdit.isPanelVisible = true;
    inlineEdit.rowKeyValue = rowKeyValue;
    inlineEdit.colKeyValue = colKeyValue;
    inlineEdit.editedValue = getCellValue(this.state, rowKeyValue, colKeyValue);
    inlineEdit.massEditSelectedRows = getCurrentSelectionLength(this.state);
    inlineEdit.massEditEnabled =
        isSelectedRow(this.state, rowKeyValue) &&
        inlineEdit.massEditSelectedRows > 1;

    // pass the column definition
    const colIndex = getStateColumnIndex(this.state, colKeyValue);
    inlineEdit.columnDef = getColumns(this.state)[colIndex];

    markSelectedCell(this.state, rowKeyValue, colKeyValue);

    // eslint-disable-next-line lwc/no-set-timeout
    setTimeout(() => {
        this.template
            .querySelector('lightning-primitive-datatable-iedit-panel')
            .focus();
    }, 0);
}

export function handleInlineEditFinish(event) {
    stopPanelPositioning(this);

    const { reason, rowKeyValue, colKeyValue } = event.detail;

    processInlineEditFinish(this, reason, rowKeyValue, colKeyValue);
}

export function handleMassCheckboxChange(event) {
    const state = this.state;
    if (event.detail.checked) {
        markAllSelectedRowsAsSelectedCell(state);
    } else {
        markAllSelectedRowsAsDeselectedCell(this.state);
        markSelectedCell(
            state,
            state.inlineEdit.rowKeyValue,
            state.inlineEdit.colKeyValue
        );
    }
}

// hide panel on scroll
const HIDE_PANEL_THRESHOLD = 5;
export function handleInlineEditPanelScroll(event) {
    const { isPanelVisible, rowKeyValue, colKeyValue } = this.state.inlineEdit;

    if (!isPanelVisible) {
        return;
    }

    let delta = 0;

    const container = unwrap(event).target;
    if (container.classList.contains('slds-scrollable_x')) {
        const scrollX = container.scrollLeft;
        if (this.privateLastScrollX == null) {
            this.privateLastScrollX = scrollX;
        } else {
            delta = Math.abs(this.privateLastScrollX - scrollX);
        }
    } else {
        const scrollY = container.scrollTop;
        if (this.privateLastScrollY == null) {
            this.privateLastScrollY = scrollY;
        } else {
            delta = Math.abs(this.privateLastScrollY - scrollY);
        }
    }

    if (delta > HIDE_PANEL_THRESHOLD) {
        this.privateLastScrollX = null;
        this.privateLastScrollY = null;
        stopPanelPositioning(this);
        processInlineEditFinish(this, 'loosed-focus', rowKeyValue, colKeyValue);
    } else {
        // we want to keep the panel attached to the cell before
        // reaching the threshold and hiding the panel
        repositionPanel(this);
    }
}

export function getDirtyValue(state, rowKeyValue, colKeyValue) {
    const dirtyValues = state.inlineEdit.dirtyValues;

    if (
        dirtyValues.hasOwnProperty(rowKeyValue) &&
        dirtyValues[rowKeyValue].hasOwnProperty(colKeyValue)
    ) {
        return dirtyValues[rowKeyValue][colKeyValue];
    }

    return undefined;
}

/**
 * Will update the dirty values specified in rowColKeyValues
 *
 * @param {Object} state - state of the datatable
 * @param {Object} rowColKeyValues - An object in the form of { rowKeyValue: { colKeyValue1: value, ..., colKeyValueN: value } ... }
 */
function updateDirtyValues(state, rowColKeyValues) {
    const dirtyValues = state.inlineEdit.dirtyValues;

    Object.keys(rowColKeyValues).forEach(rowKey => {
        if (!dirtyValues.hasOwnProperty(rowKey)) {
            dirtyValues[rowKey] = {};
        }

        Object.assign(dirtyValues[rowKey], rowColKeyValues[rowKey]);
    });
}

/**
 * Returns the current value of the cell, already takes into account the dirty value
 *
 * @param {Object} state - state of the datatable
 * @param {String} rowKeyValue - row key
 * @param {String} colKeyValue - column key
 *
 * @return {Object} the value for the current cell.
 */
function getCellValue(state, rowKeyValue, colKeyValue) {
    const row = getRowByKey(state, rowKeyValue);
    const colIndex = getStateColumnIndex(state, colKeyValue);

    return row.cells[colIndex].value;
}

/**
 *
 * @param {Object} state - Datatable state
 * @param {Object} changes - The internal representation of changes in a row
 * @returns {Object} - the list of customer changes in a row
 */
function getColumnsChangesForCustomer(state, changes) {
    return Object.keys(changes).reduce((result, colKey) => {
        const columns = getColumns(state);
        const columnIndex = getStateColumnIndex(state, colKey);

        result[columns[columnIndex].fieldName] = changes[colKey];

        return result;
    }, {});
}

function getRowChangesFromCustomer(state, changes) {
    return Object.keys(changes).reduce((result, fieldName) => {
        const columns = getColumns(state);
        const columnIndex = getColumnIndexByFieldName(state, fieldName);

        if (columnIndex >= 0) {
            const colKey = columns[columnIndex].colKeyValue;
            result[colKey] = changes[fieldName];
        }

        return result;
    }, {});
}

function getChangesForCustomer(state, changes) {
    const keyField = getKeyField(state);

    return Object.keys(changes).reduce((result, rowKey) => {
        const rowChanges = getColumnsChangesForCustomer(state, changes[rowKey]);

        if (Object.keys(rowChanges).length > 0) {
            rowChanges[keyField] = rowKey;

            result.push(rowChanges);
        }

        return result;
    }, []);
}

function dispatchCellChangeEvent(dtInstance, cellChange) {
    dtInstance.dispatchEvent(
        new CustomEvent('cellchange', {
            detail: {
                draftValues: getChangesForCustomer(
                    dtInstance.state,
                    cellChange
                ),
            },
        })
    );
}

export function closeInlineEdit(dt) {
    const inlineEditState = dt.state.inlineEdit;

    if (inlineEditState.isPanelVisible) {
        processInlineEditFinish(
            dt,
            'loosed-focus',
            inlineEditState.rowKeyValue,
            inlineEditState.colKeyValue
        );
    }
}

function isValidCell(state, rowKeyValue, colKeyValue) {
    const row = getRowByKey(state, rowKeyValue);
    const colIndex = getStateColumnIndex(state, colKeyValue);

    return row && row.cells[colIndex];
}

/**
 * It will process when the datatable had finished an edition.
 *
 * @param {Object} dt - the datatable instance
 * @param {string} reason - the reason to finish the edition. valid reasons are: edit-canceled | loosed-focus | tab-pressed | submit-action
 * @param {string} rowKeyValue - the row key of the edited cell
 * @param {string} colKeyValue - the column key of the edited cell
 */
function processInlineEditFinish(dt, reason, rowKeyValue, colKeyValue) {
    const state = dt.state;
    const inlineEditState = state.inlineEdit;

    const shouldSaveData =
        reason !== 'edit-canceled' &&
        !(inlineEditState.massEditEnabled && reason === 'loosed-focus') &&
        isValidCell(dt.state, rowKeyValue, colKeyValue);

    if (shouldSaveData) {
        const panel = dt.template.querySelector(PANEL_SEL);
        const editValue = panel.value;
        const isValidEditValue = panel.validity.valid;
        const updateAllSelectedRows = panel.isMassEditChecked;
        const currentValue = getCellValue(state, rowKeyValue, colKeyValue);

        if (
            isValidEditValue &&
            (editValue !== currentValue || updateAllSelectedRows)
        ) {
            const cellChange = {};
            cellChange[rowKeyValue] = {};
            cellChange[rowKeyValue][colKeyValue] = editValue;

            if (updateAllSelectedRows) {
                const selectedRowKeys = getSelectedRowsKeys(state);
                selectedRowKeys.forEach(rowKey => {
                    cellChange[rowKey] = {};
                    cellChange[rowKey][colKeyValue] = editValue;
                });
            }

            updateDirtyValues(state, cellChange);

            dispatchCellChangeEvent(dt, cellChange);

            // @todo: do we need to update all rows in the dt or just the one that was modified?
            updateRowsAndCellIndexes.call(dt);
        }
    }

    if (reason !== 'loosed-focus') {
        switch (reason) {
            case 'tab-pressed-next': {
                reactToTabRight(dt.template, state);
                break;
            }
            case 'tab-pressed-prev': {
                reactToTabLeft(dt.template, state);
                break;
            }
            default: {
                setFocusActiveCell(dt.template, state, 0);
            }
        }
    }

    markAllSelectedRowsAsDeselectedCell(state);
    markDeselectedCell(state, rowKeyValue, colKeyValue);

    inlineEditState.isPanelVisible = false;
}

function startPanelPositioning(dt, target) {
    requestAnimationFrame(() => {
        // we need to discard previous binding otherwise the panel
        // will retain previous alignment
        stopPanelPositioning(dt);

        dt.privatePositionRelationship = startPositioning(dt, {
            target,
            element: () => dt.template.querySelector(PANEL_SEL),
            align: {
                horizontal: Direction.Left,
                vertical: Direction.Top,
            },
            targetAlign: {
                horizontal: Direction.Left,
                vertical: Direction.Top,
            },
            autoFlip: true,
        });
    });
}

function stopPanelPositioning(dt) {
    if (dt.privatePositionRelationship) {
        stopPositioning(dt.privatePositionRelationship);
        dt.privatePositionRelationship = null;
    }
}

// reposition inline edit panel
// this does not realign the element, so it doesn't fix alignment
// when size of panel changes
function repositionPanel(dt) {
    requestAnimationFrame(() => {
        if (dt.privatePositionRelationship) {
            dt.privatePositionRelationship.reposition();
        }
    });
}

function markAllSelectedRowsAsSelectedCell(state) {
    const { colKeyValue } = state.inlineEdit;
    const selectedRowKeys = getSelectedRowsKeys(state);

    selectedRowKeys.forEach(rowKeyValue => {
        markSelectedCell(state, rowKeyValue, colKeyValue);
    });
}

function markAllSelectedRowsAsDeselectedCell(state) {
    const { colKeyValue } = state.inlineEdit;
    const selectedRowKeys = getSelectedRowsKeys(state);

    selectedRowKeys.forEach(rowKeyValue => {
        markDeselectedCell(state, rowKeyValue, colKeyValue);
    });
}
