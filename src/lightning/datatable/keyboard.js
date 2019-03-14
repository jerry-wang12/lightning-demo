import { isCustomerColumn } from './columns';
import { getRows } from './rows';
import { generateColKeyValue } from './keys';
import {
    hasTreeDataType,
    getStateTreeColumn,
    fireRowToggleEvent,
} from './tree';

export const ARROW_RIGHT = 39;
export const ARROW_LEFT = 37;
export const ARROW_DOWN = 40;
export const ARROW_UP = 38;
export const ENTER = 13;
export const ESCAPE = 27;
export const TAB = 9;
export const SPACE = 32;
export const NAVIGATION_DIR = {
    RIGHT: 1,
    LEFT: -1,
    USE_CURRENT: 0,
    RESET: 2,
};
const TOP_MARGIN = 80;
const BOTTOM_MARGIN = 80;
const SCROLL_OFFSET = 20;
const NAVIGATION_MODE = 'NAVIGATION';

export function getKeyboardDefaultState() {
    return {
        keyboardMode: NAVIGATION_MODE,
        rowMode: false,
        activeCell: undefined,
        tabindex: 0,
        cellToFocusNext: null,
        cellClicked: false,
    };
}

/**
 * It update the current activeCell in the state with the new rowKeyValue, colKeyValue
 * @param {object} state - datatable state
 * @param {string} rowKeyValue  - the unique row key value
 * @param {string} colKeyValue {string} - the unique col key value
 * @returns {object} state - mutated datatable state
 */
export const updateActiveCell = function(state, rowKeyValue, colKeyValue) {
    state.activeCell = {
        rowKeyValue,
        colKeyValue,
    };
    return state;
};

/**
 * It return if the pair rowKeyValue, colKeyValue are the current activeCell values
 * @param {object} state - datatable state
 * @param {string} rowKeyValue  - the unique row key value
 * @param {string} colKeyValue {string} - the unique col key value
 * @returns {boolean} - true if rowKeyValue, colKeyValue are the current activeCell values.
 */
export const isActiveCell = function(state, rowKeyValue, colKeyValue) {
    if (state.activeCell) {
        const {
            rowKeyValue: currentRowKeyValue,
            colKeyValue: currentColKeyValue,
        } = state.activeCell;
        return (
            currentRowKeyValue === rowKeyValue &&
            currentColKeyValue === colKeyValue
        );
    }
    return false;
};

/**
 * It check if in the current (data, columns) the activeCell still valid.
 * When data changed the activeCell could be removed, then we check if there is cellToFocusNext
 * which is calculated from previously focused cell, if so we sync to that
 * If active cell is still valid we keep it the same
 *
 * @param {object} state - datatable state
 * @returns {object} state - mutated datatable state
 */
export const syncActiveCell = function(state) {
    if (!state.activeCell || !stillValidActiveCell(state)) {
        if (state.activeCell && state.cellToFocusNext) {
            // there is previously focused cell
            setNextActiveCellFromPrev(state);
        } else {
            // there is no active cell or there is no previously focused cell
            setDefaultActiveCell(state);
        }
    }
    return state;
};

export const datatableHasFocus = function(state) {
    return state.tabindex === false || state.cellClicked;
};

/**
 * Sets the row and col index of cell to focus next if
 * there is state.activecell
 * datatable has focus
 * there is state.indexes
 * there is no  previously set state.cellToFocusNext
 * Indexes are calculated as to what to focus on next
 * @param {object} state - datatable state
 */
export const setCellToFocusFromPrev = function(state) {
    if (
        state.activeCell &&
        datatableHasFocus(state) &&
        state.indexes &&
        !state.cellToFocusNext
    ) {
        let { rowIndex, colIndex } = getIndexesActiveCell(state);
        colIndex = 0; // default point to the first column
        if (state.rows && rowIndex === state.rows.length - 1) {
            // if it is last row, make it point to its previous row
            rowIndex = state.rows.length - 1;
            colIndex = state.columns ? state.columns.length - 1 : 0;
        }
        state.cellToFocusNext = {
            rowIndex,
            colIndex,
        };
    }
};

/**
 * if the current new active still is valid ie exists then set the celltofocusnext to null
 * @param {object} state - datatable state
 */
export const updateCellToFocusFromPrev = function(state) {
    if (
        state.activeCell &&
        state.cellToFocusNext &&
        stillValidActiveCell(state)
    ) {
        // if the previous focused is there and valid,  dont set the prevActiveFocusedCell
        state.cellToFocusNext = null;
    }
};

/**
 * reset celltofocusnext to null (used after render)
 * @param {object} state - datatable state
 */
