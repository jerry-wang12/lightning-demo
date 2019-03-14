const PANEL_ANIMATION_TIME = 220; // panel animation is 0.2s, consider ~17ms frame render, refer to panel.css in aura repo.

export class OverlayPanel {
    constructor(instance) {
        this._panelInstance = instance;
        this._visible = true;
    }

    get isVisible() {
        return this._visible;
    }

    get instance() {
        return this._panelInstance;
    }

    _createPromise(isShow, previousPromise) {
        let promise = new Promise(resolve => {
            const panelCall = isShow
                ? this._panelInstance.show
                : this._panelInstance.hide;
            let isDone = false;
            const resolveCall = () => {
                if (!isDone) {
                    resolve();
                    isDone = true;
                }
            };
            panelCall(resolveCall);
            // force the promise to resolve if animationend event didn't callback.
            // eslint-disable-next-line lwc/no-set-timeout
            setTimeout(resolveCall, PANEL_ANIMATION_TIME);
        });

        if (previousPromise) {
            promise = this.previousPromise.then(() => promise);
        }
        return promise;
    }

    show() {
        if (!this._visible) {
            this._showPromise = this._createPromise(
                true,
                this._hidePromise
            ).then(() => {
                this._showPromise = null;
                this._visible = true;
            });
        }
        return this._showPromise || Promise.resolve();
    }

    hide() {
        if (this._visible) {
            this._hidePromise = this._createPromise(
                false,
                this._showPromise
            ).then(() => {
                this._hidePromise = null;
                this._visible = false;
            });
        }

        return this._hidePromise || Promise.resolve();
    }

    close(shouldReturnFocus) {
        return new Promise(resolve => {
            this._panelInstance.close(() => {
                resolve();
            }, shouldReturnFocus);
        });
    }
}
