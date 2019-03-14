import { normalizeBoolean } from 'lightning/utilsPrivate';
import { getColumns, isCustomerColumn } from './columns';
import { clamp, normalizePositiveIntegerAttribute } from './utils';

/**
 * It return the default portion of state use it for the resizer
 * @returns {{resizer: {columnWidths: Array}}} - resizer default state
 */
export function getResizerDefaultState() {
    return {
        resizeColumnDisabled: false,
        resizeStep: 10,
        columnWidths: [],
        tableWidth: 0,
        minColumnWidth: 50,
        maxColumnWidth: 1000,
    };
}

// *******************************
// states Getters/Setters
// *******************************

/**
 * resizeColumnDisabled
 */

export function isResizeColumnDisabled(state) {
    return state.resizeColumnDisabled;
}
export function setResizeColumnDisabled(state, value) {
    state.resizeColumnDisabled = normalizeBoolean(value);
}

/**
 * resizeStep
 */

export function setResizeStep(state, value) {
    state.resizeStep = normalizePositiveIntegerAttribute(
        'resizeStep',
        value,
        getResizerDefaultState().resizeStep
    );
}
export function getResizeStep(state) {
    return state.resizeStep;
}

/**
 * columnWidths
 */

/**
 * It return true if there are widths store in the state
 * @param {object} state - table state
 * @returns {boolean} - true if there are widths store in the state
 */
export function hasDefinedColumnsWidths(state) {
    return state.columnWidths.length > 0;
}
/**
 * It return the columnsWidths saved in the state
 * @param {object} state - table state
 * @returns {Array|*} - list of column widths
 */
export function getColumnsWidths(state) {
    return state.columnWidths;
}
/**
 * It set columnWidths to empty array
 * @param {object} state - table state
 */
export function resetColumnWidths(state) {
    state.columnWidths = [];
}

/**
 * tableWidth
 */

/**
 * Get the full width of table
 * @param {object} state - table state
 * @returns {number} - table's width
 */
function getTableWidth(state) {
    return state.tableWidth;
}
function setTableWidth(state, tableWidth) {
    state.tableWidth = tableWidth;
}

/**
 * minColumnWidth
 */

export function setMinColumnWidth(state, value) {
    state.minColumnWidth = normalizePositiveIntegerAttribute(
        'minColumnWidth',
        value,
        getResizerDefaultState().minColumnWidth
    );

    updateColumnWidthsMetadata(state);
}
export function getMinColumnWidth(state) {
    return state.minColumnWidth;
}

/**
 * maxColumnWidth
 */

export function getMaxColumnWidth(state) {
    return state.maxColumnWidth;
}
export function setMaxColumnWidth(state, value) {
    state.maxColumnWidth = normalizePositiveIntegerAttribute(
        'maxColumnWidth',
        value,
        getResizerDefaultState().maxColumnWidth
    );

    updateColumnWidthsMetadata(state);
}

// *******************************
// Logics
// *******************************

/**
 * Get the style to match the full width of table
 * @param {object} state - table state
 * @returns {string} - style string
 */
export function getTableWidthStyle(state) {
    return getWidthStyle(getTableWidth(state));
}

/**
 * - It adjust the columns in the DOM, based on the table width and width meta in column definitions
 * - It also update the table and scroller container with the expected width
 *
 * @param {node} root - table root element
 * @param {object} state - table state
 */
export const adjustColumnsSize = function(root, state) {
    const widthsMeta = getTotalWidthsMetadata(state);
    const expectedTableWidth = getExpectedTableWidth(state, root, widthsMeta);

    const expectedFlexibleColumnWidth = getFlexibleColumnWidth(
        widthsMeta,
        expectedTableWidth
    );

    let columnsWidthSum = 0;
    resetColumnWidths(state);
    getColumns(state).forEach((column, colIndex) => {
        const width =
            getColumnWidthFromDef(column) || expectedFlexibleColumnWidth;
        columnsWidthSum += width;
        updateColumnWidth(state, colIndex, width);
    });

    setTableWidth(state, Math.min(expectedTableWidth, columnsWidthSum));
};

function getColumnWidthFromDef(column) {
    let resizedWidth;
    if (column.isResized) {
        resizedWidth = column.columnWidth;
    }
    return column.fixedWidth || resizedWidth || column.initialWidth;
}

/**
 * It resize a column width
 * @param {object} state - table state
 * @param {number} colIndex - the index of the column based on state.columns
 * @param {number} width - the new width is gonna be applied
 */
