import { TreeData } from '../treeData';
import {
    generateNode,
    getTree,
    getTreeNested,
    getNode,
} from '../treeDataGenerator';

function getTreeCycles() {
    const items = [];
    const a = generateNode('CycleTree');
    items.push(a);
    const b = generateNode('CycleTree');
    a.items.push(b);
    const c = generateNode('CycleTree');
    b.items.push(c);
    c.items.push(a);
    return items;
}

function getTreeCycleWithOneHop() {
    const items = [];
    const a = generateNode('CycleTree');
    items.push(a);
    const b = generateNode('CycleTree');
    a.items.push(b);
    b.items.push(a);
    return items;
}

function getTreeCycleWithSelf() {
    const items = [];
    const a = generateNode('CycleTree');
    items.push(a);
    const b = generateNode('CycleTree');
    items.push(b);
    b.items.push(b);
    return items;
}

function getTreeRepeatingNodes() {
    const items = [];
    const a = generateNode('RepeatingTree');
    const b = generateNode('RepeatingTree');
    const c = generateNode('RepeatingTree');
    const d = generateNode('RepeatingTree');
    const e = generateNode('RepeatingTree');
    const f = generateNode('RepeatingTree');
    items.push(a);
    a.items.push(b);
    b.items.push(c);
    c.items.push(d);

    items.push(d);
    items.push(e);
    items.push(f);
    return items;
}

describe('correctly returns array of TreeNodes', () => {
    it('returns arrays of TreeNodes for one level tree', () => {
        const data = new TreeData();
        const parsed = data.parse(getTree('AccountTree', 3));
        expect(parsed.children).toHaveLength(3);
    });
    it('returns arrays of TreeNodes for nested tree', () => {
        const levelOptions = {
            1: 1,
            2: 2,
            3: 3,
        };
        const data = new TreeData();
        const parsed = data.parse(
            getTreeNested('AcccoutsNesting', levelOptions)
        );
        expect(parsed.children).toHaveLength(1);
    });
    it('returns arrays of TreeNodes for deeply nested tree', () => {
        let i = 0;
        const levelOptions = {
            [++i]: 3,
            [++i]: 3,
            [++i]: 3,
            [++i]: 3,
            [++i]: 3,
        };
        const data = new TreeData();
        data.parse(getTreeNested('AcccoutsNesting', levelOptions));
        expect(data.treeItemsInTraversalOrder).toHaveLength(363);
    });
    it('sets attributes of a node correctly', () => {
        let i = 0;
        const levelOptions = {
            [++i]: 3,
            [++i]: 3,
            [++i]: 3,
            [++i]: 3,
            [++i]: 3,
        };
        const data = new TreeData();
        const parsed = data.parse(
            getTreeNested('AccountLabel', levelOptions, true)
        );
        const leafNode = getNode(parsed.children, '1.1.1.1');

        expect(leafNode.key).toBe('1.1.1.1');
        expect(leafNode.name).not.toBe(undefined);
        const computedLabel = 'AccountLabel_' + leafNode.name;
        expect(leafNode.label).toBe(computedLabel);
        expect(leafNode.metatext).toBe('meta &middot; ' + leafNode.name);
        expect(leafNode.level).toBe(4);
        expect(leafNode.isExpanded).toBe(true);
        expect(leafNode.isDisabled).toBe(false);
        // eslint-disable-next-line no-script-url
        expect(leafNode.href).toBe('javascript:void(0)');
    });
    it('returns empty for no input', () => {
        const data = new TreeData();
        const parsed = data.parse(null);
        expect(parsed.children).toHaveLength(0);
    });
    it('returns empty for non-array input', () => {
        const data = new TreeData();
        const parsed = data.parse({ name: 'x', label: 'foo' });
        expect(parsed.children).toHaveLength(0);
    });
});

