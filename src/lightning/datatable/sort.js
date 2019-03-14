import { assert } from 'lightning/utilsPrivate';
import { getColumns } from './columns';

export function getSortDefaultState() {
    return {
        sortedBy: undefined,
        sortedDirection: undefined,
        defaultSortDirection: 'asc',
    };
}

const VALID_SORT_DIRECTIONS = {
    asc: true,
    desc: true,
};

export function isValidSortDirection(value) {
    return !!VALID_SORT_DIRECTIONS[value];
}

export function getSortedBy(state) {
    return state.sortedBy;
}

export function setSortedBy(state, value) {
    if (typeof value === 'string') {
        state.sortedBy = value;
    } else {
        state.sortedBy = undefined;
    }
}

export function getSortedDirection(state) {
    return state.sortedDirection;
}

export function setSortedDirection(state, value) {
    assert(
        isValidSortDirection(value),
        `The "sortedDirection" value passed into lightning:datatable
        is incorrect, "sortedDirection" value should be one of
        ${Object.keys(VALID_SORT_DIRECTIONS).join()}.`
    );
    state.sortedDirection = isValidSortDirection(value) ? value : undefined;
}

export function getDefaultSortDirection(state) {
    return state.defaultSortDirection;
}

export function setDefaultSortDirection(state, value) {
    assert(
        isValidSortDirection(value),
        `The "defaultSortDirection" value passed into lightning:datatable
        is incorrect, "defaultSortDirection" value should be one of
        ${Object.keys(VALID_SORT_DIRECTIONS).join()}.`
    );
    state.defaultSortDirection = isValidSortDirection(value)
        ? value
        : getDefaultSortDirection(state);
}

export function updateSorting(state) {
    const columns = getColumns(state);
    columns.forEach(column => updateColumnSortingState(column, state));
}

export function updateColumnSortingState(column, state) {
    const { sortedBy, sortedDirection, defaultSortDirection } = state;

    if (column.fieldName === sortedBy && column.sortable) {
        Object.assign(column, {
            sorted: true,
            sortAriaLabel:
                sortedDirection === 'desc' ? 'descending' : 'ascending',
            sortedDirection,
        });
    } else {
        Object.assign(column, {
            sorted: false,
            sortAriaLabel: column.sortable ? 'none' : null,
            sortedDirection: defaultSortDirection,
        });
    }
}
