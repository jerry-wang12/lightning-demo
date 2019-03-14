import { unwrap } from 'lwc';

export class LightningResizeObserver {
    constructor(resizeCallback) {
        this._resizeObserverAvailable = typeof ResizeObserver === 'function';

        const delayedCallback = callback => {
            if (this._running) {
                return;
            }
            this._running = true;
            // eslint-disable-next-line lwc/no-set-timeout
            setTimeout(() => {
                callback();
                this._running = false;
            }, 60);
        };

        this._delayedResizeCallback = delayedCallback.bind(
            this,
            resizeCallback
        );
        if (this._resizeObserverAvailable) {
            this._resizeObserver = new ResizeObserver(
                this._delayedResizeCallback
            );
        }
    }

    observe(lightningElement) {
        // Using requestAnimationFrame as the element may not be physically in the DOM yet.
        this._requestAnimationId = requestAnimationFrame(() => {
            const domElement = unwrap(lightningElement);

            if (this._resizeObserverAvailable) {
                this._resizeObserver.observe(domElement);
            } else if (!this._hasWindowResizeHandler) {
                window.addEventListener('resize', this._delayedResizeCallback);
                this._hasWindowResizeHandler = true;
            }
        });
    }

    disconnect() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
        if (this._requestAnimationId) {
            cancelAnimationFrame(this._requestAnimationId);
        }
        window.removeEventListener('resize', this._delayedResizeCallback);
        this._hasWindowResizeHandler = false;
    }
}