describe('detects cycle correctly', () => {
    it('detects cycle in same branch', () => {
        const data = new TreeData();
        try {
            data.parse(getTreeCycles());
        } catch (e) {
            expect(e.message).toBe(
                'Data passed to lightning:tree has circular reference. Skipping the node'
            );
        }
    });
    it('detects cycle for one hop', () => {
        const data = new TreeData();
        try {
            data.parse(getTreeCycleWithOneHop());
        } catch (e) {
            expect(e.message).toBe(
                'Data passed to lightning:tree has circular reference. Skipping the node'
            );
        }
    });
    it('detects cycle with self', () => {
        const data = new TreeData();

        try {
            data.parse(getTreeCycleWithSelf());
        } catch (e) {
            expect(e.message).toBe(
                'Data passed to lightning:tree has circular reference. Skipping the node'
            );
        }
    });
    it('allows repeating nodes in different branches', () => {
        const data = new TreeData();
        let parsed = null;
        try {
            parsed = data.parse(getTreeRepeatingNodes());
        } catch (e) {
            expect(e).toBe(undefined);
        }
        expect(parsed.children).toHaveLength(4);
    });
});

describe('generates items list in traversal order', () => {
    it('generates items in traversal order for one level tree', () => {
        const data = new TreeData();
        data.parse(getTree('AccountTree', 4));
        expect(data.treeItemsInTraversalOrder).toHaveLength(4);
        expect(data.treeItemsInTraversalOrder.toString()).toBe('1,2,3,4');
    });
    it('generates items in traversal order for nested tree', () => {
        const levelOptions = {
            1: 1,
            2: 2,
            3: 3,
        };
        const data = new TreeData();
        const parsed = data.parse(
            getTreeNested('AcccoutsNesting', levelOptions)
        );
        expect(parsed.children).toHaveLength(1);
        expect(data.treeItemsInTraversalOrder).toHaveLength(9);
        expect(data.treeItemsInTraversalOrder.toString()).toBe(
            '1,1.1,1.1.1,1.1.2,1.1.3,1.2,1.2.1,1.2.2,1.2.3'
        );
    });
});

describe('generates all visible items correctly', () => {
    it('generates visible items when all are collapsed', () => {
        const data = new TreeData();
        data.parse(getTree('AccountTree', 4));
        expect(data.visibleTreeItems.size).toBe(4);
    });
    it('generates visible items for tree with expanded branches', () => {
        const items = [];
        const a = generateNode('SetupTree', true);
        const b = generateNode('SetupTree', true);
        const c = generateNode('SetupTree');
        const d = generateNode('SetupTree');
        const e = generateNode('SetupTree');
        const f = generateNode('SetupTree');
        const leafs = getTree('SetupTree', 4);
        items.push(a);
        items.push(d);
        items.push(e);
        items.push(f);
        a.items.push(b);
        b.items.push(c);
        b.items = b.items.concat(leafs);
        c.items.push(d);
        const data = new TreeData();
        data.parse(items);
        expect(data.visibleTreeItems.size).toBe(10);
    });
    it('generates visible items for partially expanded tree', () => {
        const items = [];
        const a = generateNode('SetupTree', true);
        const b = generateNode('SetupTree');
        const c = generateNode('SetupTree');
        const d = generateNode('SetupTree');
        const e = generateNode('SetupTree');
        const f = generateNode('SetupTree');
        const leafs = getTree('SetupTree', 4);
        items.push(a);
        items.push(d);
        items.push(e);
        items.push(f);
        a.items.push(b);
        b.items.push(c);
        b.items = b.items.concat(leafs);
        c.items.push(d);
        const data = new TreeData();
        data.parse(items);
        expect(data.visibleTreeItems.size).toBe(5);
    });
});

