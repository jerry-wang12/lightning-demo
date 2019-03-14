import { LightningElement, unwrap, api, track } from 'lwc';
import datatableTpl from './datatable.html';
import { classSet } from 'lightning/utils';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { generateHeaderIndexes, getDefaultState } from './normalizer';
import {
    setData,
    getData,
    updateRowsAndCellIndexes,
    setKeyField,
    getKeyField,
    hasValidKeyField,
} from './rows';
import {
    isResizeColumnDisabled,
    setResizeColumnDisabled,
    getResizeStep,
    setResizeStep,
    getMinColumnWidth,
    setMinColumnWidth,
    getMaxColumnWidth,
    setMaxColumnWidth,
    getColumnsWidths,
    resetColumnWidths,
    hasDefinedColumnsWidths,
    adjustColumnsSize,
    resizeColumnWithDelta,
    getCustomerColumnWidths,
    getTableWidthStyle,
    updateColumnWidthsMetadata,
} from './resizer';
import {
    syncSelectedRowsKeys,
    handleRowSelectionChange,
    updateSelectionState,
    getMaxRowSelection,
    setMaxRowSelection,
    getSelectedRowsKeys,
    setSelectedRowsKeys,
    handleSelectAllRows,
    handleDeselectAllRows,
    handleSelectRow,
    handleDeselectRow,
    getHideSelectAllCheckbox,
    getCurrentSelectionLength,
} from './selector';
import {
    syncActiveCell,
    handleCellKeydown,
    updateActiveCell,
    setBlurActiveCell,
    setFocusActiveCell,
    setFocusActiveRow,
    isActiveCell,
    updateTabIndex,
    getIndexesByKeys,
    updateTabIndexActiveCell,
    updateTabIndexActiveRow,
    unsetRowNavigationMode,
    updateRowNavigationMode,
    NAVIGATION_DIR,
    handleDatatableLosedFocus,
    handleDatatableFocusIn,
    updateTabIndexRow,
    getIndexesActiveCell,
    reactToKeyboardOnRow,
    setCellToFocusFromPrev,
    updateCellToFocusFromPrev,
    resetCellToFocusFromPrev,
    datatableHasFocus,
    setCellClickedForFocus,
    handleKeyDown,
    addFocusStylesToActiveCell,
} from './keyboard';
import {
    getRowNumberOffset,
    setRowNumberOffset,
    hasRowNumberColumn,
    setShowRowNumberColumn,
    adjustRowNumberColumnWidth,
} from './rowNumber';
import { hasColumns, getColumns, normalizeColumns } from './columns';
import {
    handleLoadMoreCheck,
    isInfiniteLoadingEnabled,
    setInfiniteLoading,
    getLoadMoreOffset,
    setLoadMoreOffset,
    isLoading,
    setLoading,
    handlePrefetch,
} from './infiniteLoading';

import {
    handleRowActionTriggered,
    handleLoadDynamicActions,
    handleCellButtonClick,
} from './rowLevelActions';
import {
    getSortedBy,
    setSortedBy,
    getSortedDirection,
    setSortedDirection,
    getDefaultSortDirection,
    setDefaultSortDirection,
    updateSorting,
} from './sort';
import {
    updateHeaderActions,
    handleHeaderActionTriggered,
    handleHeaderActionMenuOpening,
} from './headerActions';
import {
    isInlineEditTriggered,
    cancelInlineEdit,
    handleEditCell,
    handleInlineEditFinish,
    handleMassCheckboxChange,
    handleInlineEditPanelScroll,
    getDirtyValues,
    setDirtyValues,
    closeInlineEdit,
} from './inlineEdit';
import { hasTreeDataType } from './tree';
import { setErrors, getTableError, getErrors } from './errors';

import { debounce, generateUniqueId } from 'lightning/inputUtils';
import { ResizeSensor } from './resizeSensor';
import DatatableTypes from './types';

const typesMap = new WeakMap();

