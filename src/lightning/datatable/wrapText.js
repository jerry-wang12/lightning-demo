import labelClipText from '@salesforce/label/LightningDatatable.clipText';
import labelWrapText from '@salesforce/label/LightningDatatable.wrapText';
import { getStateColumnIndex, getColumns } from './columns';

const wrapableTypes = [
    'text',
    'number',
    'currency',
    'percent',
    'email',
    'date',
    'phone',
    'url',
    'location',
    'tree',
];

const i18n = {
    clipText: labelClipText,
    wrapText: labelWrapText,
};

function updateCellsWrapperText(state, colIndex, colKeyValue) {
    state.rows.forEach(row => {
        row.cells[colIndex].wrapText = state.wrapText[colKeyValue];
    });
}

function updateWrapTextState(state, colKeyValue) {
    const columns = getColumns(state);
    const colIndex = getStateColumnIndex(state, colKeyValue);
    const colData = columns[colIndex];

    colData.actions.internalActions.forEach(action => {
        if (action.name === 'wrap_text') {
            action.checked = state.wrapText[colKeyValue];
        }
        if (action.name === 'clip_text') {
            action.checked = !state.wrapText[colKeyValue];
        }
    });

    updateCellsWrapperText(state, colIndex, colKeyValue);

    // lets force a refresh on this column, because the wrapText checked value changed.
    colData.actions = Object.assign({}, colData.actions);
}

export function getActions(state, columnDefinition) {
    const actions = [];
    if (!state.wrapText[columnDefinition.colKeyValue]) {
        // wraptext its off by default.
        state.wrapText[columnDefinition.colKeyValue] = false;
    }

    if (wrapableTypes.indexOf(columnDefinition.type) >= 0) {
        actions.push({
            label: `${i18n.wrapText}`,
            title: `${i18n.wrapText}`,
            checked: state.wrapText[columnDefinition.colKeyValue],
            name: 'wrap_text',
        });

        actions.push({
            label: `${i18n.clipText}`,
            title: `${i18n.clipText}`,
            checked: !state.wrapText[columnDefinition.colKeyValue],
            name: 'clip_text',
        });
    }

    return actions;
}

export function handleTriggeredAction(state, action, colKeyValue) {
    if (action.name === 'wrap_text' || action.name === 'clip_text') {
        // If will change state
        if (state.wrapText[colKeyValue] !== (action.name === 'wrap_text')) {
            state.wrapText[colKeyValue] = action.name === 'wrap_text';

            updateWrapTextState(state, colKeyValue);
        }
    }
}

export function getDefaultState() {
    return {
        wrapText: {},
    };
}
