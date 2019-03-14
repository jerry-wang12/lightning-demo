import {
    KEYFIELD,
    COLUMNS_DEFINITION_BASIC,
    COLUMNS_DEFINITION_NONWHITELIST,
    DATA_BASIC,
    DATA_MISSING_CHILDREN_CONTENT,
    EXPANDED_ROWS_BASIC,
    EXPANDED_ROWS_MISSING_CHILDREN_CONTENT,
} from './../__mocks__/sampleData';
import {
    normalizeColumns,
    normalizeData,
    whitelistedColumnKeys as COLUMN_KEYS_WHITELIST,
} from './../normalizer';

const getDataLengthWithExpanded = function(data, expandedRowIds) {
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
            if (
                hasChildrenContent &&
                expandedRowIds.indexOf(row[KEYFIELD]) > -1
            ) {
                totalRows += getDataLengthWithExpanded(
                    row._children,
                    expandedRowIds
                );
            }
        }
    });

    return totalRows;
};

describe('tree-grid: normalizer', () => {
    describe('columns', () => {
        it('converts first column to tree', () => {
            const normalized = normalizeColumns(COLUMNS_DEFINITION_BASIC);
            expect(normalized[0].type).toBe('tree');
        });

        it('only allows whitelisted column keys', () => {
            const normalized = normalizeColumns(
                COLUMNS_DEFINITION_NONWHITELIST
            );

            // check that all columns other than the first tree one contain only whitelisted keys
            for (let i = 1; i < normalized.length; i++) {
                const objKeys = Object.keys(normalized[i]);

                // iterate over the object's keys
                for (const key of objKeys) {
                    expect(COLUMN_KEYS_WHITELIST).toContain(key);
                }
            }
        });
    });

    describe('data', () => {
        it('converts a nested data structure to a flattened array, no rows expanded', () => {
            const normalized = normalizeData(DATA_BASIC, [], KEYFIELD);
            expect(normalized).toHaveLength(DATA_BASIC.length);
        });

        it('converts a nested data structure to a flattened array, with expanded rows', () => {
            const normalized = normalizeData(
                DATA_BASIC,
                EXPANDED_ROWS_BASIC,
                KEYFIELD
            );

            // count number of returned rows vs number of expanded rows in source data
            const expectedRowCount = getDataLengthWithExpanded(
                DATA_BASIC,
                EXPANDED_ROWS_BASIC
            );
            expect(normalized).toHaveLength(expectedRowCount);
        });

        it('converts a nested data structure to a flattened array, with expanded rows - some without children content', () => {
            const normalized = normalizeData(
                DATA_MISSING_CHILDREN_CONTENT,
                EXPANDED_ROWS_MISSING_CHILDREN_CONTENT,
                KEYFIELD
            );

            // count number of returned rows vs number of expanded rows in source data
            const expectedRowCount = getDataLengthWithExpanded(
                DATA_MISSING_CHILDREN_CONTENT,
                EXPANDED_ROWS_MISSING_CHILDREN_CONTENT
            );
            expect(normalized).toHaveLength(expectedRowCount);
        });

        it('adds state and level attributes correctly', () => {
            const normalized = normalizeData(
                DATA_MISSING_CHILDREN_CONTENT,
                EXPANDED_ROWS_MISSING_CHILDREN_CONTENT,
                KEYFIELD
            );

            const rowWithNoChildren = normalized[0];
            const rowWithNoChildrenContent = normalized[1];
            const rowWithChildrenContentExpanded = normalized[2];
            const rowWithChildrenContentCollapsed = normalized[5];
            let childRowOfExpanded = normalized[3];

            expect(rowWithNoChildren.hasChildren).toBe(undefined);
            expect(rowWithNoChildren.isExpanded).toBe(false);
            expect(rowWithNoChildrenContent.hasChildren).toBe(true);
            expect(rowWithNoChildrenContent.isExpanded).toBe(false);
            expect(rowWithChildrenContentExpanded.hasChildren).toBe(true);
            expect(rowWithChildrenContentExpanded.isExpanded).toBe(true);
            expect(rowWithChildrenContentCollapsed.hasChildren).toBe(true);
            expect(rowWithChildrenContentCollapsed.isExpanded).toBe(false);

            const expectedChildRowOfExpanded =
                DATA_MISSING_CHILDREN_CONTENT[2]._children[0];
            expect(childRowOfExpanded.accountName).toBe(
                expectedChildRowOfExpanded.accountName
            );
            expect(childRowOfExpanded.hasChildren).toBe(
                expectedChildRowOfExpanded.hasChildren
            );
            expect(childRowOfExpanded.isExpanded).toBe(false);
            expect(childRowOfExpanded.level).toBe(2);
            expect(childRowOfExpanded.setSize).toBe(
                DATA_MISSING_CHILDREN_CONTENT[2]._children.length
            );
            expect(childRowOfExpanded.posInSet).toBe(1);

            childRowOfExpanded = normalized[4];
            expect(childRowOfExpanded.posInSet).toBe(2);
            expect(childRowOfExpanded.setSize).toBe(
                DATA_MISSING_CHILDREN_CONTENT[2]._children.length
            );
        });
    });
});
