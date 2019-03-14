import { LightningElement, track, unwrap } from 'lwc';
import fetchDataHelper from './fetchDataHelper';

const headerActions = [
    { label: 'All', checked: true, name: 'all' },
    { label: 'Published', checked: false, name: 'show_published' },
    { label: 'Unpublished', checked: false, name: 'show_unpublished' },
];

function getRowActions(row, doneCallback) {
    const newActions = [];
    const deleteAction = {
        label: 'Delete',
        iconName: 'utility:delete',
        name: 'delete',
    };

    if (row.published) {
        newActions.push({
            label: 'Unpublish',
            iconName: 'utility:ban',
            name: 'unpublish',
        });
        deleteAction.disabled = true;
    } else {
        newActions.push({
            label: 'Publish',
            iconName: 'utility:approval',
            name: 'publish',
        });
    }

    newActions.push(deleteAction);

    // simulate a trip to the server
    // eslint-disable-next-line lwc/no-set-timeout
    setTimeout(() => {
        doneCallback(newActions);
    }, 300);
}

const columns = [
    { label: 'Title', fieldName: 'book_title' },
    { label: 'Author', fieldName: 'author' },
    {
        label: 'Published',
        fieldName: 'published',
        type: 'boolean',
        actions: headerActions,
    },
    {
        type: 'action',
        typeAttributes: { rowActions: getRowActions },
    },
];

export default class DatatableWithRowActionsDynamic extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track record = {};
    @track tableLoadingState = true;

    _activeFilter;
    _rawData = [];

    async connectedCallback() {
        this.data = await fetchDataHelper({ amountOfRecords: 20 });
        this._rawData = this.data;
        this.tableLoadingState = false;
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'publish':
                this.publishBook(row);
                break;
            case 'unpublish':
                this.unpublishBook(row);
                break;
            case 'delete':
                this.deleteRow(row);
                break;
            default:
        }
    }

    handleHeaderAction(event) {
        const actionName = event.detail.action.name;
        const colDef = event.detail.columnDefinition;

        if (actionName !== this._activeFilter) {
            let columnActions;
            const columnsLength = this.columns.length;
            for (let i = 0; i < columnsLength; i++) {
                if (unwrap(this.columns[i]) === colDef) {
                    columnActions = this.columns[i].actions;
                }
            }

            columnActions.forEach(action => {
                action.checked = action.name === actionName;
            });

            this._activeFilter = actionName;
            this.updateBooks();

            // create a new copy of the column definitions to properly update the UI
            const clonedColumns = JSON.parse(JSON.stringify(this.columns));
            this.columns = clonedColumns;
        }
    }

    deleteRow(row) {
        const { id } = row;
        const rowIndex = this.findRowIndexById(id);

        if (rowIndex !== -1) {
            this.data = this.data
                .slice(0, rowIndex)
                .concat(this.data.slice(rowIndex + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    publishBook(row) {
        const { id } = row;
        const rowIndex = this.findRowIndexById(id);

        if (rowIndex !== -1) {
            this.data[rowIndex].published = true;
        }

        this.data = this.data.slice();
    }

    unpublishBook(row) {
        const { id } = row;
        const rowIndex = this.findRowIndexById(id);

        if (rowIndex !== -1) {
            this.data[rowIndex].published = false;
        }

        this.data = this.data.slice();
    }

    updateBooks() {
        let filteredRows = this._rawData;

        if (this._activeFilter !== 'all') {
            filteredRows = filteredRows.filter(row => {
                return (
                    (this._activeFilter === 'show_published' &&
                        row.published) ||
                    (this._activeFilter === 'show_unpublished' &&
                        !row.published)
                );
            });
        }

        this.data = filteredRows;
    }
}
