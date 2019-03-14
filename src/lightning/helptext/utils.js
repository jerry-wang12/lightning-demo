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
    let align = {
        horizontal: defaultAlign.horizontal,
        vertical: defaultAlign.vertical,
    };
    let positionAt = { top: null, right: null, bottom: null, left: null };

    const bubbleOverflows = getBubbleOverflows(
        triggerBoundingClientRect,
        bubbleBoundingClientRect,
        shiftAmounts,
        availableWidth,
        availableHeight
    );

    // evaluate where the bubble should be positioned
    const alignAndPosition = calculateAlignAndPosition(
        align,
        positionAt,
        bubbleOverflows,
        triggerBoundingClientRect,
        bubbleBoundingClientRect,
        availableWidth,
        availableHeight
    );

    align = alignAndPosition.alignment;
    positionAt = alignAndPosition.positioning;

    const result = { align };

    // assign default values for position bottom & left based on trigger element if needed
    // - default anchor point of popover is bottom center attached to trigger element's top center
    positionAt.bottom =
        positionAt.top || positionAt.top === 0
            ? null
            : availableHeight - triggerBoundingClientRect.top;

    // set the left positioning default according to vertical alignment when needed
    let defaultLeft =
        align.vertical === 'center'
            ? triggerBoundingClientRect.right
            : triggerBoundingClientRect.left;

    // don't use the default if we already have a value
    if (positionAt.left) {
        defaultLeft = positionAt.left;
    }

    positionAt.left =
        positionAt.right || positionAt.right === 0 ? null : defaultLeft;

    const shiftByVertical =
        align.vertical === 'center' ? 0 : shiftAmounts.vertical;
    let shiftByHorizontal =
        align.horizontal === 'center' ? 0 : shiftAmounts.horizontal;

    // Change horizontal shift value to opposite value (negative or positive)
    // :: needed to push the bubble away from the trigger instead of into it when positioned on left or right
    if (align.vertical === 'center') {
        shiftByHorizontal *= -1;
    }

    // apply calculated position values
    result.top = positionAt.top
        ? positionAt.top + shiftByVertical + yOffset + 'px'
        : positionAt.top;
    result.right = positionAt.right
        ? positionAt.right - shiftByHorizontal - xOffset + 'px'
        : positionAt.right;
    result.bottom = positionAt.bottom
        ? positionAt.bottom + shiftByVertical - yOffset + 'px'
        : positionAt.bottom;
    result.left = positionAt.left
        ? positionAt.left - shiftByHorizontal + xOffset + 'px'
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

//
// Utility functions (for reduced complexity)
//
function getBubbleOverflows(
    triggerBoundingClientRect,
    bubbleBoundingClientRect,
    shiftAmounts,
    availableWidth,
    availableHeight
) {
    const bubbleOverflows = {};

    // evaluate in which directions the bubble overflows

    // is the bubble overflowing if positioned above the trigger?
    bubbleOverflows.top =
        triggerBoundingClientRect.top -
            (bubbleBoundingClientRect.height + shiftAmounts.vertical) <
        0;

    // is the bubble overflowing if halfway positioned above the trigger?
    // :: useful for vertical center calculation
    bubbleOverflows.topCenter =
        triggerBoundingClientRect.top - bubbleBoundingClientRect.height / 2 < 0;

    // is the bubble overflowing if positioned below the trigger?
    bubbleOverflows.bottom =
        triggerBoundingClientRect.bottom +
            bubbleBoundingClientRect.height +
            shiftAmounts.vertical >
        availableHeight;

    // is the bubble overflowing if positioned to the right of the trigger?
    bubbleOverflows.right =
        triggerBoundingClientRect.left + bubbleBoundingClientRect.width >
        availableWidth;

    // is the bubble overflowing if halfway positioned to the right of the trigger?
    // :: useful for horizontal center calculation
    bubbleOverflows.rightCenter =
        triggerBoundingClientRect.left + bubbleBoundingClientRect.width / 2 >
        availableWidth;

    // is the bubble overflowing if positioned to the left of the trigger?
    bubbleOverflows.left =
        triggerBoundingClientRect.right - bubbleBoundingClientRect.width < 0;

    // is the bubble overflowing if halfway positioned to the left of the trigger?
    // :: useful for horizontal center calculation
    bubbleOverflows.leftCenter =
        triggerBoundingClientRect.right - bubbleBoundingClientRect.width / 2 <
        0;

    return bubbleOverflows;
}

function calculateAlignAndPosition(
    align,
    positionAt,
    bubbleOverflows,
    triggerBoundingClientRect,
    bubbleBoundingClientRect,
    availableWidth,
    availableHeight
) {
    let bubbleIsVerticallyCentered = false;

    // if enough space to be vertically centered from top
    if (bubbleOverflows.top && !bubbleOverflows.topCenter) {
        align.vertical = 'center';

        // set the bubble to be vertically centered on the trigger
        // top position of the bubble to match the following formula:
        //  <bottom of trigger> - <half the height of trigger> - <half the height of the bubble>
        positionAt.top =
            triggerBoundingClientRect.bottom -
            triggerBoundingClientRect.height / 2 -
            bubbleBoundingClientRect.height / 2;

        bubbleIsVerticallyCentered = true;
        // if overflows upwards show below trigger
    } else if (bubbleOverflows.top) {
        align.vertical = 'top';
        positionAt.top = triggerBoundingClientRect.bottom;
    }

    // if overflows downward show above the trigger
    if (bubbleOverflows.bottom) {
        align.vertical = 'bottom';
        positionAt.bottom = availableHeight - triggerBoundingClientRect.top;
    }

    // if vertically centered and overflows left then show on right
    if (bubbleIsVerticallyCentered && bubbleOverflows.left) {
        align.horizontal = 'left';
        positionAt.left = triggerBoundingClientRect.right;
        // if overflows to the left show on right
    } else if (bubbleOverflows.left) {
        align.horizontal = 'left';
        positionAt.left = triggerBoundingClientRect.left;
    }

    // if vertically centered and overflows right then show on left
    if (bubbleIsVerticallyCentered && bubbleOverflows.right) {
        align.horizontal = 'right';
        positionAt.right = availableWidth - triggerBoundingClientRect.left;
        // if overflows to the right show on left
    } else if (bubbleOverflows.right) {
        align.horizontal = 'right';
        positionAt.right = availableWidth - triggerBoundingClientRect.right;
    }

    // only horizontally center bubble if it would overflow to the right or left
    if (
        bubbleOverflows.left &&
        bubbleOverflows.right &&
        !bubbleOverflows.leftCenter &&
        !bubbleOverflows.rightCenter
    ) {
        align.horizontal = 'center';

        // set the bubble to be horizontally centered on the trigger
        // left position of the bubble to match the following formula:
        //  <left edge of trigger> - <half the width of trigger> - <half the width of the bubble>
        positionAt.left =
            triggerBoundingClientRect.left +
            triggerBoundingClientRect.width / 2 -
            bubbleBoundingClientRect.width / 2;

        positionAt.right = null;
    }

    return {
        alignment: align,
        positioning: positionAt,
    };
}
