import { unwrap } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { isPositiveInteger } from './utils';

const SCROLLABLE_CONTAINER_SEL = '.slds-scrollable_y';
const SCROLL_ALLOWANCE = 2;

export function getInfiniteLoadingDefaultState() {
    return {
        enableInfiniteLoading: false,
        loadMoreOffset: 20,
        isLoading: false,
    };
}

export function isLoading(state) {
    return state.isLoading;
}
export function setLoading(state, value) {
    state.isLoading = normalizeBoolean(value);
}

export function isInfiniteLoadingEnabled(state) {
    return state.enableInfiniteLoading;
}
export function setInfiniteLoading(state, value) {
    state.enableInfiniteLoading = normalizeBoolean(value);
}

export function getLoadMoreOffset(state) {
    return state.loadMoreOffset;
}
export function setLoadMoreOffset(state, value) {
    if (!isPositiveInteger(value)) {
        // eslint-disable-next-line no-console
        console.warn(
            `The "loadMoreOffset" value passed into lightning:datatable
            is incorrect. "loadMoreOffset" value should be an integer >= 0.`
        );
    }

    state.loadMoreOffset = isPositiveInteger(value)
        ? parseInt(value, 10)
        : getInfiniteLoadingDefaultState().loadMoreOffset;
}

export function handleLoadMoreCheck(event) {
    if (isLoading(this.state)) {
        return;
    }

    const contentContainer = unwrap(event).target.firstChild;
    if (!contentContainer) {
        return;
    }

    const offset = getOffsetFromTableEnd(contentContainer);
    const threshold = getLoadMoreOffset(this.state);
    if (offset < threshold) {
        this.dispatchEvent(new CustomEvent('loadmore'));
    }
}

function isScrollable(element) {
    // scrollHeight should be greater than clientHeight by some allowance
    return (
        element &&
        element.scrollHeight > element.clientHeight + SCROLL_ALLOWANCE
    );
}

function isScrollerVisible(elem) {
    return (
        elem && !!(elem.offsetParent || elem.offsetHeight || elem.offsetWidth)
    );
}

function hasData(root) {
    return root.querySelectorAll('tbody > tr').length > 0;
}

export function handlePrefetch(root, state) {
    if (
        !isInfiniteLoadingEnabled(state) ||
        isLoading(state) ||
        !hasData(root)
    ) {
        // dont prefetch if already loading or data is not set yet
        return;
    }

    const elem = root.querySelector(SCROLLABLE_CONTAINER_SEL);

    if (isScrollerVisible(elem) && !isScrollable(elem)) {
        this.dispatchEvent(new CustomEvent('loadmore'));
    }
}

function getOffsetFromTableEnd(el) {
    return (
        el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight
    );
}
