import { getColumns } from './columns';
import { isTreeType } from './types';

export function getTreeStateIndicatorFieldNames() {
    return {
        children: 'hasChildren',
        level: 'level',
        expanded: 'isExpanded',
        position: 'posInSet',
        setsize: 'setSize',
    };
}

export function hasTreeDataType(state) {
    const columns = getColumns(state);
    return columns.some(column => {
        return isTreeType(column.type);
    });
}

export function getStateTreeColumn(state) {
    const columns = getColumns(state);
    for (let i = 0; i < columns.length; i++) {
        if (isTreeType(columns[i].type)) {
            return columns[i];
        }
    }
    return null;
}

export function fireRowToggleEvent(rowKeyValue, expanded) {
    const customEvent = new CustomEvent('privatetogglecell', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
            name: rowKeyValue,
            nextState: expanded ? false : true, // True = expanded, False = collapsed
        },
    });
    this.dispatchEvent(customEvent);
}
