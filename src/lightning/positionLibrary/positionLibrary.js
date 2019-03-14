export { Direction } from './direction';
import { Constraint } from './constraint';
import {
    checkFlipPossibility,
    mapToHorizontal,
    mapToVertical,
    flipDirection,
    Direction,
    normalizeDirection,
} from './direction';
import { createProxy } from './elementProxyCache';
import {
    isDomNode,
    containsScrollingElement,
    queryScrollableChildren,
    getScrollableParent,
    getPositionTarget,
    WindowManager,
    normalizeElement,
    normalizePosition,
    attachPassiveEvent,
    isInsideModal,
    requestAnimationFrameAsPromise,
} from './util';
import {
    scheduleReposition,
    bindEvents,
    addConstraints,
    reposition,
    nextIndex,
} from './reposition';
import { assert } from 'lightning/utilsPrivate';
import { Relationship } from './relationship';
import { unwrap } from 'lwc';

function setupObserver(config, scrollableParent) {
    let proxyWheelEvents = true;

    if (WindowManager.MutationObserver && !config.element.isObserved) {
        // phantomjs :(
        let scrollableChildren = queryScrollableChildren(config.element);
        const observer = new WindowManager.MutationObserver(() => {
            scrollableChildren = queryScrollableChildren(config.element);
            proxyWheelEvents = !containsScrollingElement(scrollableChildren);
        });

        if (containsScrollingElement(scrollableChildren)) {
            proxyWheelEvents = false;
        }

        observer.observe(config.element, {
            attributes: true,
            subtree: true,
            childList: true,
        });
        config.element.isObserved = true;
    }

    if (scrollableParent) {
        const scrollRemovalFunction = attachPassiveEvent(
            scrollableParent,
            'scroll',
            scheduleReposition
        );

        // if the target element is inside a
        // scrollable element, we need to make sure
        // scroll events move that element,
        // not the parent, also we need to reposition on scroll
        const wheelRemovalFunction = attachPassiveEvent(
            config.element,
            'wheel',
            e => {
                if (
                    proxyWheelEvents &&
                    scrollableParent &&
                    typeof scrollableParent.scrollTop !== 'undefined'
                ) {
                    scrollableParent.scrollTop += e.deltaY;
                }
            }
        );

        config.removeListeners = () => {
            scrollRemovalFunction();
            wheelRemovalFunction();
        };
    }
}

function validateConfig(config) {
    assert(
        config.element && isDomNode(config.element),
        'Element is undefined or missing, or not a Dom Node'
    );
    assert(
        config.target &&
            (WindowManager.isWindow(config.target) || isDomNode(config.target)),
        'Target is undefined or missing'
    );
}

function createRelationship(config) {
    bindEvents();
    config.element = normalizePosition(
        config.element,
        nextIndex(),
        config.target,
        config.alignWidth
    );

    if (config.alignWidth && config.element.style.position === 'fixed') {
        config.element.style.width =
            config.target.getBoundingClientRect().width + 'px';
    }

    const constraintList = [];
    const scrollableParent = getScrollableParent(
        getPositionTarget(config.target),
        WindowManager.window
    );

    // This observer and the test for scrolling children
    // is so that if a panel contains a scroll we do not
    // proxy the events to the "parent"  (actually the target's parent)
    setupObserver(config, scrollableParent);

    if (config.appendToBody) {
        document.body.appendChild(config.element);
    }

    config.element = createProxy(config.element);
    config.target = createProxy(config.target);

    // Add vertical constraint.
    const verticalConfig = Object.assign({}, config);

    if (verticalConfig.padTop !== undefined) {
        verticalConfig.pad = verticalConfig.padTop;
    }

    // Add horizontal constraint.
    constraintList.push(
        new Constraint(mapToHorizontal(config.align.horizontal), config)
    );

    constraintList.push(
        new Constraint(mapToVertical(config.align.vertical), verticalConfig)
    );

    if (config.scrollableParentBound && scrollableParent) {
        const parent = normalizeElement(scrollableParent);
        const boxConfig = {
            element: config.element,
            enabled: config.enabled,
            target: createProxy(parent),
            align: {},
            targetAlign: {},
            pad: 3,
            boxDirections: {
                top: true,
                bottom: true,
                left: true,
                right: true,
            },
        };
        constraintList.push(new Constraint('bounding box', boxConfig));
    }

    addConstraints(constraintList);
    reposition();

    return new Relationship(config, constraintList, scrollableParent);
}

