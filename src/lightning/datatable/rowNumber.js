import { normalizeBoolean } from 'lightning/utilsPrivate';
import { hasColumns, getColumns } from './columns';
import { hasDefinedColumnsWidths, adjustColumnsSize } from './resizer';
import { normalizePositiveIntegerAttribute } from './utils';
import labelRowLevelErrorAssistiveText from '@salesforce/label/LightningDatatable.rowLevelErrorAssistiveText';

const CHAR_WIDTH = 10;
const COLUMN_TYPE = 'rowNumber';
const i18n = {
    rowLevelErrorAssistiveText: labelRowLevelErrorAssistiveText,
};

export function isRowNumberColumn(column) {
    return column.type === COLUMN_TYPE;
}

export function getRowNumberColumnDef() {
    return {
        type: COLUMN_TYPE,
        sortable: false,
        initialWidth: 52,
        minWidth: 52,
        maxWidth: 1000,
        tabIndex: -1,
        internal: true,
        resizable: false,
    };
}

export function getRowNumberState() {
    return {
        showRowNumberColumn: false,
        rowNumberOffset: 0,
    };
}

/**
 * showRowNumberColumn
 */

export function hasRowNumberColumn(state) {
    return state.showRowNumberColumn;
}
export function setShowRowNumberColumn(state, value) {
    state.showRowNumberColumn = normalizeBoolean(value);
}

/**
 * rowNumberOffset
 */

export function getRowNumberOffset(state) {
    return state.rowNumberOffset;
}
export function setRowNumberOffset(state, value) {
    state.rowNumberOffset = normalizePositiveIntegerAttribute(
        'rowNumberOffset',
        value,
        getRowNumberState().rowNumberOffset
    );
}

/**
 * Functions to adjusting row number column width
 */

export function adjustRowNumberColumnWidth(root, state) {
    const colIndex = getRowNumberColumnIndex(state);
    if (colIndex > -1) {
        const rowNumberCol = getColumns(state)[colIndex];
        const newWidth = getAdjustedRowNumberColumnWidth(state);
        if (rowNumberCol.initialWidth !== newWidth) {
            rowNumberCol.initialWidth = Math.max(
                newWidth,
                rowNumberCol.minWidth
            );
            if (hasDefinedColumnsWidths(state)) {
                // when columns are resized with the resizer, a horizontal scroller appears.
                // adjusting the columns size, will respect widths already set and try to fit this column
                adjustColumnsSize(root, state);
            }
        }
    }
}

function getAdjustedRowNumberColumnWidth(state) {
    const numOfRows = state.rows.length;
    const offset = state.rowNumberOffset;
    const numberOfChars = String(numOfRows + offset).length;
    return (
        CHAR_WIDTH * numberOfChars +
        12 /* padding */ +
        20 /* primitive-tootlip */
    );
}

function getRowNumberColumnIndex(state) {
    if (hasRowNumberColumn(state) && hasColumns(state)) {
        const columns = getColumns(state);
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.type === COLUMN_TYPE) {
                return i;
            }
        }
    }
    return -1;
}

function formatString(str, ...args) {
    if (str) {
        return str.replace(/{(\d+)}/g, (match, i) => {
            return typeof args[i] !== 'undefined' ? args[i] : match;
        });
    }
    return '';
}

export function getRowNumberErrorColumnDef(rowErrors, rowTitle) {
    const { title, messages } = rowErrors;

    const alternativeText = formatString(
        i18n.rowLevelErrorAssistiveText,
        rowTitle || '',
        rowErrors.fieldNames ? rowErrors.fieldNames.length : ''
    );

    return {
        type: COLUMN_TYPE,
        typeAttributes: {
            error: { title, messages, alternativeText },
        },
    };
}
