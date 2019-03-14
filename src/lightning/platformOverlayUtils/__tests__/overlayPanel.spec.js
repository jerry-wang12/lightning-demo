import { OverlayPanel } from '../overlayPanel';

class MockPanelInstance {
    show(callback) {
        callback();
    }
    hide(callback) {
        callback();
    }
}

describe('OverlayPanel', () => {
    it('should show panel', () => {
        expect.assertions(1);
        const panel = new OverlayPanel(new MockPanelInstance());
        return panel.show().then(() => {
            expect(panel.isVisible).toEqual(true);
        });
    });
    it('should hide panel', () => {
        expect.assertions(2);
        const panel = new OverlayPanel(new MockPanelInstance());
        return panel
            .show()
            .then(() => {
                expect(panel.isVisible).toEqual(true);
                return panel.hide();
            })
            .then(() => {
                expect(panel.isVisible).toEqual(false);
            });
    });

    it('should show/hide/show/hide panel', () => {
        expect.assertions(4);
        const panel = new OverlayPanel(new MockPanelInstance());
        return panel
            .show()
            .then(() => {
                expect(panel.isVisible).toEqual(true);
                return panel.hide();
            })
            .then(() => {
                expect(panel.isVisible).toEqual(false);
                return panel.show();
            })
            .then(() => {
                expect(panel.isVisible).toEqual(true);
                return panel.hide();
            })
            .then(() => {
                expect(panel.isVisible).toEqual(false);
            });
    });
});