export const resetCellToFocusFromPrev = function(state) {
    state.cellToFocusNext = null;
};

/**
 * Sets the next active if there is a previously focused active cell
 * Logic is:
 * if the rowIndex is existing one - cell = (rowIndex, 0)
 * if the rowIndex is > the number of rows (focused was last row or more) = (lastRow, lastColumn)
 * for columns
 * same as above except if the colIndex is > the number of cols (means no data) = set it to null??
 * @param {object} state - datatable state
 */
function setNextActiveCellFromPrev(state) {
    const { rowIndex, colIndex } = state.cellToFocusNext;
    let nextRowIndex = rowIndex;
    let nextColIndex = colIndex;
    const rowsCount = state.rows ? state.rows.length : 0;
    const colsCount = state.columns.length ? state.columns.length : 0;

    if (nextRowIndex > rowsCount - 1) {
        // row index not existing after update to new 5 > 5-1, 6 > 5-1,
        nextRowIndex = rowsCount - 1;
    }
    if (nextColIndex > colsCount - 1) {
        // col index not existing after update to new
        nextColIndex = colsCount - 1;
    }
    const nextActiveCell = getCellFromIndexes(
        state,
        nextRowIndex,
        nextColIndex
    );
    if (nextActiveCell) {
        state.activeCell = nextActiveCell;
    } else {
        setDefaultActiveCell(state);
    }
    state.keyboardMode = 'NAVIGATION';
}

/**
 * It update the tabIndex value of a cell in the state for the rowIndex, colIndex passed
 * as consequence of this change
 * datatable is gonna re-render the cell affected with the new tabindex value
 *
 * @param {object} state - datatable state
 * @param {number} rowIndex - the row index
 * @param {number} colIndex - the column index
 * @param {number} [index = 0] - the value for the tabindex
 */
export const updateTabIndex = function(state, rowIndex, colIndex, index = 0) {
    if (isHeaderRow(rowIndex)) {
        const { columns } = state;
        columns[colIndex].tabIndex = index;
    } else {
        state.rows[rowIndex].cells[colIndex].tabIndex = index;
    }
};

/**
 * It updates the tabIndex value of a row in the state for the rowIndex passed
 * as consequence of this change
 * datatable is gonna re-render the row affected with the new tabindex value
 *
 * @param {object} state - datatable state
 * @param {number} rowIndex - the row index
 * @param {number} [index = 0] - the value for the tabindex
 */
export const updateTabIndexRow = function(state, rowIndex, index = 0) {
    if (!isHeaderRow(rowIndex)) {
        // TODO what to do when rowIndex is header row
        state.rows[rowIndex].tabIndex = index;
    }
};
/**
 * It update the tabindex for the current activeCell.
 * @param {object} state - datatable state
 * @param {number} [index = 0] - the value for the tabindex
 * @returns {object} state - mutated state
 */
export const updateTabIndexActiveCell = function(state, index = 0) {
    if (state.activeCell && !stillValidActiveCell(state)) {
        syncActiveCell(state);
    }

    // we need to check again because maybe there is no active cell after sync
    if (state.activeCell && !isRowNavigationMode(state)) {
        const { rowIndex, colIndex } = getIndexesActiveCell(state);
        updateTabIndex(state, rowIndex, colIndex, index);
    }
    return state;
};

/**
 * It updates the tabindex for the row of the current activeCell.
 * This happens in rowMode of NAVIGATION_MODE
 * @param {object} state - datatable state
 * @param {number} [index = 0] - the value for the tabindex
 * @returns {object} state - mutated state
 */
export const updateTabIndexActiveRow = function(state, index = 0) {
    if (state.activeCell && !stillValidActiveCell(state)) {
        syncActiveCell(state);
    }

    // we need to check again because maybe there is no active cell after sync
    if (state.activeCell && isRowNavigationMode(state)) {
        const { rowIndex } = getIndexesActiveCell(state);
        updateTabIndexRow(state, rowIndex, index);
    }
    return state;
};

/**
 * If new set of columns doesnt have tree data mark it to false, as it
 * could be true earlier
 * Else if it has tree data, check if rowMode is false
 * Earlier it didnt have tree data, set rowMode to true to start
 * if rowMode is false and earlier it has tree data, keep it false
 * if rowMode is true and it has tree data, keep it true
 * @param {boolean} hadTreeDataTypePreviously - state object
 * @param {object} state - state object
 * @returns {object} state - mutated state
 */
export function updateRowNavigationMode(hadTreeDataTypePreviously, state) {
    if (!hasTreeDataType(state)) {
        state.rowMode = false;
    } else if (state.rowMode === false && !hadTreeDataTypePreviously) {
        state.rowMode = true;
    }
    return state;
}

