import { LightningElement, api, track, unwrap } from 'lwc';
import { TreeData } from './treeData';
import { keyCodes } from 'lightning/utilsPrivate';

/**
 * Displays a nested tree.
 */
export default class LightningTree extends LightningElement {
    /**
     * The text that's displayed as the tree heading.
     * @type {string}
     */
    @api header;

    @track _currentFocusedItem = null;
    @track _childNodes;
    @track _key;
    @track _focusedChild = null;
    @track _items = [];

    _defaultFocused = { key: '1', parent: '0' };

    constructor() {
        super();
        this.callbackMap = {};
        this.treedata = null;
        this.template.addEventListener(
            'privateitemkeydown',
            this.handleKeydown.bind(this)
        );
        this.template.addEventListener(
            'privateitemclick',
            this.handleClick.bind(this)
        );
        this.template.addEventListener(
            'privateregisteritem',
            this.handleRegistration.bind(this)
        );
    }

    /**
     * An array of key-value pairs that describe the tree. See the Documentation tab for more information.
     * @type {array}
     */
    @api
    get items() {
        return this._items || [];
    }

    set items(value) {
        // TODO: This is an escape hatch, and we should only do it in "legacy" mode
        // which is when the component can mutate the original data
        // Ideally we should only allow this when called from Aura land.
        this._items = unwrap(value);
        this.normalizeData();
    }

    get children() {
        return this._childNodes;
    }

    get rootElement() {
        return this._key;
    }

    get focusedChild() {
        return this._focusedChild;
    }
    /**
     * Check the input data for circular references or cycles,
     * Build a list of items in depth-first manner for traversing the tree by keyboard
     * This list - treeItems is an array of data-keys of the nodes using which nodes can be accessed by querySelector
     * Build a list of visible items to be checked while traversing the tree, at any point any branch is expanded
     * or collapsed, this list has to be kept updated
     */
    normalizeData() {
        this.treedata = new TreeData();
        const treeRoot = this.treedata.parse(this.items);
        this._childNodes = treeRoot ? treeRoot.children : [];
        this._key = this._childNodes.length > 0 ? treeRoot.key : null;
        if (this._key) {
            this.syncCurrentFocused();
        }
    }

    syncCurrentFocused() {
        if (
            !this._currentFocusedItem ||
            !this.treedata.isValidCurrent(this._currentFocusedItem)
        ) {
            this._currentFocusedItem = this._defaultFocused;
        }
        this.updateCurrentFocusedChild();
    }

    updateCurrentFocusedChild() {
        if (this._key === this._currentFocusedItem.parent) {
            this._focusedChild = this.treedata.getChildNum(
                this._currentFocusedItem.key
            );
        } else {
            this.treedata.updateCurrentFocusedChild(
                this._currentFocusedItem.key
            );
        }
    }

    handleClick(event) {
        const key = event.detail.key;
        const target = event.detail.target;
        const item = this.treedata.getItem(key);
        if (item) {
            if (target === 'chevron') {
                if (item.treeNode.nodeRef.expanded) {
                    this.collapseBranch(item.treeNode);
                } else {
                    this.expandBranch(item.treeNode);
                }
            } else {
                this.dispatchSelectEvent(item.treeNode);
                this.setFocusToItem(item);
            }
        }
    }

    expandBranch(node) {
        if (!node.isLeaf && !node.isDisabled) {
            node.nodeRef.expanded = true;
        }
    }

    collapseBranch(node) {
        if (!node.isLeaf && !node.isDisabled) {
            node.nodeRef.expanded = false;
            this.treedata.updateVisibleTreeItemsOnCollapse(node.key);
        }
    }

