import { createElement } from 'lwc';
import LightningElement from 'lightning/treeGrid';
import {
    shadowQuerySelector,
    shadowQuerySelectorAll,
} from 'lightning/testUtils';
import {
    KEYFIELD,
    COLUMNS_DEFINITION_BASIC,
    DATA_BASIC,
    DATA_MISSING_CHILDREN_CONTENT,
    EXPANDED_ROWS_BASIC,
    EXPANDED_ROWS_MISSING_CHILDREN_CONTENT,
    EXPANDED_ROWS_INVALID,
    SELECTED_ROWS_BASIC,
    SELECTED_ROWS_INVALID,
} from './../__mocks__/sampleData';
import { normalizeData } from './../normalizer';

const selectors = {
    treegrid: 'lightning-tree-grid',
    datatable: 'lightning-datatable',
    cellfactory: 'lightning-primitive-cell-factory',
    cellwrapper: 'lightning-primitive-cell-wrapper',
    celltypes: 'lightning-primitive-cell-types',
    treeCol: 'th',
    treegridTable: 'lightning-tree-grid table',
    treegridRows: 'tr',
    nthRow: 'tbody tr:nth-of-type(${index})',
    nthOfType: 'tbody tr:nth-of-type(${index})',
    rootRowAtPos: 'tbody tr[aria-level="1"][aria-posinset="${index}"]',
    rowChevron: 'th lightning-button-icon',
    rowText: 'lightning-formatted-text',
    rowCheckbox: 'lightning-primitive-cell-checkbox',
    checkbox: 'input',
    rowToggleButton: 'lightning-primitive-treegrid-cell-toggle',
    button: 'lightning-button-icon',
};

const getRowIndicesInFlattenedData = function(flattenedData, rowIds) {
    const rowIndices = [];

    // iterator over each row
    flattenedData.forEach((row, index) => {
        // if row matches an ID in the provided list add it to the tracking array
        if (rowIds.indexOf(row[KEYFIELD]) !== -1) {
            rowIndices.push(index);
        }
    });

    return rowIndices;
};

const getExpandedDataLength = function(data) {
    let totalRows = 0;

    // iterator over each row
    data.forEach(row => {
        totalRows += 1;

        if (row.hasOwnProperty('_children')) {
            // validate _children key
            let hasChildrenContent = false;
            if (Array.isArray(row._children) && row._children.length > 0) {
                hasChildrenContent = true;
            }

            // keep diving deeper
            if (hasChildrenContent) {
                totalRows += getExpandedDataLength(row._children);
            }
        }
    });

    return totalRows;
};