/**
 * It return the indexes { rowIndex, colIndex } of a cell based of the unique cell values
 * rowKeyValue, colKeyValue
 * @param {object} state - datatable state
 * @param {string} rowKeyValue - the row key value
 * @param {string} colKeyValue - the column key value
 * @returns {object} - {rowIndex, colIndex}
 */
export const getIndexesByKeys = function(state, rowKeyValue, colKeyValue) {
    if (rowKeyValue === 'HEADER') {
        return {
            rowIndex: -1,
            colIndex: state.headerIndexes[colKeyValue],
        };
    }

    return {
        rowIndex: state.indexes[rowKeyValue][colKeyValue][0],
        colIndex: state.indexes[rowKeyValue][colKeyValue][1],
    };
};

/**
 * It set the focus to the current activeCell, this operation imply multiple changes
 * - update the tabindex of the activeCell
 * - set the current keyboard mode
 * - set the focus to the cell
 * @param {node} element - the custom element template `this.template`
 * @param {object} state - datatable state
 * @param {int} direction - direction (-1 left, 1 right and 0 for no direction) its used to know which actionable element to activate.
 * @param {object} info - extra information when setting the cell mode.
 */
export const setFocusActiveCell = function(element, state, direction, info) {
    const { keyboardMode } = state;
    const { rowIndex, colIndex } = getIndexesActiveCell(state);

    updateTabIndex(state, rowIndex, colIndex);
    // eslint-disable-next-line lwc/no-set-timeout
    setTimeout(() => {
        const cellElement = getCellElementByIndexes(
            element,
            rowIndex,
            colIndex
        );
        if (cellElement) {
            if (direction) {
                cellElement.resetCurrentInputIndex(direction);
            }
            cellElement.addFocusStyles();
            cellElement.parentElement.classList.add('slds-has-focus');
            cellElement.parentElement.focus();
            cellElement.setMode(keyboardMode, info);

            const scrollingParent = element.querySelector(
                '.slds-table_header-fixed_container'
            );
            const scrollableY = element.querySelector('.slds-scrollable_y');
            const parentRect = scrollingParent.getBoundingClientRect();
            const findMeRect = cellElement.getBoundingClientRect();
            if (findMeRect.top < parentRect.top + TOP_MARGIN) {
                scrollableY.scrollTop -= SCROLL_OFFSET;
            } else if (findMeRect.bottom > parentRect.bottom - BOTTOM_MARGIN) {
                scrollableY.scrollTop += SCROLL_OFFSET;
            }
        }
    }, 0);
};

/**
 * It adds and the focus classes to the th/td.
 *
 * @param {node} element - the custom element template `this.template`
 * @param {object} state - datatable state
 */
export const addFocusStylesToActiveCell = function(element, state) {
    const { rowIndex, colIndex } = getIndexesActiveCell(state);

    const cellElement = getCellElementByIndexes(element, rowIndex, colIndex);

    if (cellElement) {
        cellElement.parentElement.classList.add('slds-has-focus');
    }
};

/**
 * It blur to the current activeCell, this operation imply multiple changes
 * - blur the activeCell
 * - update the tabindex to -1
 * @param {node} element - the custom element root `this.template`
 * @param {object} state - datatable state
 */
export const setBlurActiveCell = function(element, state) {
    if (state.activeCell) {
        const { rowIndex, colIndex } = getIndexesActiveCell(state);
        // eslint-disable-next-line lwc/no-set-timeout
        setTimeout(() => {
            const cellElement = getCellElementByIndexes(
                element,
                rowIndex,
                colIndex
            );
            // we need to check because of the tree,
            // at this point it may remove/change the rows/keys because opening or closing a row.
            if (cellElement) {
                if (document.activeElement === cellElement) {
                    cellElement.blur();
                }
                cellElement.removeFocusStyles(true);
                cellElement.parentElement.classList.remove('slds-has-focus');
            }
        }, 0);
        updateTabIndex(state, rowIndex, colIndex, -1);
    }
};
/**
 * It set the focus to the current activeCell, this operation imply multiple changes
 * - update the tabindex of the activeCell
 * - set the current keyboard mode
 * - set the focus to the cell
 * @param {node} element - the custom element root `this.template`
 * @param {object} state - datatable state
 */
