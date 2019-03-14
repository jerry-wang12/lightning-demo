import { createElement } from 'lwc';
import { shadowQuerySelector } from 'lightning/testUtils';
import LightningFileUpload from 'lightning/fileUpload';

describe('testFileUpload', () => {
    it('default rendering', () => {
        const element = createElement('lightning-file-upload', {
            is: LightningFileUpload,
        });
        element.recordId = '006R0000001sE5kIAE';
        element.label = 'required label';
        element.name = 'required name';
        document.body.appendChild(element);
        expect(element).toMatchSnapshot();
    });

    it('accepts label parameter', () => {
        const element = createElement('lightning-file-upload', {
            is: LightningFileUpload,
        });
        element.recordId = '006R0000001sE5kIAE';
        element.label = 'Attachments';
        element.name = 'required name';
        document.body.appendChild(element);
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('can accept multiple files', () => {
        const element = createElement('lightning-file-upload', {
            is: LightningFileUpload,
        });
        element.multiple = true;
        element.recordId = '006R0000001sE5kIAE';
        element.label = 'required label';
        element.name = 'required name';
        document.body.appendChild(element);
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('can be disabled', () => {
        const element = createElement('lightning-file-upload', {
            is: LightningFileUpload,
        });
        element.disabled = true;
        element.recordId = '006R0000001sE5kIAE';
        element.label = 'required label';
        element.name = 'required name';
        document.body.appendChild(element);
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('can take accept parameter to filter files', () => {
        const element = createElement('lightning-file-upload', {
            is: LightningFileUpload,
        });
        element.accept = ['.jpg', '.jpeg'];
        element.recordId = '006R0000001sE5kIAE';
        element.label = 'required label';
        element.name = 'required name';
        document.body.appendChild(element);
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('accepts record Id parameter', () => {
        const element = createElement('lightning-file-upload', {
            is: LightningFileUpload,
        });
        element.recordId = '006R0000001sE5kIAE';
        element.label = 'required label';
        element.name = 'required name';
        document.body.appendChild(element);
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('should be disabled if a valid record id is not provided', () => {
        const element = createElement('lightning-file-upload', {
            is: LightningFileUpload,
        });
        element.label = 'required label';
        element.name = 'required name';
        document.body.appendChild(element);
        return Promise.resolve()
            .then(() => {
                const lightningInput = shadowQuerySelector(
                    element,
                    'lightning-input'
                );

                expect(
                    shadowQuerySelector(lightningInput, 'input').hasAttribute(
                        'disabled'
                    )
                ).toBe(true);
            })
            .then(() => {
                element.recordId = 'required-record-id';
            })
            .then(() => {
                const lightningInput = shadowQuerySelector(
                    element,
                    'lightning-input'
                );

                expect(
                    shadowQuerySelector(lightningInput, 'input').hasAttribute(
                        'disabled'
                    )
                ).toBe(false);
            })
            .then(() => {
                element.recordId = null;
            })
            .then(() => {
                const lightningInput = shadowQuerySelector(
                    element,
                    'lightning-input'
                );

                expect(
                    shadowQuerySelector(lightningInput, 'input').hasAttribute(
                        'disabled'
                    )
                ).toBe(true);
            });
    });
});
