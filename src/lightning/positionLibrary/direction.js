import { normalizeString } from 'lightning/utilsPrivate';
import { WindowManager } from './util';

const ALIGN_REGEX = /^(left|right|center)\s(top|bottom|center)$/;

export const Direction = {
    Center: 'center',
    Middle: 'middle',
    Right: 'right',
    Left: 'left',
    Bottom: 'bottom',
    Top: 'top',
    Default: 'default',
};

const VerticalMap = {
    top: Direction.Top,
    bottom: Direction.Bottom,
    center: Direction.Middle,
};

const HorizontalMap = {
    left: Direction.Left,
    right: Direction.Right,
    center: Direction.Center,
};

const FlipMap = {
    left: Direction.Right,
    right: Direction.Left,
    top: Direction.Bottom,
    bottom: Direction.Top,
    default: Direction.Right,
};

function getWindowSize() {
    return {
        width:
            WindowManager.window.innerWidth || document.body.clientWidth || 0,
        height:
            WindowManager.window.innerHeight || document.body.clientHeight || 0,
    };
}

export function normalizeDirection(direction, defaultValue) {
    return normalizeString(direction, {
        fallbackValue: defaultValue || Direction.Default,
        validValues: [
            Direction.Center,
            Direction.Right,
            Direction.Left,
            Direction.Bottom,
            Direction.Top,
            Direction.Middle,
            Direction.Default,
        ],
    });
}

export function mapToHorizontal(value) {
    value = normalizeDirection(value, Direction.Left);
    return HorizontalMap[value];
}

export function mapToVertical(value) {
    value = normalizeDirection(value, Direction.Left);
    return VerticalMap[value];
}

export function flipDirection(value) {
    value = normalizeDirection(value, Direction.Left);
    return FlipMap[value];
}

export function isValidDirection(value) {
    return value && value.match(ALIGN_REGEX);
}

export function checkFlipPossibility(element, target, leftAsBoundary) {
    const viewPort = getWindowSize();
    const elemRect = element.getBoundingClientRect();
    const referenceElemRect = target.getBoundingClientRect();
    const height =
        typeof elemRect.height !== 'undefined'
            ? elemRect.height
            : elemRect.bottom - elemRect.top;
    const width =
        typeof elemRect.width !== 'undefined'
            ? elemRect.width
            : elemRect.right - elemRect.left;

    const hasSpaceAbove = referenceElemRect.top >= height;
    const hasSpaceBelow = viewPort.height - referenceElemRect.bottom >= height;
    const requireFlip = hasSpaceAbove && !hasSpaceBelow;

    const shouldAlignToRight =
        referenceElemRect.right >= width && // enough space on the left
        viewPort.width - referenceElemRect.left < width; // not enough space on the right
    const shouldAlignToLeft =
        referenceElemRect.left + width <= viewPort.width &&
        referenceElemRect.right - width <
            (leftAsBoundary ? referenceElemRect.left : 0);

    return {
        shouldAlignToLeft,
        shouldAlignToRight,
        hasSpaceAbove,
        hasSpaceBelow,
        requireFlip,
    };
}
