import { isInDom, WindowManager } from './util';

export class ElementProxy {
    constructor(el, id) {
        this.id = id;
        this.width = 0;
        this.height = 0;
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this._dirty = false;
        this._node = null;
        this._releaseCb = null;

        if (!el) {
            throw new Error('Element missing');
        }

        // W-3262919
        // for some reason I cannot figure out sometimes the
        // window, which clearly a window object, is not the window object
        // this will correct that. It might be related to locker
        if (WindowManager.isWindow(el)) {
            el = WindowManager.window;
        }

        this._node = el;
        this.setupObserver();
        this.refresh();
    }

    setupObserver() {
        // this check is because phantomjs does not support
        // mutation observers. The consqeuence here
        // is that any browser without mutation observers will
        // fail to update dimensions if they changwe after the proxy
        // is created and the proxy is not not refreshed
        if (WindowManager.MutationObserver && !this._node.isObserved) {
            // Use mutation observers to invalidate cache. It's magic!
            this._observer = new WindowManager.MutationObserver(
                this.refresh.bind(this)
            );

            // do not observe the window
            if (!WindowManager.isWindow(this._node)) {
                this._observer.observe(this._node, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true,
                });
                this._node.isObserved = true;
            }
        }
    }

    setReleaseCallback(cb, scope) {
        const scopeObj = scope || this;
        this._releaseCb = cb.bind(scopeObj);
    }

    checkNodeIsInDom() {
        // if underlying DOM node is gone,
        // this proxy should be released
        if (!isInDom(this._node)) {
            return false;
        }
        return true;
    }

    refresh() {
        const w = WindowManager.window;

        if (!this.isDirty()) {
            if (!this.checkNodeIsInDom()) {
                return this.release();
            }

            let box, x, scrollTop, scrollLeft;

            if (typeof w.pageYOffset !== 'undefined') {
                scrollTop = w.pageYOffset;
                scrollLeft = w.pageXOffset;
            } else {
                scrollTop = w.scrollY;
                scrollLeft = w.scrollX;
            }

            if (!WindowManager.isWindow(this._node)) {
                // force paint
                // eslint-disable-next-line no-unused-vars
                const offsetHeight = this._node.offsetHeight;
                box = this._node.getBoundingClientRect();

                // not using integers causes weird rounding errors
                // eslint-disable-next-line guard-for-in
                for (x in box) {
                    this[x] = Math.floor(box[x]);
                }
                this.top = Math.floor(this.top + scrollTop);
                this.bottom = Math.floor(this.top + box.height);
                this.left = Math.floor(this.left + scrollLeft);
                this.right = Math.floor(this.left + box.width);
            } else {
                box = {};
                this.width = WindowManager.documentElement.clientWidth;
                this.height = WindowManager.documentElement.clientHeight;
                this.left = scrollLeft;
                this.top = scrollTop;
                this.right =
                    WindowManager.documentElement.clientWidth + scrollLeft;
                this.bottom = WindowManager.documentElement.clientHeight;
            }

            this._dirty = false;
        }
        return this._dirty;
    }

    getNode() {
        return this._node;
    }

    isDirty() {
        return this._dirty;
    }

    bake() {
        const w = WindowManager.window;
        const absPos = this._node.getBoundingClientRect();
        const style = w.getComputedStyle(this._node) || this._node.style;
        let originalLeft, originalTop;
        let scrollTop, scrollLeft;

        if (typeof w.pageYOffset !== 'undefined') {
            scrollTop = w.pageYOffset;
            scrollLeft = w.pageXOffset;
        } else {
            scrollTop = w.scrollY;
            scrollLeft = w.scrollX;
        }

        if (style.left.match(/auto|fixed/)) {
            originalLeft = '0';
        } else {
            originalLeft = style.left;
        }
        if (style.top.match(/auto|fixed/)) {
            originalTop = '0';
        } else {
            originalTop = style.top;
        }

        originalLeft = parseInt(originalLeft.replace('px', ''), 10);
        originalTop = parseInt(originalTop.replace('px', ''), 10);

        const leftDif = Math.round(this.left - (absPos.left + scrollLeft));
        const topDif = this.top - (absPos.top + scrollTop);

        this._node.style.left = originalLeft + leftDif + 'px';
        this._node.style.top = originalTop + topDif + 'px';

        this._dirty = false;
    }

    setDirection(direction, val) {
        this[direction] = val;
        this._dirty = true;
    }

    release() {
        if (this._releaseCb) {
            this._releaseCb(this);
        }
    }

    querySelectorAll(selector) {
        return this._node.querySelectorAll(selector);
    }
}
