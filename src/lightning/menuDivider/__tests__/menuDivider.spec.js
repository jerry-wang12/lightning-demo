import { createElement } from 'lwc';
import Element from 'lightning/menuDivider';

const createMenuDivider = () => {
    const element = createElement('lightning-menu-divider', { is: Element });
    document.body.appendChild(element);
    return element;
};

describe('lightning-menu-divider', () => {
    it('default state', () => {
        const menuDivider = createMenuDivider();

        return Promise.resolve().then(() => {
            expect(menuDivider).toMatchSnapshot();
        });
    });

    it('if variant attribute is set to `compact`, element should have the CSS class `slds-has-divider_top`', () => {
        const menuDivider = createMenuDivider();
        menuDivider.variant = 'compact';

        return Promise.resolve().then(() => {
            expect(
                menuDivider.classList.contains('slds-has-divider_top')
            ).toBeTruthy();
        });
    });

    it('if variant attribute is set to invalid value, element should have the default CSS class `slds-has-divider_top-space`', () => {
        const menuDivider = createMenuDivider();
        menuDivider.variant = 'blahblah';

        return Promise.resolve().then(() => {
            expect(
                menuDivider.classList.contains('slds-has-divider_top-space')
            ).toBeTruthy();
        });
    });
});