export default class LightningDatatable extends LightningElement {
    hasDetachedListeners = true;
    _columns = [];
    _hideCheckboxColumn = false;
    _draftValues = [];
    customerSelectedRows = null;
    privateDatatableId = generateUniqueId('lgt-datatable');

    @track privateSuppressBottomBar = false;
    @track state = getDefaultState();

    constructor() {
        super();
        if (!typesMap.has(this.constructor)) {
            const privateTypes = new DatatableTypes(
                this.constructor.customTypes
            );
            typesMap.set(this.constructor, privateTypes);
        }
        this.updateRowsAndCellIndexes = updateRowsAndCellIndexes.bind(this);
    }

    get privateTypes() {
        return typesMap.get(this.constructor);
    }

    set columns(value) {
        this._columns = Array.isArray(value) ? value : [];
        this.updateColumns(this._columns);
    }

    /**
     * Array of the columns object that's used to define the data types.
     * Required properties include 'label', 'fieldName', and 'type'. The default type is 'text'.
     * See the Documentation tab for more information.
     * @type {array}
     */
    @api
    get columns() {
        return this._columns;
    }

    set data(value) {
        setData(this.state, value);
        if (hasValidKeyField(this.state)) {
            this.updateRowsState();
        }
        if (this.customerSelectedRows) {
            this.setSelectedRows(this.customerSelectedRows);
        }
    }

    /**
     * The array of data to be displayed.
     * @type {array}
     */
    @api
    get data() {
        return getData(this.state);
    }

    set keyField(value) {
        setKeyField(this.state, value);
        setDirtyValues(this.state, this._draftValues);
        this.updateRowsState();
    }

    /**
     * Required for better performance.
     * Associates each row with a unique ID.
     * @type {string}
     * @required
     */
    @api
    get keyField() {
        return getKeyField(this.state);
    }

    set hideCheckboxColumn(value) {
        this._hideCheckboxColumn = value;
        this.state.hideCheckboxColumn = normalizeBoolean(value);
        // update the columns metadata again to update the status.
        this.updateColumns(this._columns);
    }

    /**
     * If present, the checkbox column for row selection is hidden.
     * @type {boolean}
     * @default false
     */
    @api
    get hideCheckboxColumn() {
        return this._hideCheckboxColumn;
    }

    set showRowNumberColumn(value) {
        setShowRowNumberColumn(this.state, value);
        this.updateColumns(this._columns);
    }

    /**
     * If present, the row numbers are shown in the first column.
     * @type {boolean}
     * @default false
     */
    @api
    get showRowNumberColumn() {
        return hasRowNumberColumn(this.state);
    }

    set rowNumberOffset(value) {
        const { state } = this;
        setRowNumberOffset(state, value);
        adjustRowNumberColumnWidth(this.template, state);
    }

    /**
     * Determines where to start counting the row number.
     * The default is 0.
     * @type {number}
     * @default 0
     */
    @api
    get rowNumberOffset() {
        return getRowNumberOffset(this.state);
    }

    set resizeColumnDisabled(value) {
        setResizeColumnDisabled(this.state, value);
    }

    /**
     * If present, column resizing is disabled.
     * @type {boolean}
     * @default false
     */
    @api
    get resizeColumnDisabled() {
        return isResizeColumnDisabled(this.state);
    }

    set minColumnWidth(value) {
        setMinColumnWidth(this.state, value);
    }

    /**
     * The minimum width for all columns.
     * The default is 50px.
     * @type {number}
     * @default 50px
     */
    @api
    get minColumnWidth() {
        return getMinColumnWidth(this.state);
    }

    set maxColumnWidth(value) {
        setMaxColumnWidth(this.state, value);
    }

    /**
     * The maximum width for all columns.
     * The default is 1000px.
     * @type {number}
     * @default 1000px
     */
    @api
    get maxColumnWidth() {
        return getMaxColumnWidth(this.state);
    }

    set resizeStep(value) {
        setResizeStep(this.state, value);
    }