export const setFocusActiveRow = function(element, state) {
    const { rowIndex } = getIndexesActiveCell(state);

    updateTabIndexRow(state, rowIndex);
    // eslint-disable-next-line lwc/no-set-timeout
    setTimeout(() => {
        const row = getRowElementByIndexes(element, rowIndex);
        row.focus();

        const scrollingParent = element.querySelector(
            '.slds-table_header-fixed_container'
        );
        const scrollableY = element.querySelector('.slds-scrollable_y');
        const parentRect = scrollingParent.getBoundingClientRect();
        const findMeRect = row.getBoundingClientRect();
        if (findMeRect.top < parentRect.top + TOP_MARGIN) {
            scrollableY.scrollTop -= SCROLL_OFFSET;
        } else if (findMeRect.bottom > parentRect.bottom - BOTTOM_MARGIN) {
            scrollableY.scrollTop += SCROLL_OFFSET;
        }
    }, 0);
};

/**
 * It blur the active Row, this operation imply multiple changes
 * - blur the active row
 * - update the tabindex to -1
 * @param {node} element - the custom element root `this.template`
 * @param {object} state - datatable state
 */
export const setBlurActiveRow = function(element, state) {
    if (state.activeCell) {
        const { rowIndex } = getIndexesActiveCell(state);
        // eslint-disable-next-line lwc/no-set-timeout
        setTimeout(() => {
            const row = getRowElementByIndexes(element, rowIndex);
            if (document.activeElement === row) {
                row.blur();
            }
        }, 0);
        updateTabIndexRow(state, rowIndex, -1);
    }
};
/**
 * It changes the datable state based on the keyboard event sent from the cell component,
 * the result of those change may trigger re-render on the table
 * @param {node} element - the custom element root `this.template`
 * @param {object} state - datatable state
 * @param {event} event - custom DOM event sent by the cell
 * @returns {object} - mutated state
 */
export const reactToKeyboard = function(element, state, event) {
    switch (event.detail.keyCode) {
        case ARROW_RIGHT:
            return reactToArrowRight(element, state, event);
        case ARROW_LEFT:
            return reactToArrowLeft(element, state, event);
        case ARROW_DOWN:
            return reactToArrowDown(element, state, event);
        case ARROW_UP:
            return reactToArrowUp(element, state, event);
        case ENTER:
        case SPACE:
            return reactToEnter(element, state, event);
        case ESCAPE:
            return reactToEscape(element, state, event);
        case TAB:
            return reactToTab(element, state, event);
        default:
            return state;
    }
};

function reactToKeyboardInNavMode(element, state, event) {
    const mockEvent = {
        detail: {
            rowKeyValue: state.activeCell.rowKeyValue,
            colKeyValue: state.activeCell.colKeyValue,
            keyCode: event.keyCode,
            shiftKey: event.shiftKey,
        },
        preventDefault: () => {},
        stopPropagation: () => {},
    };

    switch (event.keyCode) {
        case ARROW_RIGHT:
            event.preventDefault();
            return reactToArrowRight(element, state, mockEvent);
        case ARROW_LEFT:
            event.preventDefault();
            return reactToArrowLeft(element, state, mockEvent);
        case ARROW_DOWN:
            event.preventDefault();
            return reactToArrowDown(element, state, mockEvent);
        case ARROW_UP:
            event.preventDefault();
            return reactToArrowUp(element, state, mockEvent);
        case ENTER:
        case SPACE:
            event.preventDefault();
            return reactToEnter(element, state, mockEvent);
        case ESCAPE:
            // do nothing since this only handles navigation mode.
            return state;
        case TAB:
            // event.preventDefault();
            return reactToTab(element, state, mockEvent);
        default:
            return state;
    }
}

export const reactToKeyboardOnRow = function(dt, state, event) {
    if (
        isRowNavigationMode(state) &&
        event.target.localName.indexOf('tr') !== -1
    ) {
        const element = dt.template;
        switch (event.detail.keyCode) {
            case ARROW_RIGHT:
                return reactToArrowRightOnRow.call(dt, element, state, event);
            case ARROW_LEFT:
                return reactToArrowLeftOnRow.call(dt, element, state, event);
            case ARROW_DOWN:
                return reactToArrowDownOnRow.call(dt, element, state, event);
            case ARROW_UP:
                return reactToArrowUpOnRow.call(dt, element, state, event);
            default:
                return state;
        }
    }
    return state;
};

function isRowNavigationMode(state) {
    return state.keyboardMode === 'NAVIGATION' && state.rowMode === true;
}

export function setRowNavigationMode(state) {
    if (hasTreeDataType(state) && state.keyboardMode === 'NAVIGATION') {
        state.rowMode = true;
    }
}

export function unsetRowNavigationMode(state) {
    state.rowMode = false;
}

export function canBeRowNavigationMode(state) {
    return hasTreeDataType(state) && state.keyboardMode === 'NAVIGATION';
}

function isHeaderRow(rowIndex) {
    return rowIndex === -1;
}

