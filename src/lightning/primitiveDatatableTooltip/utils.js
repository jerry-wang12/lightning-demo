export function getBubbleAlignAndPosition(
    triggerBoundingClientRect,
    bubbleBoundingClientRect,
    defaultAlign,
    shiftAmounts,
    availableHeight,
    availableWidth,
    xOffset,
    yOffset
) {
    const bubbleOverflows = {};
    const align = {
        horizontal: defaultAlign.horizontal,
        vertical: defaultAlign.vertical,
    };
    const positionAt = { top: null, right: null, bottom: null, left: null };

    bubbleOverflows.right =
        triggerBoundingClientRect.left + bubbleBoundingClientRect.width >
        availableWidth;
    bubbleOverflows.left =
        triggerBoundingClientRect.right - bubbleBoundingClientRect.width < 0;
    bubbleOverflows.top =
        triggerBoundingClientRect.top -
            (bubbleBoundingClientRect.height + shiftAmounts.vertical) <
        0;
    bubbleOverflows.bottom =
        triggerBoundingClientRect.bottom +
            bubbleBoundingClientRect.height +
            shiftAmounts.vertical >
        availableHeight;

    if (bubbleOverflows.right) {
        align.horizontal = 'right';
        positionAt.right = availableWidth - triggerBoundingClientRect.right;
    }

    if (bubbleOverflows.left) {
        align.horizontal = 'left';
        positionAt.left = triggerBoundingClientRect.right;
    }

    if (bubbleOverflows.top) {
        align.vertical = 'top';
        positionAt.top = triggerBoundingClientRect.bottom;
    }

    if (bubbleOverflows.bottom) {
        align.vertical = 'bottom';
        positionAt.bottom = availableHeight - triggerBoundingClientRect.top;
    }

    const result = { align };

    // assign default values for position bottom & left based on trigger element if needed
    // - default anchor point of popover is bottom left attached to trigger element's top left
    positionAt.bottom =
        positionAt.top || positionAt.top === 0
            ? null
            : availableHeight - triggerBoundingClientRect.top;
    positionAt.left =
        positionAt.right || positionAt.right === 0
            ? null
            : triggerBoundingClientRect.left;

    // apply calculated position values
    result.top = positionAt.top
        ? positionAt.top + shiftAmounts.vertical + yOffset + 'px'
        : positionAt.top;
    result.right = positionAt.right
        ? positionAt.right - shiftAmounts.horizontal - xOffset + 'px'
        : positionAt.right;
    result.bottom = positionAt.bottom
        ? positionAt.bottom + shiftAmounts.vertical - yOffset + 'px'
        : positionAt.bottom;
    result.left = positionAt.left
        ? positionAt.left - shiftAmounts.horizontal + xOffset + 'px'
        : positionAt.left;

    return result;
}

export function getNubbinShiftAmount(nubbinComputedStyles, triggerWidth) {
    // calculate smallest positive value of horizontal nubbin distance, right or left
    // - the nubbin is the pointy element on the bubble
    const nubbinShiftLeft = parseInt(nubbinComputedStyles.left, 10) || -1;
    const nubbinShiftRight = parseInt(nubbinComputedStyles.right, 10) || -1;

    // check which measurement is the lesser of the two (closest to edge)
    let nubbinShift =
        nubbinShiftLeft < nubbinShiftRight ? nubbinShiftLeft : nubbinShiftRight;

    // use the positive, greater than zero, shift value
    if (nubbinShift < 0 && nubbinShiftLeft < 0 && nubbinShiftRight > 0) {
        nubbinShift = nubbinShiftRight;
    }
    if (nubbinShift < 0 && nubbinShiftRight < 0 && nubbinShiftLeft > 0) {
        nubbinShift = nubbinShiftLeft;
    }

    return {
        horizontal: nubbinShift - (triggerWidth / 2), // prettier-ignore
        vertical: parseInt(nubbinComputedStyles.height, 10),
    };
}