    /**
     * The width to resize the column when a user presses left or right arrow.
     * The default is 10px.
     * @type {number}
     * @default 10px
     */
    @api
    get resizeStep() {
        return getResizeStep(this.state);
    }

    set sortedBy(value) {
        setSortedBy(this.state, value);
        updateSorting(this.state);
    }

    /**
     * The column fieldName that controls the sorting order.
     * Sort the data using the onsort event handler.
     * @type {string}
     */
    @api
    get sortedBy() {
        return getSortedBy(this.state);
    }

    set sortedDirection(value) {
        setSortedDirection(this.state, value);
        updateSorting(this.state);
    }

    /**
     * Specifies the sorting direction.
     * Sort the data using the onsort event handler.
     * Valid options include 'asc' and 'desc'.
     * @type {string}
     */
    @api
    get sortedDirection() {
        return getSortedDirection(this.state);
    }

    set defaultSortDirection(value) {
        setDefaultSortDirection(this.state, value);
        updateSorting(this.state);
    }

    /**
     * Specifies the default sorting direction on an unsorted column.
     * Valid options include 'asc' and 'desc'.
     * The default is 'asc' for sorting in ascending order.
     * @type {string}
     * @default asc
     */
    @api
    get defaultSortDirection() {
        return getDefaultSortDirection(this.state);
    }

    set enableInfiniteLoading(value) {
        setInfiniteLoading(this.state, value);
    }

    /**
     * If present, you can load a subset of data and then display more
     * when users scroll to the end of the table.
     * Use with the onloadmore event handler to retrieve more data.
     * @type {boolean}
     * @default false
     */
    @api
    get enableInfiniteLoading() {
        return isInfiniteLoadingEnabled(this.state);
    }

    set loadMoreOffset(value) {
        setLoadMoreOffset(this.state, value);
    }

    /**
     * Determines when to trigger infinite loading based on
     * how many pixels the table's scroll position is from the bottom of the table.
     * The default is 20.
     * @type {number}
     * @default 20
     */
    @api
    get loadMoreOffset() {
        return getLoadMoreOffset(this.state);
    }

    set isLoading(value) {
        setLoading(this.state, value);
    }

    /**
     * If present, a spinner is shown to indicate that more data is loading.
     * @type {boolean}
     * @default false
     */
    @api
    get isLoading() {
        return isLoading(this.state);
    }
    set maxRowSelection(value) {
        const previousSelectionLenght = getCurrentSelectionLength(this.state);
        setMaxRowSelection(this.state, value);
        if (previousSelectionLenght > 0) {
            this.fireSelectedRowsChange(this.getSelectedRows());
        }
    }

    /**
     * The maximum number of rows that can be selected.
     * Checkboxes are used for selection by default,
     * and radio buttons are used when maxRowSelection is 1.
     * @type {number}
     */
    @api
    get maxRowSelection() {
        return getMaxRowSelection(this.state);
    }
    set selectedRows(value) {
        this.customerSelectedRows = value;
        this.setSelectedRows(value);
    }

    /**
     * Enables programmatic row selection with a list of key-field values.
     * @type {list}
     */
    @api
    get selectedRows() {
        return getSelectedRowsKeys(this.state);
    }

    set errors(value) {
        setErrors(this.state, value);
        this.updateRowsState();
    }

    /**
     * Specifies an object containing information about cell level, row level, and table level errors.
     * When it's set, error messages are displayed on the table accordingly.
     * @type {object}
     */
    @api
    get errors() {
        return getErrors(this.state);
    }

    /**
     * The current values per row that are provided during inline edit.
     * @type {object}
     */
    @api
    get draftValues() {
        return getDirtyValues(this.state);
    }

    set draftValues(value) {
        this._draftValues = value;
        setDirtyValues(this.state, value);

        if (hasValidKeyField(this.state)) {
            this.updateRowsAndCellIndexes(this.state);
        }
    }

