import { createElement } from 'lwc';
import Element from 'lightning/tree';
import { getTreeNested, getTree } from '../treeDataGenerator';

describe('lightning-tree', () => {
    it('simple tree', () => {
        const element = createElement('lightning-tree', { is: Element });
        document.body.appendChild(element);
        element.items = getTree('Snapshot_Tree_Simple', 4);
        element.header = 'Sample Tree';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('nested tree', () => {
        let i = 0;
        const levelOptions = {
            [++i]: 3,
            [++i]: 3,
        };
        const element = createElement('lightning-tree', { is: Element });
        document.body.appendChild(element);
        element.items = getTreeNested('Snapshot_Tree_Nested', levelOptions);
        element.header = 'Sample Tree';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('nested tree with metatext on nodes', () => {
        let i = 0;
        const levelOptions = {
            [++i]: 3,
            [++i]: 3,
        };
        const element = createElement('lightning-tree', { is: Element });
        document.body.appendChild(element);
        element.items = getTreeNested(
            'Snapshot_Tree_Nested_With_Metatext',
            levelOptions,
            true
        );
        element.header = 'Sample Tree';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
