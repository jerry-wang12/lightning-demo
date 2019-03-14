import { getTreeNode } from './treeNode';
import { assert } from 'lightning/utilsPrivate';

export class TreeData {
    constructor() {
        this._currentFocusedItemIndex = 0;
        this._treeItemsInTraversalOrder = [];
        this._visibleTreeItems = null;
        this._indices = {};
    }

    get treeItemsInTraversalOrder() {
        return this._treeItemsInTraversalOrder;
    }

    get visibleTreeItems() {
        return this._visibleTreeItems;
    }

    get currentFocusedItemIndex() {
        return this._currentFocusedItemIndex;
    }

    get indices() {
        return this._indices;
    }

    parse(data) {
        const root = {};
        root.items = data;
        const seen = new WeakSet();
        function buildTree(currentNode, parent, level, childNum) {
            if (isNodeValid(currentNode, level)) {
                const node = getTreeNode(
                    currentNode,
                    level,
                    parent ? parent.key : null,
                    childNum + 1
                );
                if (
                    parent &&
                    parent.visible &&
                    parent.isExpanded &&
                    !parent.isDisabled
                ) {
                    node.visible = true;
                }
                level++;
                seen.add(currentNode);

                if (node.key && parent) {
                    this.treeItemsInTraversalOrder.push(node.key);
                    this.indices[node.key] = {
                        index: this.treeItemsInTraversalOrder.length - 1,
                        key: node.key,
                        parent: parent.key,
                        level: node.level,
                        treeNode: node,
                    };
                }

                if (
                    currentNode.hasOwnProperty('items') &&
                    Array.isArray(currentNode.items)
                ) {
                    for (
                        let i = 0, length = currentNode.items.length;
                        i < length;
                        i++
                    ) {
                        const buildTreeFn = buildTree.bind(this);
                        buildTreeFn(currentNode.items[i], node, level, i);
                    }
                }

                if (parent) {
                    parent.children.push(node);
                    if (node.visible) {
                        parent.visibleItems.push(node.key);
                        parent.visibleItems.push.apply(
                            parent.visibleItems,
                            node.visibleItems
                        );
                    }
                    level--;
                }
                seen.delete(currentNode);
                return node;
            }
            return null;
        }
        function isNodeValid(currentNode, level) {
            const hasCycle = seen.has(currentNode);
            const hasLabel = level === 0 ? true : !!currentNode.label;
            assert(
                hasCycle === false,
                `Data passed to lightning:tree has circular reference. Skipping the node`
            );
            assert(
                hasLabel === true,
                `The node passed to lightning:tree has empty label. Skipping the node`
            );
            return !hasCycle && hasLabel;
        }
        const buildTreeFn = buildTree.bind(this);
        const tree = buildTreeFn(root, null, 0, 1);
        if (tree) {
            this._visibleTreeItems = new Set();
            tree.visibleItems.forEach(item => {
                this._visibleTreeItems.add(item);
            });
            return tree;
        }
        return null;
    }

    isVisible(treeItem) {
        return this.visibleTreeItems.has(treeItem);
    }

    findNextNodeToFocus() {
        const current = this.currentFocusedItemIndex;
        const treeitems = this.treeItemsInTraversalOrder;
        let nextNode = null;
        if (current < treeitems.length - 1) {
            for (let i = current + 1; i < treeitems.length; i++) {
                if (this.isVisible(treeitems[i])) {
                    nextNode = treeitems[i];
                    break;
                }
            }
        }
        return this.indices[nextNode];
    }

    findPrevNodeToFocus() {
        const current = this.currentFocusedItemIndex;
        const treeitems = this.treeItemsInTraversalOrder;
        let prevNode = null;
        if (current > 0) {
            for (let i = current - 1; i >= 0; i--) {
                if (this.isVisible(treeitems[i])) {
                    prevNode = treeitems[i];
                    break;
                }
            }
        }
        return this.indices[prevNode];
    }

    findFirstNodeToFocus() {
        return this.indices[this.treeItemsInTraversalOrder[0]];
    }

    findLastNodeToFocus() {
        let lastNode = null;
        const treeitems = this.treeItemsInTraversalOrder;
        for (let i = treeitems.length - 1; i >= 0; i--) {
            if (this.isVisible(treeitems[i])) {
                lastNode = treeitems[i];
                break;
            }
        }
        return this.indices[lastNode];
    }

    getItem(key) {
        return this.indices[key];
    }

    getItemAtIndex(index) {
        if (index > -1 && index < this.treeItemsInTraversalOrder.length) {
            return this.indices[this.treeItemsInTraversalOrder[index]];
        }
        return null;
    }

    addVisible(child) {
        this.visibleTreeItems.add(child);
    }

    removeVisible(child) {
        this.visibleTreeItems.delete(child);
    }

    /** Looks at all children and grandchildren of this branch
     * for all grandchildren make them not visible, remove them from visibleTreeItems set
     * for this looks at treeItems in order of traversal till we reach same level again
     * @param {string} branchCollapsed - key of the branch that was collapsed
     */
    updateVisibleTreeItemsOnCollapse(branchCollapsed) {
        const treeitems = this.treeItemsInTraversalOrder;
        const branchItem = this.getItem(branchCollapsed);
        const branchKeyIndex = branchItem.index;
        const branchLevel = branchItem.level;
        let level,
            child = null;
        for (let i = branchKeyIndex + 1; i < treeitems.length; i++) {
            child = this.getItem(treeitems[i]);
            level = child.level;
            if (level <= branchLevel) {
                break;
            }
            this.visibleTreeItems.delete(treeitems[i]);
        }
    }

    updateCurrentFocusedChild(focusedKey) {
        const item = this.getItem(focusedKey);
        if (item) {
            const parent = this.getItem(item.parent);
            if (parent) {
                parent.treeNode.focusedChild = this.getChildNum(item.key) - 1;
            }
        }
    }

    updateCurrentFocusedItemIndex(focused) {
        if (focused > -1 && focused < this.treeItemsInTraversalOrder.length) {
            this._currentFocusedItemIndex = focused;
            return this.getItemAtIndex(this.currentFocusedItemIndex);
        }
        return null;
    }

    isValidCurrent(currentFocusedItem) {
        return !!(
            currentFocusedItem.index &&
            this.getItemAtIndex(currentFocusedItem.index)
        );
    }

    isCurrentFocusedNode(key) {
        return this.findIndex(key) === this.currentFocusedItemIndex;
    }

    findIndex(key) {
        return this.indices[key] !== undefined ? this.indices[key].index : -1;
    }

    getChildNum(key) {
        const idx = key.lastIndexOf('.');
        return idx > -1
            ? parseInt(key.substring(idx + 1), 10) - 1
            : parseInt(key, 10) - 1;
    }
}