    /**
     * If present, the table header is hidden.
     * @type {boolean}
     * @default false
     */
    @api
    get hideTableHeader() {
        return this.state.hideTableHeader;
    }

    set hideTableHeader(value) {
        this.state.hideTableHeader = !!value;
    }

    get hasValidKeyField() {
        if (hasValidKeyField(this.state)) {
            return true;
        }
        // eslint-disable-next-line no-console
        console.error(
            `The "keyField" is a required attribute of lightning:datatable.`
        );
        return false;
    }

    get showSelectAllCheckbox() {
        return !getHideSelectAllCheckbox(this.state);
    }

    /**
     * If present, the footer that displays the Save and Cancel buttons is hidden during inline editing.
     * @type {boolean}
     * @default false
     */
    @api
    get suppressBottomBar() {
        return this.privateSuppressBottomBar;
    }

    set suppressBottomBar(value) {
        this.privateSuppressBottomBar = !!value;
    }

    connectedCallback() {
        const {
            handleResizeColumn,
            handleUpdateColumnSort,
            handleCellFocusByClick,
            handleFalseCellBlur,
        } = this;

        this.template.addEventListener(
            'selectallrows',
            handleSelectAllRows.bind(this)
        );
        this.template.addEventListener(
            'deselectallrows',
            handleDeselectAllRows.bind(this)
        );
        this.template.addEventListener('selectrow', handleSelectRow.bind(this));
        this.template.addEventListener(
            'deselectrow',
            handleDeselectRow.bind(this)
        );

        this.addEventListener(
            'rowselection',
            handleRowSelectionChange.bind(this)
        );

        this.template.addEventListener(
            'resizecol',
            handleResizeColumn.bind(this)
        );
        this.template.addEventListener(
            'privateupdatecolsort',
            handleUpdateColumnSort.bind(this)
        );

        this.template.addEventListener(
            'privatecellkeydown',
            handleCellKeydown.bind(this)
        );

        this.template.addEventListener(
            'privatecellfocusedbyclick',
            handleCellFocusByClick.bind(this)
        );
        this.template.addEventListener(
            'privatecellfalseblurred',
            handleFalseCellBlur.bind(this)
        );

        // row-level-actions
        this.template.addEventListener(
            'privatecellactiontriggered',
            handleRowActionTriggered.bind(this)
        );
        this.template.addEventListener(
            'privatecellactionmenuopening',
            handleLoadDynamicActions.bind(this)
        );
        this.template.addEventListener(
            'privatecellbuttonclicked',
            handleCellButtonClick.bind(this)
        );

        // header-actions
        this.template.addEventListener(
            'privatecellheaderactionmenuopening',
            handleHeaderActionMenuOpening.bind(this)
        );
        this.template.addEventListener(
            'privatecellheaderactiontriggered',
            handleHeaderActionTriggered.bind(this)
        );

        // inline-edit
        this.template.addEventListener(
            'privateeditcell',
            handleEditCell.bind(this)
        );
    }

    render() {
        return datatableTpl;
    }

    handleTrRowKeyDown(event) {
        // we probably should not be doing this unless we actually are interested in it
        if (
            this.state.keyboardMode === 'NAVIGATION' &&
            this.state.rowMode === true
        ) {
            event.stopPropagation();

            const tr = event.currentTarget;
            const rowKeyValue = tr.getAttribute('data-row-key-value');
            const keyCode = event.keyCode;
            const rowHasChildren = !!tr.getAttribute('aria-expanded');
            const rowExpanded = tr.getAttribute('aria-expanded') === 'true';
            const rowLevel = tr.getAttribute('aria-level');

            const evt = {
                target: tr,
                detail: {
                    rowKeyValue,
                    keyCode,
                    rowHasChildren,
                    rowExpanded,
                    rowLevel,
                    keyEvent: event,
                },
            };

            reactToKeyboardOnRow(this, this.state, evt);
        }
    }

