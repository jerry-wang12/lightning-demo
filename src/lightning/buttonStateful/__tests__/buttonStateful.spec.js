import { createElement } from 'lwc';
import Element from 'lightning/buttonStateful';

const createButtonStateful = () => {
    const element = createElement('lightning-button-stateful', { is: Element });
    document.body.appendChild(element);
    return element;
};

describe('lightning-button-stateful', () => {
    it('default', () => {
        const element = createButtonStateful();

        element.labelWhenOff = 'Follow';
        element.labelWhenOn = 'Following';
        element.labelWhenHover = 'Unfollow';

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    // test iconName values render as expected
    describe('testIconNames', () => {
        it('Expected icons should render for each state', () => {
            const element = createButtonStateful();

            element.iconNameWhenOff = 'utility:add';
            element.iconNameWhenOn = 'utility:check';
            element.iconNameWhenHover = 'utility:close';
            element.labelWhenOff = 'Follow';
            element.labelWhenOn = 'Following';
            element.labelWhenHover = 'Unfollow';

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('Invalid or empty icon names should render empty icon elements', () => {
            const element = createButtonStateful();

            element.iconNameWhenOff = 'utility:';
            element.iconNameWhenOn = '';
            element.iconNameWhenHover = 'utility:pickle';
            element.labelWhenOff = 'Follow';
            element.labelWhenOn = 'Following';
            element.labelWhenHover = 'Unfollow';

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    // test variant values render as expected
    describe('Variant', () => {
        const createButtonStatefulWithVariant = variant => {
            const element = createButtonStateful();

            element.iconNameWhenOff = 'utility:add';
            element.iconNameWhenOn = 'utility:check';
            element.iconNameWhenHover = 'utility:close';
            element.labelWhenOff = 'Follow';
            element.labelWhenOn = 'Following';
            element.labelWhenHover = 'Unfollow';
            element.variant = variant;

            return element;
        };

        it('should add default classes on invalid variant', () => {
            const element = createButtonStatefulWithVariant('invalid');

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('should add correct classes on neutral variant', () => {
            const element = createButtonStatefulWithVariant('neutral');

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('should add correct classes on brand variant', () => {
            const element = createButtonStatefulWithVariant('brand');

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('should add correct classes on inverse variant', () => {
            const element = createButtonStatefulWithVariant('inverse');

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('should add correct classes on text variant', () => {
            const element = createButtonStatefulWithVariant('text');

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    // test label values render as expected
    describe('testLabels', () => {
        it('Expected labels should render for each state', () => {
            const element = createButtonStateful();

            element.labelWhenOff = 'Seek';
            element.labelWhenOn = 'Seeking';
            element.labelWhenHover = 'Ignore';

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('`labelWhenOn` value should be used when `labelWhenHover` is missing or invalid', () => {
            const element = createButtonStateful();

            element.labelWhenOff = 'Seek';
            element.labelWhenOn = 'Seeking';

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });
});