export const resizeColumn = function(state, colIndex, width) {
    const column = getColumns(state)[colIndex];
    const columnsWidths = getColumnsWidths(state);
    const currentWidth = columnsWidths[colIndex];
    const { minWidth, maxWidth } = column;

    const newWidth = clamp(width, minWidth, maxWidth);
    if (currentWidth !== newWidth) {
        const newDelta = newWidth - currentWidth;
        setTableWidth(state, getTableWidth(state) + newDelta);
        updateColumnWidth(state, colIndex, newWidth);
        column.isResized = true;
    }
};

/**
 * It resize a column width
 * @param {object} state - table state
 * @param {number} colIndex - the index of the column based on state.columns
 * @param {number} widthDelta - the delta that creates the new width
 */
export const resizeColumnWithDelta = function(state, colIndex, widthDelta) {
    const currentWidth = getColumnsWidths(state)[colIndex];
    resizeColumn(state, colIndex, currentWidth + widthDelta);
};

function updateColumnWidth(state, colIndex, newWidth) {
    const columnsWidths = getColumnsWidths(state);
    columnsWidths[colIndex] = newWidth;

    const column = getColumns(state)[colIndex];
    column.columnWidth = newWidth;
    column.style = getWidthStyle(newWidth);
}

function getExpectedTableWidth(state, root, widthsMeta) {
    const availableWidth = getAvailableWidthFromDom(root);
    const minExpectedTableWidth = getMinExpectedTableWidth(widthsMeta);
    return hasNoFlexibleColumns(widthsMeta)
        ? minExpectedTableWidth
        : Math.max(minExpectedTableWidth, availableWidth);
}

/**
 * It return the current widths for customer columns
 * @param {object} state - table state
 * @returns {Array} - the widths collection, every element
 * belong to a column with the same index in column prop
 */
export function getCustomerColumnWidths(state) {
    const columns = getColumns(state);
    return columns.reduce((prev, column, index) => {
        if (isCustomerColumn(column)) {
            prev.push(state.columnWidths[index]);
        }
        return prev;
    }, []);
}

export function updateColumnWidthsMetadata(state) {
    getColumns(state).forEach(col => {
        if (!col.internal) {
            col.minWidth = getMinColumnWidth(state);
            col.maxWidth = getMaxColumnWidth(state);
        }

        if (col.initialWidth) {
            col.initialWidth = clamp(
                col.initialWidth,
                col.minWidth,
                col.maxWidth
            );
        }
    });
}

function getTotalWidthsMetadata(state) {
    const initial = {
        totalFixedWidth: 0,
        totalFixedColumns: 0,
        totalResizedWidth: 0,
        totalResizedColumns: 0,
        totalFlexibleColumns: 0,
        minColumnWidth: state.minColumnWidth,
        maxColumnWidth: state.maxColumnWidth,
    };

    return getColumns(state).reduce((prev, col) => {
        if (col.fixedWidth) {
            prev.totalFixedWidth += col.fixedWidth;
            prev.totalFixedColumns += 1;
        } else if (col.isResized) {
            prev.totalResizedWidth += col.columnWidth;
            prev.totalResizedColumns += 1;
        } else if (col.initialWidth) {
            prev.totalResizedWidth += col.initialWidth;
            prev.totalResizedColumns += 1;
        } else {
            prev.totalFlexibleColumns += 1;
        }
        return prev;
    }, initial);
}

function getMinExpectedTableWidth(widthsMeta) {
    const {
        totalFixedWidth,
        totalResizedWidth,
        totalFlexibleColumns,
        minColumnWidth,
    } = widthsMeta;
    const minTotalFlexibleWidth = totalFlexibleColumns * minColumnWidth;
    return minTotalFlexibleWidth + totalFixedWidth + totalResizedWidth;
}

function getFlexibleColumnWidth(widthsMeta, totalTableWidth) {
    const {
        totalFixedWidth,
        totalResizedWidth,
        totalFlexibleColumns,
        minColumnWidth,
        maxColumnWidth,
    } = widthsMeta;
    const totalFlexibleWidth =
        totalTableWidth - totalFixedWidth - totalResizedWidth;
    const avgFlexibleColumnWidth = Math.floor(
        totalFlexibleWidth / totalFlexibleColumns
    );
    const allowedSpace = Math.max(avgFlexibleColumnWidth, minColumnWidth);
    return Math.min(maxColumnWidth, allowedSpace);
}

function hasNoFlexibleColumns(widthsMeta) {
    return widthsMeta.totalFlexibleColumns === 0;
}

/**
 * Get width of dom element.
 * @param  {node} element - target dom element
 * @returns {number} - integer width of element
 */
function getDomWidth(element) {
    return element.offsetWidth;
}

const CONTAINER_SEL = '.slds-scrollable_x';
function getAvailableWidthFromDom(root) {
    return getDomWidth(root.querySelector(CONTAINER_SEL));
}

function getWidthStyle(pixels) {
    return pixels > 0 ? `width:${pixels}px` : '';
}