    disconnectedCallback() {
        // raptor does the removeEventListeners, so no need to detach them.
        this.hasDetachedListeners = true;
        const resizeTarget = unwrap(
            this.template.querySelector('.dt-width-observer')
        );
        this.privateWidthObserver.detach(resizeTarget);
    }

    renderedCallback() {
        if (this.hasDetachedListeners) {
            this.attachListeners();
        }
        const { state } = this;
        if (hasColumns(state) && !hasDefinedColumnsWidths(state)) {
            adjustColumnsSize(this.template, state);
            this.fireOnResize();
        }
        handlePrefetch.call(this, this.template, state);
        // customerSelectedRows is only valid till render, after it, the one used should be the one from the state.
        this.customerSelectedRows = null;
        // set the previous focused cell to null after render is done
        resetCellToFocusFromPrev(state);
    }

    setSelectedRows(value) {
        setSelectedRowsKeys(this.state, value);
        handleRowSelectionChange.call(this);
    }

    updateRowsState() {
        const { state } = this;
        // calculate cell to focus next before indexes are updated
        setCellToFocusFromPrev(state);

        this.updateRowsAndCellIndexes(state);
        adjustRowNumberColumnWidth(this.template, state);
        // update celltofocus next to null if the row still exists after indexes calculation
        updateCellToFocusFromPrev(state);
        syncSelectedRowsKeys(state, this.getSelectedRows()).ifChanged(
            selectedRows => this.fireSelectedRowsChange(selectedRows)
        );
        syncActiveCell(state);

        if (state.keyboardMode === 'NAVIGATION') {
            updateTabIndexActiveCell(state);
            updateTabIndexActiveRow(state);
        }
        // if there is previously focused cell which was deleted set focus from celltofocus next
        if (state.cellToFocusNext) {
            setFocusActiveCell(this.template, this.state);
        }
    }

    updateColumns(columns) {
        const { state } = this;
        const hadTreeDataTypePreviously = hasTreeDataType(state);
        // calculate cell to focus next before indexes are updated
        setCellToFocusFromPrev(state);
        normalizeColumns(state, columns, this.privateTypes);
        setDirtyValues(state, this._draftValues);
        updateRowNavigationMode(hadTreeDataTypePreviously, state);
        state.headerIndexes = generateHeaderIndexes(getColumns(state));
        updateHeaderActions(state);
        this.updateRowsAndCellIndexes(state);
        updateSelectionState(state);
        adjustRowNumberColumnWidth(this.template, state);
        updateColumnWidthsMetadata(state);
        // set the celltofocus next to null if the column still exists after indexes calculation
        updateCellToFocusFromPrev(state);

        if (getColumns(state).length !== getColumnsWidths(state).length) {
            resetColumnWidths(state);
            if (getData(state).length > 0) {
                // when there are column changes, update the active cell
                syncActiveCell(state);
            }
        } else if (hasDefinedColumnsWidths(state)) {
            adjustColumnsSize(this.template, state);
        }
        if (state.keyboardMode === 'NAVIGATION') {
            updateTabIndexActiveCell(state);
            updateTabIndexActiveRow(state);
        }
        // if there is previously focused cell which was deleted set focus from celltofocus next
        if (state.cellToFocusNext) {
            setFocusActiveCell(this.template, this.state);
        }
    }

    get computedTableHeaderClass() {
        if (this.state.hideTableHeader) {
            return 'slds-assistive-text';
        }
        return undefined;
    }

    get computedScrollerStyle() {
        return getTableWidthStyle(this.state);
    }

    get computedTableClass() {
        return classSet(
            'slds-table slds-table_header-fixed slds-table_bordered slds-table_edit'
        )
            .add({ 'slds-table_resizable-cols': this.hasResizebleColumns })
            .add({ 'slds-tree slds-table_tree': hasTreeDataType(this.state) })
            .toString();
    }

    get computedTableRole() {
        return hasTreeDataType(this.state) ? 'treegrid' : 'grid';
    }

    get computedTableStyle() {
        return ['table-layout:fixed', getTableWidthStyle(this.state)].join(';');
    }