function getCellElementByIndexes(element, rowIndex, colIndex) {
    if (isHeaderRow(rowIndex)) {
        const rowElement = element.querySelector(`thead > tr:nth-child(1)`);
        return (
            rowElement &&
            rowElement.querySelector(
                `th:nth-child(${colIndex + 1}) :first-child`
            )
        );
    }

    return element.querySelector(
        `tbody > tr:nth-child(${rowIndex + 1}) > *:nth-child(${colIndex +
            1}) > :first-child`
    );
}

function getRowElementByIndexes(element, rowIndex) {
    if (isHeaderRow(rowIndex)) {
        return element.querySelector(`thead > tr:nth-child(1)`);
    }
    return element.querySelector(`tbody > tr:nth-child(${rowIndex + 1})`);
}

function reactToEnter(element, state, event) {
    if (state.keyboardMode === 'NAVIGATION') {
        state.keyboardMode = 'ACTION';
        const { rowIndex, colIndex } = getIndexesActiveCell(state);

        const actionsMap = {};
        actionsMap[SPACE] = 'space';
        actionsMap[ENTER] = 'enter';

        if (event.detail.keyEvent) {
            event.detail.keyEvent.preventDefault();
        }
        setModeActiveCell(element, state, {
            action: actionsMap[event.detail.keyCode],
        });
        updateTabIndex(state, rowIndex, colIndex, -1);
    }
}

function reactToEscape(element, state, event) {
    if (state.keyboardMode === 'ACTION') {
        // When the table is in action mode this event shouldn't bubble
        // because if the table in inside a modal it should prevent the model closes
        event.detail.keyEvent.stopPropagation();
        state.keyboardMode = 'NAVIGATION';
        setModeActiveCell(element, state);
        setFocusActiveCell(element, state, NAVIGATION_DIR.RESET);
    }
}

/**
 * Retrieve the next tab index values for row & column
 * @param {object} state - datatable state
 * @param {string} direction - 'RIGHT' or 'LEFT'
 * @returns {object} - nextRowIndex, nextColIndex values, isExitCell boolean
 */
function getNextTabIndex(state, direction) {
    const { rowIndex, colIndex } = getIndexesActiveCell(state);

    // decide which function to use based on the value of direction
    const nextTabFunc = {
        RIGHT: getNextTabIndexRight,
        LEFT: getNextTabIndexLeft,
    };

    return nextTabFunc[direction](state, rowIndex, colIndex);
}

/**
 * Check if we're in an escape/exit cell (first or last of grid)
 * @param {object} state - datatable state
 * @param {string} direction - 'RIGHT' or 'LEFT'
 * @returns {boolean} - if the current cell is or isn't an exit cell
 */
export function isActiveCellAnExitCell(state, direction) {
    // get next tab index values
    const { rowIndex, colIndex } = getIndexesActiveCell(state);
    const { nextRowIndex, nextColIndex } = getNextTabIndex(state, direction);
    // is it an exit cell?
    if (
        // if first cell and moving left
        (rowIndex === -1 &&
            colIndex === 0 &&
            nextRowIndex !== -1 &&
            nextColIndex !== 0) ||
        // or if last cell and moving right
        (rowIndex !== -1 && nextRowIndex === -1 && nextColIndex === 0)
    ) {
        return true;
    }

    return false;
}

function reactToTab(element, state, event) {
    event.preventDefault();
    event.stopPropagation();

    const { shiftKey } = event.detail;
    const direction = shiftKey ? 'LEFT' : 'RIGHT';
    const isExitCell = isActiveCellAnExitCell(state, direction);

    // if in ACTION mode
    if (state.keyboardMode === 'ACTION') {
        // if not on last or first cell, tab through each cell of the grid
        if (isExitCell === false) {
            // prevent default key event in action mode when actually moving within the grid
            if (event.detail.keyEvent) {
                event.detail.keyEvent.preventDefault();
            }
            // tab in proper direction based on shift key press
            if (shiftKey) {
                reactToTabLeft(element, state);
            } else {
                reactToTabRight(element, state);
            }
        } else {
            // exit ACTION mode
            state.keyboardMode = 'NAVIGATION';
            setModeActiveCell(element, state);
        }
    }
}

function setModeActiveCell(element, state, info) {
    const cellElement = getActiveCellElement(element, state);
    cellElement.setMode(state.keyboardMode, info);
}

function getActiveCellElement(element, state) {
    const { rowIndex, colIndex } = getIndexesActiveCell(state);
    return getCellElementByIndexes(element, rowIndex, colIndex);
}

export function getIndexesActiveCell(state) {
    const { activeCell: { rowKeyValue, colKeyValue } } = state;
    return getIndexesByKeys(state, rowKeyValue, colKeyValue);
}

