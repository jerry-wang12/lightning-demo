import { getUserColumnIndex, getColumns } from './columns';
import * as wraptext from './wrapText';
import { unwrap } from 'lwc';

function getInternalActions(state, columnDefinition) {
    const internalActions = [];

    // just wrapper text for now.
    Array.prototype.push.apply(
        internalActions,
        wraptext.getActions(state, columnDefinition)
    );

    return internalActions;
}

function handleInternalTriggeredAction(dt, action, colKeyValue) {
    wraptext.handleTriggeredAction(dt.state, action, colKeyValue);
}

function handleCustomerTriggeredAction(dt, action, colKeyValue) {
    const userColumnIndex = getUserColumnIndex(dt.state, colKeyValue);
    const customerColumnDefinition = dt.columns[userColumnIndex];

    dt.dispatchEvent(
        new CustomEvent('headeraction', {
            detail: {
                action: unwrap(action),
                columnDefinition: unwrap(customerColumnDefinition),
            },
        })
    );
}

function getMenuAlignment(columns, index) {
    const isLastColumn = index === columns.length - 1;

    return isLastColumn || columns[index + 1].type === 'action'
        ? 'right'
        : 'left';
}

/**
 * Overrides the actions with the internal ones, plus the customer ones.
 *
 * @param {Object} state The state of the datatable.
 */
export function updateHeaderActions(state) {
    const columns = getColumns(state);

    columns.forEach((column, idx) => {
        column.actions = {
            menuAlignment: getMenuAlignment(columns, idx),
            customerActions: Array.isArray(column.actions)
                ? column.actions
                : [],
            internalActions: getInternalActions(state, column),
        };
    });
}

export function handleHeaderActionTriggered(event) {
    const { action, actionType, colKeyValue } = event.detail;

    event.stopPropagation();
    if (actionType === 'customer') {
        handleCustomerTriggeredAction(this, action, colKeyValue);
    } else {
        handleInternalTriggeredAction(this, action, colKeyValue);
    }
}

export function getColumnActionsDefaultState() {
    return Object.assign({}, wraptext.getDefaultState());
}

export function handleHeaderActionMenuOpening(event) {
    event.stopPropagation();
    event.preventDefault();

    event.detail.saveContainerPosition(this.getViewableRect());
}
