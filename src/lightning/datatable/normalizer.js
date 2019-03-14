import { assert } from 'lightning/utilsPrivate';
import { generateColKeyValue } from './keys';
import { getRowNumberState } from './rowNumber';
import { getResizerDefaultState } from './resizer';
import { getSortDefaultState } from './sort';
import { getColumnActionsDefaultState } from './headerActions';
import { getColumnsDefaultState } from './columns';
import { getInfiniteLoadingDefaultState } from './infiniteLoading';
import { getRowsDefaultState } from './rows';
import { getSelectorDefaultState } from './selector';
import { getKeyboardDefaultState } from './keyboard';
import { getInlineEditDefaultState } from './inlineEdit';
import { getErrorsState } from './errors';

const DEFAULTS = {
    ...getColumnsDefaultState(),
    ...getRowsDefaultState(),
    ...getSelectorDefaultState(),
    headerIndexes: {},
    ...getKeyboardDefaultState(),
    normalized: false,
    ...getColumnActionsDefaultState(),
    ...getSortDefaultState(),
    ...getRowNumberState(),
    ...getResizerDefaultState(),
    ...getInfiniteLoadingDefaultState(),
    ...getInlineEditDefaultState(),
    ...getErrorsState(),
    hideTableHeader: false,
};

export const getDefaultState = function() {
    return JSON.parse(JSON.stringify(DEFAULTS));
};

/**
 * It generate headerIndexes based in the current metadata
 * headerIndexes represent the position of the header(column)
 * based on the unique colKeyValue
 * @param {object} columns - the current normalized column metadata
 * @returns {object} headerIndexes e.g. { 'name-text' 0, 'amount-number': 1 }
 */
export const generateHeaderIndexes = function(columns) {
    return columns.reduce((prev, col, index) => {
        prev[generateColKeyValue(col, index)] = index;
        return prev;
    }, {});
};

export const normalizeKeyField = function(keyField) {
    assert(
        typeof keyField === 'string',
        '"keyField" is a required property and it wasn\'t provided. Performance optimizations wont be available without keyField.'
    );
    return keyField;
};