describe('finds the nodes to focus correctly', () => {
    describe('findFirstNodeToFocus', () => {
        it('findFirstNodeToFocus finds first node', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => ['1']),
            });
            const indices = {};
            indices['1'] = { key: '1' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findFirstNodeToFocus().key).toBe('1');
        });
    });
    describe('findLastNodeToFocus', () => {
        it('findLastNodeToFocus finds last node in single level tree', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => ['1', '2', '3']),
            });
            const indices = {};
            indices['2'] = { key: '2' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(() => new Set(['2'])),
            });
            expect(data.findLastNodeToFocus().key).toBe('2');
        });
        it('findLastNodeToFocus finds last child in deeply nested tree', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => [
                    '1',
                    '1.1',
                    '1.1.1',
                    '1.2.1',
                    '2',
                    '2.1',
                    '2.1.1',
                    '2.2',
                ]),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(() => new Set(['2.2'])),
            });
            const indices = {};
            indices['2.2'] = { key: '2.2' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findLastNodeToFocus().key).toBe('2.2');
        });
        it('findLastNodeToFocus finds last child which is visible', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => [
                    '1',
                    '1.1',
                    '1.1.1',
                    '1.2.1',
                    '2',
                    '2.1',
                    '2.1.1',
                    '2.2',
                ]),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(() => new Set(['2.1.1'])),
            });
            const indices = {};
            indices['2.1.1'] = { key: '2.1.1' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findLastNodeToFocus().key).toBe('2.1.1');
        });
        it('findLastNodeToFocus goes all the way to the first child', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => [
                    '1',
                    '1.1',
                    '1.1.1',
                    '1.2.1',
                    '2',
                    '2.1',
                    '2.1.1',
                    '2.2',
                ]),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(() => new Set(['1'])),
            });
            const indices = {};
            indices['1'] = { key: '1' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findLastNodeToFocus().key).toBe('1');
        });
    });
    describe('findPrevNodeToFocus', () => {
        it('findPrevNodeToFocus finds prev node when prev node is available', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => [
                    '1',
                    '1.1',
                    '1.1.1',
                    '1.2.1',
                    '2',
                    '2.1',
                    '2.1.1',
                    '2.2',
                ]),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(() => new Set(['1', '2', '1.1'])),
            });
            Object.defineProperty(data, '_currentFocusedItemIndex', {
                get: jest.fn(() => 2),
                set: jest.fn(idx => {}), // eslint-disable-line no-unused-vars
            });
            const indices = {};
            indices['1.1'] = { key: '1.1' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findPrevNodeToFocus().key).toBe('1.1');
        });
        it('findPrevNodeToFocus finds first node', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => ['1', '2', '3', '3.1', '3.2', '3.3']),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(
                    () => new Set(['1', '2', '3', '3.1', '3.2', '3.3'])
                ),
            });
            Object.defineProperty(data, '_currentFocusedItemIndex', {
                get: jest.fn(() => 1),
                set: jest.fn(idx => {}), // eslint-disable-line no-unused-vars
            });
            const indices = {};
            indices['1'] = { key: '1' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findPrevNodeToFocus().key).toBe('1');
        });
        it('findPrevNodeToFocus finds null when focus is already on the first node', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => ['1', '2', '3', '3.1', '3.2', '3.3']),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(
                    () => new Set(['1', '2', '3', '3.1', '3.2', '3.3'])
                ),
            });
            Object.defineProperty(data, '_currentFocusedItemIndex', {
                get: jest.fn(() => 0),
                set: jest.fn(idx => {}), // eslint-disable-line no-unused-vars
            });
            const indices = {};
            indices['1'] = { key: '1' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findPrevNodeToFocus()).toBe(undefined);
        });
    });
    describe('findNextNodeToFocus', () => {
        it('findNextNodeToFocus finds next node when next node is available', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => [
                    '1',
                    '1.1',
                    '1.1.1',
                    '1.2.1',
                    '2',
                    '2.1',
                    '2.1.1',
                    '2.2',
                ]),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(() => new Set(['1', '2', '2.1'])),
            });
            Object.defineProperty(data, '_currentFocusedItemIndex', {
                get: jest.fn(() => 0),
                set: jest.fn(idx => {}), // eslint-disable-line no-unused-vars
            });
            const indices = {};
            indices['2'] = { key: '2' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findNextNodeToFocus().key).toBe('2');
        });
        it('findNextNodeToFocus finds last node', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => ['1', '2', '3', '3.1', '3.2', '3.3']),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(
                    () => new Set(['1', '2', '3', '3.1', '3.2', '3.3'])
                ),
            });
            Object.defineProperty(data, '_currentFocusedItemIndex', {
                get: jest.fn(() => 4),
                set: jest.fn(idx => {}), // eslint-disable-line no-unused-vars
            });
            const indices = {};
            indices['3.3'] = { key: '3.3' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findNextNodeToFocus().key).toBe('3.3');
        });
        it('findNextNodeToFocus finds null when focus is already on last node', () => {
            const data = new TreeData();
            Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                get: jest.fn(() => ['1', '2', '3', '3.1', '3.2', '3.3']),
            });
            Object.defineProperty(data, '_visibleTreeItems', {
                get: jest.fn(
                    () => new Set(['1', '2', '3', '3.1', '3.2', '3.3'])
                ),
            });
            Object.defineProperty(data, '_currentFocusedItemIndex', {
                get: jest.fn(() => 5),
                set: jest.fn(idx => {}), // eslint-disable-line no-unused-vars
            });
            const indices = {};
            indices['2'] = { key: '2' };
            Object.defineProperty(data, '_indices', {
                get: jest.fn(() => indices),
            });
            expect(data.findNextNodeToFocus()).toBe(undefined);
        });
    });

    describe('updates the visibile items correctly', () => {
        describe('updateVisibleTreeItemsOnCollapse', () => {
            it('updateVisibleTreeItemsOnCollapse updates items in deeply nested case', () => {
                const data = new TreeData();
                Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                    get: jest.fn(() => [
                        '1',
                        '1.1',
                        '1.2',
                        '1.2.1',
                        '1.2.2',
                        '2',
                        '3',
                    ]),
                });
                const indices = {};
                indices['1'] = { key: '1', level: 1, parent: null, index: 0 };
                indices['1.1'] = {
                    key: '1.1',
                    level: 2,
                    parent: '1',
                    index: 1,
                };
                indices['1.2'] = {
                    key: '1.2',
                    level: 2,
                    parent: '1',
                    index: 2,
                };
                indices['1.2.1'] = {
                    key: '1.2.1',
                    level: 3,
                    parent: '1.2',
                    index: 3,
                };
                indices['1.2.2'] = {
                    key: '1.2.2',
                    level: 3,
                    parent: '1.2',
                    index: 4,
                };
                indices['2'] = { key: '2', level: 1, parent: null, index: 5 };
                indices['3'] = { key: '3', level: 1, parent: null, index: 6 };
                Object.defineProperty(data, '_indices', {
                    get: jest.fn(() => indices),
                });
                const vSet = new Set([
                    '1',
                    '1.1',
                    '1.2',
                    '1.2.1',
                    '1.2.2',
                    '2',
                    '3',
                ]);
                Object.defineProperty(data, '_visibleTreeItems', {
                    get: jest.fn(() => vSet),
                });
                data.updateVisibleTreeItemsOnCollapse('1');
                expect(data.isVisible('1')).toBe(true);
                expect(data.isVisible('1.1')).toBe(false);
                expect(data.isVisible('1.2')).toBe(false);
                expect(data.isVisible('1.2.1')).toBe(false);
                expect(data.isVisible('1.2.2')).toBe(false);
                expect(data.isVisible('2')).toBe(true);
                expect(data.isVisible('3')).toBe(true);
            });
            it('updateVisibleTreeItemsOnCollapse keeps visible set unchanged', () => {
                const data = new TreeData();
                Object.defineProperty(data, '_treeItemsInTraversalOrder', {
                    get: jest.fn(() => [
                        '1',
                        '1.1',
                        '1.2',
                        '1.2.1',
                        '1.2.2',
                        '2',
                        '3',
                    ]),
                });
                const indices = {};
                indices['1'] = { key: '1', level: 1, parent: null, index: 0 };
                indices['1.1'] = {
                    key: '1.1',
                    level: 2,
                    parent: '1',
                    index: 1,
                };
                indices['1.2'] = {
                    key: '1.2',
                    level: 2,
                    parent: '1',
                    index: 2,
                };
                indices['1.2.1'] = {
                    key: '1.2.1',
                    level: 3,
                    parent: '1.2',
                    index: 3,
                };
                indices['1.2.2'] = {
                    key: '1.2.2',
                    level: 3,
                    parent: '1.2',
                    index: 4,
                };
                indices['2'] = { key: '2', level: 1, parent: null, index: 5 };
                indices['3'] = { key: '3', level: 1, parent: null, index: 6 };
                Object.defineProperty(data, '_indices', {
                    get: jest.fn(() => indices),
                });
                const vSet = new Set([
                    '1',
                    '1.1',
                    '1.2',
                    '1.2.1',
                    '1.2.2',
                    '2',
                    '3',
                ]);
                Object.defineProperty(data, '_visibleTreeItems', {
                    get: jest.fn(() => vSet),
                });
                data.updateVisibleTreeItemsOnCollapse('2');
                expect(data.isVisible('1')).toBe(true);
                expect(data.isVisible('1.1')).toBe(true);
                expect(data.isVisible('1.2')).toBe(true);
                expect(data.isVisible('1.2.1')).toBe(true);
                expect(data.isVisible('1.2.2')).toBe(true);
                expect(data.isVisible('2')).toBe(true);
                expect(data.isVisible('3')).toBe(true);
            });
        });
    });
});