function createComponent(props = {}) {
    const element = createElement('lightning-tree-grid', {
        is: LightningElement,
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
}

function getRow(element, rowSelector) {
    const table = shadowQuerySelector(element, selectors.datatable);
    return shadowQuerySelector(table, rowSelector);
}

function getRows(element, rowSelector) {
    const table = shadowQuerySelector(element, selectors.datatable);

    return shadowQuerySelectorAll(table, rowSelector).length - 1;
}

function getTreeRowText(element) {
    const rowCol = element
        .querySelector(selectors.treeCol)
        .querySelector(selectors.cellfactory);
    const cellType = shadowQuerySelector(
        rowCol,
        selectors.cellwrapper
    ).querySelector(selectors.celltypes);
    return shadowQuerySelector(cellType, selectors.rowText);
}

function getTreeRowToggle(element) {
    const rowCol = element
        .querySelector(selectors.treeCol)
        .querySelector(selectors.cellfactory);
    const toggle = shadowQuerySelector(
        shadowQuerySelector(rowCol, selectors.cellwrapper),
        selectors.rowToggleButton
    );
    return shadowQuerySelector(toggle, selectors.button);
}

describe('lightning-tree-grid', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('rendering', () => {
        it('with expanded rows', () => {
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
                expandedRows: EXPANDED_ROWS_BASIC,
            });

            return Promise.resolve().then(() => {
                const flattenedData = normalizeData(
                    DATA_BASIC,
                    EXPANDED_ROWS_BASIC,
                    KEYFIELD
                );
                const expandedRowIndices = getRowIndicesInFlattenedData(
                    flattenedData,
                    EXPANDED_ROWS_BASIC
                );

                expandedRowIndices.forEach(index => {
                    const rowElementFirstChild = getRow(
                        element,
                        selectors.nthRow.replace('${index}', index + 1) +
                            ' + tr'
                    );
                    const actual = getTreeRowText(rowElementFirstChild)
                        .shadowRoot.textContent;
                    const expected = flattenedData[index + 1].accountName;

                    expect(actual).toBe(expected);
                });
            });
        });

        it('with selected rows', () => {
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
                expandedRows: EXPANDED_ROWS_BASIC,
                selectedRows: SELECTED_ROWS_BASIC,
            });

            return Promise.resolve().then(() => {
                const flattenedData = normalizeData(
                    DATA_BASIC,
                    EXPANDED_ROWS_BASIC,
                    KEYFIELD
                );
                const selectedRowIndices = getRowIndicesInFlattenedData(
                    flattenedData,
                    SELECTED_ROWS_BASIC
                );

                selectedRowIndices.forEach(index => {
                    const rowElement = getRow(
                        element,
                        selectors.nthRow.replace('${index}', index + 1)
                    );

                    const actual =
                        rowElement.getAttribute('aria-selected') === 'true';
                    const expected = true;

                    expect(actual).toBe(expected);
                });
            });
        });

        it('with row marked as expanded and missing children content', () => {
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_MISSING_CHILDREN_CONTENT,
                keyField: KEYFIELD,
                expandedRows: EXPANDED_ROWS_MISSING_CHILDREN_CONTENT,
            });

            return Promise.resolve().then(() => {
                const flattenedData = normalizeData(
                    DATA_MISSING_CHILDREN_CONTENT,
                    EXPANDED_ROWS_MISSING_CHILDREN_CONTENT,
                    KEYFIELD
                );
                const rowIndices = getRowIndicesInFlattenedData(
                    flattenedData,
                    EXPANDED_ROWS_MISSING_CHILDREN_CONTENT[0]
                ); // only check a single row

                rowIndices.forEach(index => {
                    const rowElement = getRow(
                        element,
                        selectors.nthRow.replace('${index}', index + 1)
                    );
                    const actual =
                        rowElement.getAttribute('aria-expanded') === 'false'
                            ? false
                            : true;
                    const expected = false;

                    expect(actual).toBe(expected);
                });
            });
        });

        it('with invalid expanded row ID', () => {
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
                expandedRows: EXPANDED_ROWS_INVALID,
            });

            return Promise.resolve().then(() => {
                const flattenedData = normalizeData(
                    DATA_BASIC,
                    EXPANDED_ROWS_INVALID,
                    KEYFIELD
                );
                const rowIndices = getRowIndicesInFlattenedData(
                    flattenedData,
                    EXPANDED_ROWS_INVALID
                );

                // found indices should be fewer than number passed in
                expect(rowIndices.length).toBeLessThan(
                    EXPANDED_ROWS_INVALID.length
                );

                rowIndices.forEach(index => {
                    const rowElement = getRow(
                        element,
                        selectors.nthRow.replace('${index}', index + 1)
                    );

                    const actual =
                        rowElement.getAttribute('aria-expanded') === 'true'
                            ? true
                            : false;
                    const expected = true;

                    expect(actual).toBe(expected);
                });
            });
        });

        it('with invalid selected row ID', () => {
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
                expandedRows: EXPANDED_ROWS_BASIC,
                selectedRows: SELECTED_ROWS_INVALID,
            });

            return Promise.resolve().then(() => {
                const flattenedData = normalizeData(
                    DATA_BASIC,
                    EXPANDED_ROWS_INVALID,
                    KEYFIELD
                );
                const rowIndices = getRowIndicesInFlattenedData(
                    flattenedData,
                    SELECTED_ROWS_INVALID
                );

                // found indices should be fewer than number passed in
                expect(rowIndices.length).toBeLessThan(
                    SELECTED_ROWS_INVALID.length
                );

                rowIndices.forEach(index => {
                    const rowElement = getRow(
                        element,
                        selectors.nthRow.replace('${index}', index + 1)
                    );

                    const actual =
                        rowElement.getAttribute('aria-selected') === 'true';
                    const expected = true;

                    expect(actual).toBe(expected);
                });
            });
        });
    });

    describe('interacting', () => {
        it('by expanding a single row with children content', () => {
            const expandRowNumber = 2;

            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
            });

            return Promise.resolve()
                .then(() => {
                    const rowToExpand = getRow(
                        element,
                        selectors.nthOfType.replace('${index}', expandRowNumber)
                    );
                    const rowTreeButton = getTreeRowToggle(rowToExpand);
                    rowTreeButton.click();
                })
                .then(() => {
                    const newChildRow = getRow(
                        element,
                        selectors.nthOfType.replace(
                            '${index}',
                            expandRowNumber + 1
                        )
                    );
                    const newChildRowAccountName = getTreeRowText(newChildRow)
                        .shadowRoot.textContent;
                    const expectedRowAccountName =
                        DATA_BASIC[expandRowNumber - 1]._children[0]
                            .accountName;

                    expect(newChildRowAccountName).toBe(expectedRowAccountName);
                });
        });

        it('by expanding a single row without children content', () => {
            const expandRowNumber = 2;

            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_MISSING_CHILDREN_CONTENT,
                keyField: KEYFIELD,
            });

            return Promise.resolve()
                .then(() => {
                    const rowToExpand = getRow(
                        element,
                        selectors.nthOfType.replace('${index}', expandRowNumber)
                    );
                    const rowTreeButton = getTreeRowToggle(rowToExpand);
                    rowTreeButton.click();
                })
                .then(() => {
                    const nextChildRow = getRow(
                        element,
                        selectors.nthOfType.replace(
                            '${index}',
                            expandRowNumber + 1
                        )
                    );
                    const nextChildRowAccountName = getTreeRowText(nextChildRow)
                        .shadowRoot.textContent;
                    const expectedRowAccountName =
                        DATA_MISSING_CHILDREN_CONTENT[expandRowNumber]
                            .accountName;

                    expect(nextChildRowAccountName).toBe(
                        expectedRowAccountName
                    );
                });
        });

        it('by expanding a single row it fires the toggle event', () => {
            const expandRowNumber = 2;
            const evtListenerMock = jest.fn();

            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
            });

            return Promise.resolve()
                .then(() => {
                    const rowToExpand = getRow(
                        element,
                        selectors.nthOfType.replace('${index}', expandRowNumber)
                    );
                    const rowTreeButton = getTreeRowToggle(rowToExpand);

                    element.addEventListener('toggle', evtListenerMock);

                    rowTreeButton.click();
                })
                .then(() => {
                    // confirm that the event was fired
                    expect(evtListenerMock.mock.calls).toHaveLength(1);

                    // confirm the event details
                    const details = evtListenerMock.mock.calls[0][0].detail;
                    expect(details[KEYFIELD]).toBe(
                        DATA_BASIC[expandRowNumber - 1][KEYFIELD]
                    );
                    expect(details.hasChildrenContent).toBe(true);
                    expect(details.isExpanded).toBe(true);
                    expect(details.row).not.toBeNull();
                });
        });

        it('by collapsing a single row', () => {
            const collapseRowNumber = 2;

            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
                expandedRows: EXPANDED_ROWS_BASIC,
            });

            return Promise.resolve()
                .then(() => {
                    const rowToCollapse = getRow(
                        element,
                        selectors.nthOfType.replace(
                            '${index}',
                            collapseRowNumber
                        )
                    );
                    const rowTreeButton = getTreeRowToggle(rowToCollapse);
                    rowTreeButton.click();
                })
                .then(() => {
                    const nextChildRow = getRow(
                        element,
                        selectors.nthOfType.replace(
                            '${index}',
                            collapseRowNumber + 1
                        )
                    );
                    const nextChildRowAccountName = getTreeRowText(nextChildRow)
                        .shadowRoot.textContent;
                    const expectedRowAccountName =
                        DATA_BASIC[collapseRowNumber].accountName;

                    expect(nextChildRowAccountName).toBe(
                        expectedRowAccountName
                    );
                });
        });

        it('by collapsing a single row it fires the toggle event', () => {
            const collapseRowNumber = 2;
            const evtListenerMock = jest.fn();

            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
                expandedRows: EXPANDED_ROWS_BASIC,
            });

            return Promise.resolve()
                .then(() => {
                    const rowToCollapse = getRow(
                        element,
                        selectors.nthOfType.replace(
                            '${index}',
                            collapseRowNumber
                        )
                    );
                    const rowTreeButton = getTreeRowToggle(rowToCollapse);

                    element.addEventListener('toggle', evtListenerMock);

                    rowTreeButton.click();
                })
                .then(() => {
                    // confirm that the event was fired
                    expect(evtListenerMock.mock.calls).toHaveLength(1);

                    // confirm the event details
                    const details = evtListenerMock.mock.calls[0][0].detail;
                    expect(details[KEYFIELD]).toBe(
                        DATA_BASIC[collapseRowNumber - 1][KEYFIELD]
                    );
                    expect(details.isExpanded).toBe(false);
                    expect(details.row).not.toBeNull();
                });
        });

        it('by expanding all rows (all with children content)', () => {
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
            });

            return Promise.resolve()
                .then(() => {
                    element.expandAll();
                })
                .then(() => {
                    // confirm that the same number of row were rendered as could have possibly been expanded
                    const totalItems = getRows(element, selectors.treegridRows);
                    const expectedNumItems = getExpandedDataLength(DATA_BASIC);

                    expect(totalItems).toBe(expectedNumItems);
                });
        });

        it('by expanding all rows (some without children content)', () => {
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_MISSING_CHILDREN_CONTENT,
                keyField: KEYFIELD,
            });

            return Promise.resolve()
                .then(() => {
                    element.expandAll();
                })
                .then(() => {
                    // confirm that the same number of row were rendered as could have possibly been expanded

                    const totalItems = getRows(element, selectors.treegridRows);
                    const expectedNumItems = getExpandedDataLength(
                        DATA_MISSING_CHILDREN_CONTENT
                    );

                    expect(totalItems).toBe(expectedNumItems);
                });
        });

        it('by expanding all rows it fires the toggleall event', () => {
            const evtListenerMock = jest.fn();
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
            });

            return Promise.resolve()
                .then(() => {
                    element.addEventListener('toggleall', evtListenerMock);
                    element.expandAll();
                })
                .then(() => {
                    // confirm that the event was fired
                    expect(evtListenerMock.mock.calls).toHaveLength(1);

                    // confirm the event details
                    const details = evtListenerMock.mock.calls[0][0].detail;
                    expect(details.isExpanded).toBe(true);
                });
        });

        it('by collapsing all rows', () => {
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
                expandedRows: EXPANDED_ROWS_BASIC,
            });

            return Promise.resolve()
                .then(() => {
                    // collapse all
                    element.collapseAll();
                })
                .then(() => {
                    // confirm that the same number of rows were rendered as could have possibly been expanded
                    const totalItems = getRows(element, selectors.treegridRows);
                    const expectedNumItems = DATA_BASIC.length;

                    expect(totalItems).toBe(expectedNumItems);
                });
        });

        it('by collapsing all rows it fires the toggleall event', () => {
            const evtListenerMock = jest.fn();
            const element = createComponent({
                columns: COLUMNS_DEFINITION_BASIC,
                data: DATA_BASIC,
                keyField: KEYFIELD,
                expandedRows: EXPANDED_ROWS_BASIC,
            });

            return Promise.resolve()
                .then(() => {
                    // collapse all
                    element.addEventListener('toggleall', evtListenerMock);

                    element.collapseAll();
                })
                .then(() => {
                    // confirm that the event was fired
                    expect(evtListenerMock.mock.calls).toHaveLength(1);

                    // confirm the event details
                    const details = evtListenerMock.mock.calls[0][0].detail;
                    expect(details.isExpanded).toBe(false);
                });
        });
    });
});