function isAutoFlipHorizontal(config) {
    return config.autoFlip || config.autoFlipHorizontal;
}

function isAutoFlipVertical(config) {
    return config.autoFlip || config.autoFlipVertical;
}

function normalizeConfig(config) {
    config.align = config.align || {};
    config.targetAlign = config.targetAlign || {};

    const {
        shouldAlignToLeft,
        shouldAlignToRight,
        hasSpaceAbove,
        hasSpaceBelow,
        requireFlip,
    } = checkFlipPossibility(
        config.element,
        config.target,
        config.leftAsBoundary
    );

    const vFlip = isAutoFlipVertical(config) ? requireFlip : false;

    const { align, targetAlign } = config;

    let hFlip = false;
    if (align.horizontal === Direction.Left) {
        hFlip = isAutoFlipHorizontal(config) ? shouldAlignToRight : false;
    } else if (align.horizontal === Direction.Right) {
        hFlip = isAutoFlipHorizontal(config) ? shouldAlignToLeft : false;
    }

    // When inside modal, element may expand out of the viewport and be cut off.
    // So if inside modal, and don't have enough space above or below, will add bounding box rule.
    if (isInsideModal(config.element) && !hasSpaceAbove && !hasSpaceBelow) {
        config.scrollableParentBound = true;
    }

    return {
        target: config.target,
        element: config.element,
        align: {
            horizontal: hFlip
                ? flipDirection(align.horizontal)
                : normalizeDirection(align.horizontal, Direction.Left),
            vertical: vFlip
                ? flipDirection(align.vertical)
                : normalizeDirection(align.vertical, Direction.Top),
        },
        targetAlign: {
            horizontal: hFlip
                ? flipDirection(targetAlign.horizontal)
                : normalizeDirection(targetAlign.horizontal, Direction.Left),
            vertical: vFlip
                ? flipDirection(targetAlign.vertical)
                : normalizeDirection(targetAlign.vertical, Direction.Bottom),
        },
        alignWidth: config.alignWidth,
        scrollableParentBound: config.scrollableParentBound,
    };
}

function toElement(root, target) {
    if (target && typeof target === 'string') {
        return root.querySelector(target);
    } else if (target && typeof target === 'function') {
        return unwrap(target());
    }
    return target;
}

export function startPositioning(root, config) {
    assert(root, 'Root is undefined or missing');
    assert(config, 'Config is undefined or missing');
    const node = normalizeElement(root);
    const target = toElement(node, config.target);
    const element = toElement(node, config.element);

    // when target/element is selector, there is chance, dom isn't present anymore.
    if (!target || !element) {
        return null;
    }

    config.target = normalizeElement(target);
    config.element = normalizeElement(element);

    validateConfig(config);
    return createRelationship(normalizeConfig(config));
}

export function stopPositioning(relationship) {
    if (relationship) {
        relationship.destroy();
    }
}

export class AutoPosition {
    _autoPositionUpdater = null;

    constructor(root) {
        this._root = root;
    }

    start(config) {
        return requestAnimationFrameAsPromise().then(() => {
            let promise = Promise.resolve();
            if (!this._autoPositionUpdater) {
                this._autoPositionUpdater = startPositioning(
                    this._root,
                    config
                );
            } else {
                promise = promise.then(() => {
                    return this._autoPositionUpdater.reposition();
                });
            }

            return promise.then(() => {
                return this._autoPositionUpdater;
            });
        });
    }

    stop() {
        if (this._autoPositionUpdater) {
            stopPositioning(this._autoPositionUpdater);
            this._autoPositionUpdater = null;
        }
        return Promise.resolve();
    }
}
