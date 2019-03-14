import { createElement } from 'lwc';
import Element from 'lightning/datatable';
import { shadowQuerySelector } from 'lightning/testUtils';

const createDatatable = props => {
    const element = createElement('lightning-datatable', { is: Element });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

describe('lightning-datatable component', () => {
    it('should render empty table when no keyField is passed', () => {
        const data = [{ name: 'Reinier' }];
        const columns = [{ label: 'Name', type: 'text', fieldName: 'name' }];
        const element = createDatatable({
            data,
            columns,
        });
        const table = shadowQuerySelector(element, 'table');
        expect(table.children).toHaveLength(0);
    });
});