    dispatchSelectEvent(node) {
        if (!node.isDisabled) {
            const customEvent = new CustomEvent('select', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: { name: node.name },
            });
            this.dispatchEvent(customEvent);
        }
    }

    handleKeydown(event) {
        event.preventDefault();
        event.stopPropagation();
        const item = this.treedata.getItem(event.detail.key);
        switch (event.detail.keyCode) {
            case keyCodes.up:
                this.setFocusToPrevItem();
                break;
            case keyCodes.down:
                this.setFocusToNextItem();
                break;
            case keyCodes.home:
                this.setFocusToFirstItem();
                break;
            case keyCodes.end:
                this.setFocusToLastItem();
                break;
            case keyCodes.right:
                this.expandBranch(item.treeNode);
                break;
            case keyCodes.left:
                if (item.treeNode.nodeRef.expanded && !item.treeNode.isLeaf) {
                    this.collapseBranch(item.treeNode);
                } else {
                    // if this is a leaf, move focus to its parent group and collapse it, move focus there
                    // if this is a collapsed group, move focus to its parent group and collapse it, move focus there
                    this.handleParentCollapse(event.detail.key);
                }
                break;

            default:
                break;
        }
    }

    /** Sets focus to given node item with data-key, makes this node as focusable
     * and all other non-focusable tabindex -1
     * @param {String} item - item in the index which has to receive focus
     */
    setFocusToItem(item) {
        const currentFocused = this.treedata.getItemAtIndex(
            this.treedata.currentFocusedItemIndex
        );
        if (currentFocused && this.callbackMap[currentFocused.parent]) {
            this.callbackMap[currentFocused.parent].unfocusCallback(
                currentFocused.key
            );
        }
        if (item) {
            this._currentFocusedItem = this.treedata.updateCurrentFocusedItemIndex(
                item.index
            );
            if (this.callbackMap[item.parent]) {
                this.callbackMap[item.parent].focusCallback(item.key, true);
            }
        }
    }

    /**
     * If its not the last item node in the tree, moves focus to next visible item in the tree
     * If its last item node, focus stays as it is
     */
    setFocusToNextItem() {
        const nextNode = this.treedata.findNextNodeToFocus();
        if (nextNode && nextNode.index !== -1) {
            this.setFocusToItem(nextNode);
        }
    }

    /**
     * If its not the first item node in the tree, moves focus to previous visible item in the tree
     * If its first item node, focus stays as it is
     */
    setFocusToPrevItem() {
        const prevNode = this.treedata.findPrevNodeToFocus();
        if (prevNode && prevNode.index !== -1) {
            this.setFocusToItem(prevNode);
        }
    }

    /**
     * Moves focus to the first item node
     * */
    setFocusToFirstItem() {
        const node = this.treedata.findFirstNodeToFocus();
        if (node && node.index !== -1) {
            this.setFocusToItem(node);
        }
    }

    /**
     * Moves focus to the last item node which is visible in depth first manner
     * */
    setFocusToLastItem() {
        const lastNode = this.treedata.findLastNodeToFocus();
        if (lastNode && lastNode.index !== -1) {
            this.setFocusToItem(lastNode);
        }
    }

    handleFocusFirst(event) {
        event.stopPropagation();
        this.setFocusToFirstItem();
    }

    handleFocusLast(event) {
        event.stopPropagation();
        this.setFocusToLastItem();
    }

    handleFocusNext(event) {
        event.stopPropagation();
        this.setFocusToNextItem();
    }

    handleFocusPrev(event) {
        event.stopPropagation();
        this.setFocusToPrevItem();
    }

    handleChildBranchCollapse(event) {
        event.stopPropagation();
        this.treedata.updateVisibleTreeItemsOnCollapse(event.detail.key);
    }

    /**
     * For leaf arrow key, in case it is leaf or already collapsed node
     * go to parent and call its collapse callback
     * @param {String} key of the parent to collapse
     */
    handleParentCollapse(key) {
        const item = this.treedata.getItem(key);
        if (item && item.level > 1) {
            // if not item at the level 1 which cant be collapsed further
            const parent = this.treedata.getItem(item.parent);
            this.collapseBranch(parent.treeNode);
            this.setFocusToItem(parent);
        }
    }

    handleRegistration(event) {
        const itemKey = event.detail.key;
        this.callbackMap[itemKey] = {
            focusCallback: event.detail.focusCallback,
            unfocusCallback: event.detail.unfocusCallback,
        };
        this.treedata.addVisible(itemKey);
        event.stopPropagation();
    }

    get hasChildren() {
        return this._items && this._items.length > 0;
    }
}