function reactToArrowRight(element, state, event) {
    const { rowKeyValue, colKeyValue } = event.detail;
    const { colIndex } = getIndexesByKeys(state, rowKeyValue, colKeyValue);
    const nextColIndex = getNextIndexRight(state, colIndex);
    const { columns } = state;

    if (nextColIndex === undefined) {
        return;
    }

    setBlurActiveCell(element, state);
    // update activeCell
    state.activeCell = {
        rowKeyValue,
        colKeyValue: generateColKeyValue(columns[nextColIndex], nextColIndex),
    };
    setFocusActiveCell(element, state, NAVIGATION_DIR.RIGHT);
}

function reactToArrowLeft(element, state, event) {
    const { rowKeyValue, colKeyValue } = event.detail;
    const { colIndex } = getIndexesByKeys(state, rowKeyValue, colKeyValue);
    if (colIndex === 0 && canBeRowNavigationMode(state)) {
        moveFromCellToRow(element, state);
    } else {
        const nextColIndex = getNextIndexLeft(state, colIndex);

        if (nextColIndex === undefined) {
            return;
        }

        const { columns } = state;
        setBlurActiveCell(element, state);
        // update activeCell
        state.activeCell = {
            rowKeyValue,
            colKeyValue: generateColKeyValue(
                columns[nextColIndex],
                nextColIndex
            ),
        };
        setFocusActiveCell(element, state, NAVIGATION_DIR.LEFT);
    }
}

function reactToArrowRightOnRow(element, state, event) {
    const { rowKeyValue, rowHasChildren, rowExpanded } = event.detail;
    // check if row needs to be expanded
    // expand row if has children and is collapsed
    // otherwise make this.state.rowMode = false
    // move tabindex 0 to first cell in the row and focus there
    if (rowHasChildren && !rowExpanded) {
        fireRowToggleEvent.call(this, rowKeyValue, rowExpanded);
    } else {
        moveFromRowToCell(element, state);
    }
}

function reactToArrowLeftOnRow(element, state, event) {
    const { rowKeyValue, rowHasChildren, rowExpanded, rowLevel } = event.detail;
    // check if row needs to be collapsed
    // if not go to parent and focus there
    if (rowHasChildren && rowExpanded) {
        fireRowToggleEvent.call(this, rowKeyValue, rowExpanded);
    } else if (rowLevel > 1) {
        const treeColumn = getStateTreeColumn(state);
        if (treeColumn) {
            const colKeyValue = treeColumn.colKeyValue;
            const { rowIndex } = getIndexesByKeys(
                state,
                rowKeyValue,
                colKeyValue
            );
            const parentIndex = getRowParent(state, rowLevel, rowIndex);
            if (parentIndex !== -1) {
                const rows = getRows(state);
                setBlurActiveRow(element, state);
                // update activeCell for the row
                state.activeCell = {
                    rowKeyValue: rows[parentIndex].key,
                    colKeyValue,
                };
                setFocusActiveRow(element, state);
            }
        }
    }
}

function reactToArrowDownOnRow(element, state, event) {
    // move tabindex 0 one row down
    const { rowKeyValue } = event.detail;
    const treeColumn = getStateTreeColumn(state);

    event.detail.keyEvent.stopPropagation();
    event.detail.keyEvent.preventDefault();

    if (treeColumn) {
        const colKeyValue = treeColumn.colKeyValue;
        const { rowIndex } = getIndexesByKeys(state, rowKeyValue, colKeyValue);
        const nextRowIndex = getNextIndexDownWrapped(state, rowIndex);
        const { rows } = state;
        if (nextRowIndex !== -1) {
            setBlurActiveRow(element, state);
            // update activeCell for the row
            state.activeCell = {
                rowKeyValue: rows[nextRowIndex].key,
                colKeyValue,
            };
            setFocusActiveRow(element, state);
        }
    }
}

function reactToArrowUpOnRow(element, state, event) {
    // move tabindex 0 one row down
    // move tabindex 0 one row down
    const { rowKeyValue } = event.detail;
    const treeColumn = getStateTreeColumn(state);

    event.detail.keyEvent.stopPropagation();
    event.detail.keyEvent.preventDefault();

    if (treeColumn) {
        const colKeyValue = treeColumn.colKeyValue;
        const { rowIndex } = getIndexesByKeys(state, rowKeyValue, colKeyValue);
        const prevRowIndex = getNextIndexUpWrapped(state, rowIndex);
        const { rows } = state;
        if (prevRowIndex !== -1) {
            setBlurActiveRow(element, state);
            // update activeCell for the row
            state.activeCell = {
                rowKeyValue: rows[prevRowIndex].key,
                colKeyValue,
            };
            setFocusActiveRow(element, state);
        }
    }
}

