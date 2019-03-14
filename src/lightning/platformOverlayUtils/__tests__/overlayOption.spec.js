import { parseOptions } from '../overlayOptions';

describe('parseOptions', () => {
    it('modal', () => {
        const options = parseOptions({
            modal: 'Modal',
        });
        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
    });

    it('popover', () => {
        const options = parseOptions({
            popover: 'Popover',
        });
        expect(options.panelType).toBe('panel');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.showCloseButton).toBe(false);
        expect(options.panelConfig.showPointer).toBe(true);
    });

    it('unsupported attribute', () => {
        const options = parseOptions({
            newAttribute: 'new attribute',
        });
        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.newAttribute).toBe(undefined);
    });

    it('popover, should retain showCloseButton setting', () => {
        const options = parseOptions({
            popover: 'popover',
            showCloseButton: true,
        });
        expect(options.panelType).toBe('panel');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.showCloseButton).toBe(true);
        expect(options.panelConfig.showPointer).toBe(true);
    });

    it('popover, should retain showPointer setting', () => {
        const options = parseOptions({
            popover: 'popover',
            showPointer: false,
        });
        expect(options.panelType).toBe('panel');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.showCloseButton).toBe(false);
        expect(options.panelConfig.showPointer).toBe(false);
    });

    it('bodyClass', () => {
        const param = {
            modal: 'modal',
            bodyClass: 'bodyClass',
        };

        const options = parseOptions(param);
        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.bodyClass).toBe(param.bodyClass);
    });

    it('body', () => {
        const param = {
            modal: 'modal',
            body: 'body',
        };

        const options = parseOptions(param);
        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.body).toBe(param.body);
    });

    it('modalClass', () => {
        const param = {
            modal: 'modal',
            modalClass: 'modalClass',
        };

        const options = parseOptions(param);
        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.modalClass).toBe(param.modalClass);
    });

    it('headerClass', () => {
        const param = {
            modal: 'modal',
            headerClass: 'headerClass',
        };

        const options = parseOptions(param);
        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.headerClass).toBe(param.headerClass);
    });

    it('footerClass', () => {
        const param = {
            modal: 'modal',
            footerClass: 'footerClass',
        };

        const options = parseOptions(param);
        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.footerClass).toBe(param.footerClass);
    });

    it('classNames', () => {
        const param = {
            popover: 'popover',
            classNames: 'classNames',
        };

        const options = parseOptions(param);
        expect(options.panelType).toBe('panel');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.classNames).toBe(param.classNames);
    });

    it('title set after header, will override header', () => {
        const param = {
            modal: 'modal',
            header: {},
            title: '123',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.header).toBe(null);
        expect(options.panelConfig.title).toBe(param.title);
    });

    it('header set after title, will override title', () => {
        const param = {
            modal: 'modal',
            title: '123',
            header: {},
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.header).toBe(param.header);
        expect(options.panelConfig.title).toBe(null);
    });

    it('header is present', () => {
        const param = {
            modal: 'modal',
            header: {},
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.header).toBe(param.header);
        expect(options.panelConfig.title).toBe(null);
    });

    it('header is string, change to use title', () => {
        const param = {
            modal: 'modal',
            header: 'title',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.header).toBe(null);
        expect(options.panelConfig.title).toBe(param.header);
    });

    it('closeCallback', () => {
        const param = {
            modal: 'modal',
            closeCallback: () => {},
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.onDestroy).toBe(param.closeCallback);
    });

    it('closeCallback must be a function', () => {
        const param = {
            modal: 'modal',
            closeCallback: '() => {}',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.onDestroy).toBe(undefined);
    });

    it('referenceSelector', () => {
        const param = {
            modal: 'modal',
            referenceSelector: 'true',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.referenceElementSelector).toBe(
            param.referenceSelector
        );
    });

    it('reference', () => {
        const param = {
            modal: 'modal',
            reference: 'true',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.referenceElement).toBe(param.reference);
    });

    it('direction', () => {
        const param = {
            modal: 'modal',
            direction: 'true',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.direction).toBe(param.direction);
    });

    it('padding', () => {
        const param = {
            modal: 'modal',
            padding: 321,
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.pad).toBe(321);
    });

    it('padding is normalized to number', () => {
        const param = {
            modal: 'modal',
            padding: 'true',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.pad).toBe(0);
    });

    it('flavor', () => {
        const param = {
            modal: 'modal',
            flavor: 'large',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.flavor).toBe(param.flavor);
    });

    it('advancedConfig', () => {
        const param = {
            modal: 'modal',
            advancedConfig: {
                a: 'b',
            },
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.advancedConfig).toBe(param.advancedConfig);
    });

    it('advancedConfig is not object', () => {
        const param = {
            modal: 'modal',
            advancedConfig: 12,
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.advancedConfig).toBe(undefined);
    });

    it('boundingElement', () => {
        const param = {
            modal: 'modal',
            boundingElement: '123',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.boundingElement).toBe(param.boundingElement);
    });

    it('pointerPadding', () => {
        const param = {
            modal: 'modal',
            pointerPadding: '123',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.pointerPad).toBe(123);
    });

    it('boundingBoxPadding', () => {
        const param = {
            modal: 'modal',
            boundingBoxPadding: '123',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.boundingBoxPad).toBe(123);
    });

    it('boundingBoxPadding is normalized to number', () => {
        const param = {
            modal: 'modal',
            boundingBoxPadding: 'ass',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.boundingBoxPad).toBe(0);
    });

    it('boxDirectionPadding', () => {
        const param = {
            modal: 'modal',
            boxDirectionPadding: '123',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.boxDirectionPad).toBe(123);
    });

    it('align', () => {
        const param = {
            modal: 'modal',
            align: '123',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.advancedConfig.align).toBe(123);
    });

    it('targetAlign', () => {
        const param = {
            modal: 'modal',
            targetAlign: '123',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.advancedConfig.targetAlign).toBe(123);
    });

    it('verticalPadding', () => {
        const param = {
            modal: 'modal',
            verticalPadding: '123',
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.advancedConfig.vertPad).toBe(123);
    });

    it('autoFocus', () => {
        const param = {
            modal: 'modal',
            autoFocus: false,
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.autoFocus).toBe(false);
    });

    it('trapFocus', () => {
        const param = {
            modal: 'modal',
            trapFocus: false,
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.trapFocus).toBe(false);
    });

    it('closeOnClickOut', () => {
        const param = {
            modal: 'modal',
            closeOnClickOut: false,
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.closeOnClickOut).toBe(false);
    });

    it('scopeScrollables', () => {
        const param = {
            modal: 'modal',
            scopeScrollables: false,
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.scopeScrollables).toBe(false);
    });

    it('useTransition', () => {
        const param = {
            modal: 'modal',
            useTransition: false,
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.useTransition).toBe(false);
    });

    it('closeAction', () => {
        const action = () => {};
        const param = {
            modal: 'modal',
            closeAction: action,
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.closeAction).toBe(action);
    });

    it('closeAction should be function', () => {
        const param = {
            modal: 'modal',
            closeAction: false,
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.closeAction).toBe(undefined);
    });

    it('customAttributes', () => {
        const param = {
            modal: 'modal',
            customAttributes: {
                enableFocusHoverPanelEventHandler: 'Test',
                shouldReturnFocus: true,
                requestClose: false,
            },
        };
        const options = parseOptions(param);

        expect(options.panelType).toBe('modal');
        expect(options.visible).toBe(true);
        expect(options.panelConfig.enableFocusHoverPanelEventHandler).toBe(
            'Test'
        );
        expect(options.panelConfig.shouldReturnFocus).toBe(true);
        expect(options.panelConfig.requestClose).toBe(false);
    });

    it('customAttributes can not override exist attribute', () => {
        const param = {
            modal: 'modal',
            customAttributes: {
                enableFocusHoverPanelEventHandler: 'Test',
                shouldReturnFocus: true,
                requestClose: false,
                trapFocus: true,
            },
        };
        try {
            const options = parseOptions(param);
            expect(options).toBe(null);
        } catch (e) {
            expect(e.message).toBe(
                'trapFocus is a predefined option, can not be overridden by customAttributes'
            );
        }
    });
});
