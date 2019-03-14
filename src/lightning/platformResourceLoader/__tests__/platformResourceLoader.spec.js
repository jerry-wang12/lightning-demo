import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

// note: jsdom is by default configured to not load any external resources
// and does not fire a load event. Promises can't be tested without manually
// triggering the event.

const RESOURCE_CSS = 'test.css';
const RESOURCE_JS = 'test.js';

describe('platform-resource-loader', () => {
    beforeEach(() => {
        const cmp = document.createElement('test-component');
        const tpl = document.createElement('test-template');
        cmp.appendChild(tpl);
        cmp.template = tpl;
        tpl.host = cmp;
        document.body.appendChild(cmp);
    });
    afterEach(() => {
        const cmp = document.querySelector('test-component');
        document.body.removeChild(cmp);
    });

    describe('loads style', () => {
        it('should validate parameter', () => {
            expect.assertions(2);

            expect(() => loadStyle(null, RESOURCE_CSS)).toThrow(TypeError);
            expect(() => loadStyle(document, RESOURCE_CSS)).toThrow(TypeError);
        });

        it('should create link tag', () => {
            expect.assertions(4);

            const cmp = document.querySelector('test-component');
            loadStyle(cmp, RESOURCE_CSS);
            const links = document.querySelectorAll('link');
            expect(links).toHaveLength(1);

            const link = links[0];
            expect(link.charset).toBe('utf-8');
            expect(link.type).toBe('text/css');
            expect(link.rel).toBe('stylesheet');

            document.head.removeChild(links[0]);
        });

        it('should prevent duplicate link tags', () => {
            expect.assertions(1);

            const cmp = document.querySelector('test-component');
            loadStyle(cmp, RESOURCE_CSS);
            loadStyle(cmp, RESOURCE_CSS);
            const links = document.querySelectorAll('link');
            expect(links).toHaveLength(1);

            document.head.removeChild(links[0]);
        });
    });

    describe('loads script', () => {
        it('should validate parameter', () => {
            expect.assertions(2);

            expect(() => loadScript(null, RESOURCE_CSS)).toThrow(TypeError);
            expect(() => loadScript(document, RESOURCE_CSS)).toThrow(TypeError);
        });

        it('should create script tag', () => {
            expect.assertions(3);

            const cmp = document.querySelector('test-component');
            loadScript(cmp, RESOURCE_JS);
            const scripts = document.querySelectorAll('script');
            expect(scripts).toHaveLength(1);

            const script = scripts[0];
            expect(script.charset).toBe('utf-8');
            expect(script.type).toBe('text/javascript');

            document.head.removeChild(scripts[0]);
        });

        it('should prevent duplicate script tags', () => {
            expect.assertions(1);

            const cmp = document.querySelector('test-component');
            loadScript(cmp, RESOURCE_JS);
            loadScript(cmp, RESOURCE_JS);
            const scripts = document.querySelectorAll('script');
            expect(scripts).toHaveLength(1);

            document.head.removeChild(scripts[0]);
        });
    });

    describe('handles existing script', () => {
        it('should throw error for existing script', () => {
            expect.assertions(2);

            const script = document.createElement('script');
            script.src = '/test/myjs';
            document.head.appendChild(script);

            const cmp = document.querySelector('test-component');

            const scripts = document.querySelectorAll('script');
            expect(scripts).toHaveLength(1);

            expect(() => loadScript(cmp, '/test/myjs')).toThrow(Error);
            document.head.removeChild(scripts[0]);
        });
        it('shouldnt throw error for script loaded using _ltngRequireCreated', () => {
            expect.assertions(1);

            const script = document.createElement('script');
            script.src = '/test/myjs';
            script._ltngRequireCreated = true;
            script._ltngRequireLoaded = true;
            document.head.appendChild(script);

            const cmp = document.querySelector('test-component');

            loadScript(cmp, '/test/myjs').then(() => {
                const scripts = document.querySelectorAll('script');
                expect(scripts).toHaveLength(1);
                document.head.removeChild(scripts[0]);
            });
        });
        // Lastest version of Jest does not like when an element registers and dispatches an event on themselves
        // because the scripts elements here turn out to be the same, hence this test fails with an illegal exception error.
        // eslint-disable-next-line jest/no-disabled-tests
        it.skip('resolves for script which is loading using _ltngRequireCreated', () => {
            expect.assertions(2);

            const script = document.createElement('script');
            script.src = '/test/myjs';
            script._ltngRequireCreated = true;
            document.head.appendChild(script);

            const cmp = document.querySelector('test-component');

            const p = loadScript(cmp, '/test/myjs');

            Promise.resolve().then(() => {
                const evt = new Event('load');
                script.dispatchEvent(evt);
            });

            return p.then(() => {
                const scripts = document.querySelectorAll('script');
                expect(scripts).toHaveLength(1);
                expect(script._ltngRequireLoaded).toBe(true);
                document.head.removeChild(scripts[0]);
            });
        });
        // Lastest version of Jest does not like when an element registers and dispatches an event on themselves
        // because the scripts elements here turn out to be the same, hence this test fails with an illegal exception error.
        // eslint-disable-next-line jest/no-disabled-tests
        it.skip('rejects for script which is errored out using _ltngRequireCreated', () => {
            expect.assertions(1);

            const script = document.createElement('script');
            script.src = '/test/myjs';
            script._ltngRequireCreated = true;
            document.head.appendChild(script);

            const cmp = document.querySelector('test-component');

            const p = loadScript(cmp, '/test/myjs');

            Promise.resolve().then(() => {
                const evt = new Event('error');
                script.dispatchEvent(evt);
            });

            return p.catch(() => {
                const scripts = document.querySelectorAll('script');
                expect(script._ltngRequireLoaded).toBe(undefined);
                document.head.removeChild(scripts[0]);
            });
        });
    });
});