    get computedTbodyStyle() {
        if (
            hasRowNumberColumn(this.state) &&
            getRowNumberOffset(this.state) >= 0
        ) {
            return (
                'counter-reset: row-number ' + getRowNumberOffset(this.state)
            );
        }
        return '';
    }

    get hasSelectableRows() {
        return !this.state.hideCheckboxColumn;
    }

    get hasResizebleColumns() {
        return !isResizeColumnDisabled(this.state);
    }

    get numberOfColumns() {
        return getColumns(this.state).length;
    }

    get showLoadingIndicator() {
        return isLoading(this.state);
    }

    get scrollerXStyles() {
        const styles = {
            height: '100%',
        };

        if (this.showStatusBar) {
            styles['padding-bottom'] = '3rem';
        }

        return Object.entries(styles)
            .map(([key, value]) => key + ':' + value)
            .join(';');
    }

    get showStatusBar() {
        return isInlineEditTriggered(this.state) && !this.suppressBottomBar;
    }

    get tableError() {
        return getTableError(this.state);
    }

    handleUpdateColumnSort(event) {
        event.stopPropagation();
        const { fieldName, sortDirection } = event.detail;

        this.fireSortedColumnChange(fieldName, sortDirection);
    }

    handleHorizontalScroll(event) {
        handleInlineEditPanelScroll.call(this, event);
    }

    handleVerticalScroll(event) {
        if (this.enableInfiniteLoading) {
            handleLoadMoreCheck.call(this, event);
        }

        handleInlineEditPanelScroll.call(this, event);
    }

    fireSelectedRowsChange(selectedRows) {
        const event = new CustomEvent('rowselection', {
            detail: { selectedRows },
        });

        this.dispatchEvent(event);
    }

    fireSortedColumnChange(fieldName, sortDirection) {
        const event = new CustomEvent('sort', {
            detail: { fieldName, sortDirection },
        });
        this.dispatchEvent(event);
    }

    fireOnResize() {
        const event = new CustomEvent('resize', {
            detail: {
                columnWidths: getCustomerColumnWidths(this.state),
            },
        });
        this.dispatchEvent(event);
    }

    handleResizeColumn(event) {
        event.stopPropagation();
        const { colIndex, widthDelta } = event.detail;
        if (widthDelta !== 0) {
            resizeColumnWithDelta(this.state, colIndex, widthDelta);
            this.fireOnResize();
        }
    }

    get tableTabIndex() {
        return this.state.focusIsInside ? '-1' : '0';
    }

    handleTableFocus() {
        // dont modify the state if we can't focus on elements within the table
        if (!this.state.activeCell) {
            return;
        }

        this.state.tabindex = false; // Safari don't like tabindex=-1
        if (this.state.rowMode) {
            setFocusActiveRow(this.template, this.state);
        } else {
            setFocusActiveCell(
                this.template,
                this.state,
                NAVIGATION_DIR.USE_CURRENT
            );
        }
    }

    handleCellFocusByClick(event) {
        event.stopPropagation();
        const { rowKeyValue, colKeyValue } = event.detail;
        const { state } = this;
        if (!isActiveCell(state, rowKeyValue, colKeyValue)) {
            if (state.rowMode && state.activeCell) {
                unsetRowNavigationMode(state);
                const { rowIndex } = getIndexesActiveCell(state);
                updateTabIndexRow(state, rowIndex, -1);
            }
            this.setActiveCell(rowKeyValue, colKeyValue);
        }
        if (!datatableHasFocus(state)) {
            setCellClickedForFocus(state);
        }
    }

