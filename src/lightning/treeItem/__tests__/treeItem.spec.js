import { createElement } from 'lwc';
import Element from 'lightning/treeItem';

describe('lightning-tree-item', () => {
    it('renders leaf tree-item', () => {
        const element = createElement('lightning-tree-item', { is: Element });
        document.body.appendChild(element);
        element.isRoot = false;
        element.label = 'label';
        element.href = 'href';
        element.metatext = 'metatext';
        element.nodeRef = {
            expanded: false,
        };
        element.isExpanded = false;
        element.isDisabled = false;
        element.nodename = '2234';
        element.nodeKey = '1.1';
        element.isLeaf = true;

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