function moveFromCellToRow(element, state) {
    setBlurActiveCell(element, state);
    setRowNavigationMode(state);
    setFocusActiveRow(element, state);
}

function moveFromRowToCell(element, state) {
    setBlurActiveRow(element, state);
    unsetRowNavigationMode(state);
    setFocusActiveCell(element, state, NAVIGATION_DIR.USE_CURRENT);
}

export function reactToTabRight(element, state) {
    const { nextRowIndex, nextColIndex } = getNextTabIndex(state, 'RIGHT');
    const { columns, rows } = state;

    setBlurActiveCell(element, state);

    // update activeCell
    state.activeCell = {
        rowKeyValue: nextRowIndex !== -1 ? rows[nextRowIndex].key : 'HEADER',
        colKeyValue: generateColKeyValue(columns[nextColIndex], nextColIndex),
    };
    setFocusActiveCell(element, state, NAVIGATION_DIR.RIGHT, { action: 'tab' });
}

export function reactToTabLeft(element, state) {
    const { nextRowIndex, nextColIndex } = getNextTabIndex(state, 'LEFT');
    const { columns, rows } = state;

    setBlurActiveCell(element, state);

    // update activeCell
    state.activeCell = {
        rowKeyValue: nextRowIndex !== -1 ? rows[nextRowIndex].key : 'HEADER',
        colKeyValue: generateColKeyValue(columns[nextColIndex], nextColIndex),
    };
    setFocusActiveCell(element, state, NAVIGATION_DIR.LEFT, { action: 'tab' });
}

function reactToArrowDown(element, state, event) {
    const { rowKeyValue, colKeyValue } = event.detail;
    const { rowIndex } = getIndexesByKeys(state, rowKeyValue, colKeyValue);
    const nextRowIndex = getNextIndexDown(state, rowIndex);
    const { rows } = state;

    if (nextRowIndex === undefined) {
        return;
    }

    if (state.hideTableHeader && nextRowIndex === -1) {
        return;
    }

    if (event.detail.keyEvent) {
        event.detail.keyEvent.stopPropagation();
    }

    setBlurActiveCell(element, state);
    // update activeCell
    state.activeCell = {
        rowKeyValue: nextRowIndex !== -1 ? rows[nextRowIndex].key : 'HEADER',
        colKeyValue,
    };
    setFocusActiveCell(element, state, NAVIGATION_DIR.USE_CURRENT);
}

function reactToArrowUp(element, state, event) {
    const { rowKeyValue, colKeyValue } = event.detail;
    const { rowIndex } = getIndexesByKeys(state, rowKeyValue, colKeyValue);
    const nextRowIndex = getNextIndexUp(state, rowIndex);
    const { rows } = state;

    if (nextRowIndex === undefined) {
        return;
    }

    if (state.hideTableHeader && nextRowIndex === -1) {
        return;
    }

    if (event.detail.keyEvent) {
        event.detail.keyEvent.stopPropagation();
    }

    setBlurActiveCell(element, state);
    // update activeCell
    state.activeCell = {
        rowKeyValue: nextRowIndex !== -1 ? rows[nextRowIndex].key : 'HEADER',
        colKeyValue,
    };
    setFocusActiveCell(element, state, NAVIGATION_DIR.USE_CURRENT);
}

function getNextIndexUp(state, rowIndex) {
    return rowIndex === -1 ? undefined : rowIndex - 1;
}

function getNextIndexDown(state, rowIndex) {
    const rowsCount = state.rows.length;
    return rowIndex + 1 < rowsCount ? rowIndex + 1 : undefined;
}

function getNextIndexRight(state, colIndex) {
    const columnsCount = state.columns.length;
    return columnsCount > colIndex + 1 ? colIndex + 1 : undefined;
}

function getNextIndexLeft(state, colIndex) {
    return colIndex > 0 ? colIndex - 1 : undefined;
}

function getNextIndexUpWrapped(state, rowIndex) {
    const rowsCount = state.rows.length;
    return rowIndex === 0 ? -1 : rowIndex === -1 ? rowsCount - 1 : rowIndex - 1;
}

function getNextIndexDownWrapped(state, rowIndex) {
    const rowsCount = state.rows.length;
    return rowIndex + 1 < rowsCount ? rowIndex + 1 : -1;
}