    handleCellClick(event) {
        // check in case the target is null because of some reason like deletion
        if (event.target) {
            // handles the case when clicking on the margin/pading of the td/th
            const targetTagName = event.target.tagName.toLowerCase();

            if (targetTagName === 'td' || targetTagName === 'th') {
                // get the row/col key value from the primitive cell.
                const { rowKeyValue, colKeyValue } = event.target.querySelector(
                    ':first-child'
                );

                const { state } = this;
                if (
                    state.rowMode ||
                    !isActiveCell(state, rowKeyValue, colKeyValue)
                ) {
                    if (state.rowMode && state.activeCell) {
                        unsetRowNavigationMode(state);
                        const { rowIndex } = getIndexesActiveCell(state);
                        updateTabIndexRow(state, rowIndex, -1);
                    }
                    this.setActiveCell(rowKeyValue, colKeyValue);
                }

                if (!datatableHasFocus(state)) {
                    setCellClickedForFocus(state);
                }
            }
        }
    }

    setActiveCell(rowKeyValue, colKeyValue) {
        const { template, state } = this;
        const { rowIndex, colIndex } = getIndexesByKeys(
            state,
            rowKeyValue,
            colKeyValue
        );
        setBlurActiveCell(template, state);
        updateActiveCell(state, rowKeyValue, colKeyValue);
        addFocusStylesToActiveCell(template, state);
        updateTabIndex(state, rowIndex, colIndex, 0);
    }

    handleFalseCellBlur(event) {
        event.stopPropagation();
        const { template, state } = this;
        const { rowKeyValue, colKeyValue } = event.detail;
        if (!isActiveCell(state, rowKeyValue, colKeyValue)) {
            this.setActiveCell(rowKeyValue, colKeyValue);
        }
        setFocusActiveCell(template, state);
    }

    /**
     * Returns data in each selected row.
     * @returns {array} An array of data in each selected row.
     */
    @api
    getSelectedRows() {
        const data = unwrap(getData(this.state));
        return this.state.rows.reduce((prev, row, index) => {
            if (row.isSelected) {
                prev.push(data[index]);
            }
            return prev;
        }, []);
    }

    attachListeners() {
        const resizeTarget = unwrap(
            this.template.querySelector('.dt-width-observer')
        );
        this.privateWidthObserver = new ResizeSensor(
            resizeTarget,
            debounce(() => {
                // since this event handler is debounced, it might be the case that at the time the handler is called,
                // the element is disconnected (this.hasDetachedListeners)
                if (!this.hasDetachedListeners) {
                    adjustColumnsSize(this.template, this.state);
                }
            }, 200)
        );

        this.hasDetachedListeners = false;
    }

    handleTableFocusIn(event) {
        handleDatatableFocusIn.call(this, event);
    }

    handleTableFocusOut(event) {
        handleDatatableLosedFocus.call(this, event);
    }

    /**
     * @return {Object} containing the visible dimensions of the table { left, right, top, bottom, }
     */
    getViewableRect() {
        const scrollerX = this.template
            .querySelector('.slds-scrollable_x')
            .getBoundingClientRect();
        const scrollerY = this.template
            .querySelector('.slds-scrollable_y')
            .getBoundingClientRect();

        return {
            left: scrollerX.left,
            right: scrollerX.right,
            top: scrollerY.top,
            bottom: scrollerY.bottom,
        };
    }

    handleInlineEditFinish(event) {
        handleInlineEditFinish.call(this, event);
    }

    handleMassCheckboxChange(event) {
        handleMassCheckboxChange.call(this, event);
    }

    handleInlineEditSave(event) {
        event.stopPropagation();
        event.preventDefault();

        closeInlineEdit(this);
        const draftValues = this.draftValues;

        this.dispatchEvent(
            new CustomEvent('save', {
                detail: {
                    draftValues,
                },
            })
        );
    }

    handleInlineEditCancel(event) {
        event.stopPropagation();
        event.preventDefault();

        closeInlineEdit(this);

        const customerEvent = new CustomEvent('cancel', {
            cancelable: true,
        });
        this.dispatchEvent(customerEvent);

        if (!customerEvent.defaultPrevented) {
            cancelInlineEdit(this);
        }
    }

    handleTableKeydown(event) {
        handleKeyDown.call(this, event);
    }
}