function getNextTabIndexRight(state, rowIndex, colIndex) {
    const columnsCount = state.columns.length;
    if (columnsCount > colIndex + 1) {
        return {
            nextRowIndex: rowIndex,
            nextColIndex: colIndex + 1,
        };
    }
    return {
        nextRowIndex: getNextIndexDownWrapped(state, rowIndex),
        nextColIndex: 0,
    };
}

function getNextTabIndexLeft(state, rowIndex, colIndex) {
    const columnsCount = state.columns.length;
    if (colIndex > 0) {
        return {
            nextRowIndex: rowIndex,
            nextColIndex: colIndex - 1,
        };
    }
    return {
        nextRowIndex: getNextIndexUpWrapped(state, rowIndex),
        nextColIndex: columnsCount - 1,
    };
}

export function getRowParent(state, rowLevel, rowIndex) {
    const parentIndex = rowIndex - 1;
    const rows = getRows(state);
    for (let i = parentIndex; i >= 0; i--) {
        if (rows[i].level === rowLevel - 1) {
            return i;
        }
    }
    return -1;
}

function stillValidActiveCell(state) {
    const { activeCell: { rowKeyValue, colKeyValue } } = state;
    if (rowKeyValue === 'HEADER') {
        return !!state.headerIndexes[colKeyValue];
    }
    return !!(
        state.indexes[rowKeyValue] && state.indexes[rowKeyValue][colKeyValue]
    );
}

function setDefaultActiveCell(state) {
    state.activeCell = getDefaultActiveCell(state);
}

function getDefaultActiveCell(state) {
    const { columns, rows } = state;
    if (columns.length > 0) {
        let colIndex;
        const existCustomerColumn = columns.some((column, index) => {
            colIndex = index;
            return isCustomerColumn(column);
        });

        if (!existCustomerColumn) {
            colIndex = 0;
        }

        return {
            rowKeyValue: rows.length > 0 ? rows[0].key : 'HEADER',
            colKeyValue: generateColKeyValue(columns[colIndex], colIndex),
        };
    }

    return undefined;
}

function getCellFromIndexes(state, rowIndex, colIndex) {
    const { columns, rows } = state;
    if (columns.length > 0) {
        return {
            rowKeyValue: rowIndex === -1 ? 'HEADER' : rows[rowIndex].key,
            colKeyValue: generateColKeyValue(columns[colIndex], colIndex),
        };
    }
    return undefined;
}

export function handleCellKeydown(event) {
    event.stopPropagation();
    reactToKeyboard(this.template, this.state, event);
}

export function handleKeyDown(event) {
    const targetTagName = event.target.tagName.toLowerCase();
    // when the event came from the td is cause it has the focus.
    if (targetTagName === 'td' || targetTagName === 'th') {
        reactToKeyboardInNavMode(this.template, this.state, event);
    }
}

/**
 * This is needed to check if datatable has lost focus but cell has been clicked recently
 * @param {object} state - datatable state
 */
export const setCellClickedForFocus = function(state) {
    state.cellClicked = true;
};

/**
 * Once the dt regains focus there is no need to set this
 *  @param {object} state - datatable state
 */
export const resetCellClickedForFocus = function(state) {
    state.cellClicked = false;
};

export const handleDatatableLosedFocus = function(event) {
    if (
        !event.relatedTarget ||
        !event.currentTarget.contains(event.relatedTarget)
    ) {
        const { state } = this;

        if (state.activeCell) {
            if (state.rowMode) {
                const { rowIndex } = getIndexesActiveCell(state);
                updateTabIndexRow(state, rowIndex, -1);
            } else {
                const { rowIndex, colIndex } = getIndexesActiveCell(state);
                const cellElement = getCellElementByIndexes(
                    this.template,
                    rowIndex,
                    colIndex
                );
                // we need to check because of the tree,
                // at this point it may remove/change the rows/keys because opening or closing a row.
                if (cellElement) {
                    cellElement.removeFocusStyles();
                    cellElement.parentElement.classList.remove(
                        'slds-has-focus'
                    );
                    cellElement.tabindex = -1;
                }
            }
        }
        state.tabindex = 0;
    }
};

export const handleDatatableFocusIn = function() {
    const { state } = this;

    if (!datatableHasFocus(state)) {
        if (!state.rowMode && state.activeCell) {
            const { rowIndex, colIndex } = getIndexesActiveCell(state);
            const cellElement = getCellElementByIndexes(
                this.template,
                rowIndex,
                colIndex
            );
            // we need to check because of the tree,
            // at this point it may remove/change the rows/keys because opening or closing a row.
            if (cellElement) {
                cellElement.addFocusStyles();
                cellElement.parentElement.classList.add('slds-has-focus');
                cellElement.tabindex = 0;
            }
        }
        state.tabindex = false;
        resetCellClickedForFocus(state);
    }
};
