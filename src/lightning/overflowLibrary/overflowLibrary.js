export function calculateOverflow({
    items,
    activeItem,
    containerWidth,
    overflowWidth,
}) {
    const visibleItems = [];
    const overflowItems = [];

    const allItemsWidth = items.reduce(
        (totalWidth, item) => totalWidth + item.width,
        0
    );

    if (allItemsWidth <= containerWidth || containerWidth === 0) {
        return { visibleItems: items, overflowItems };
    }

    // Not all items fit, an overflow is needed
    let totalWidth = overflowWidth;

    // The active item should always show so we're always including it
    if (activeItem) {
        totalWidth += activeItem.width;
    }

    let activeItemFitsWithoutRearrangement = false;
    for (const item of items) {
        if (activeItem.value === item.value) {
            activeItemFitsWithoutRearrangement = overflowItems.length === 0;
            if (activeItemFitsWithoutRearrangement) {
                visibleItems.push(activeItem);
            }
        } else {
            const itemFits = item.width + totalWidth <= containerWidth;
            if (itemFits && overflowItems.length === 0) {
                totalWidth += item.width;
                visibleItems.push(item);
            } else {
                overflowItems.push(item);
            }
        }
    }

    if (!activeItemFitsWithoutRearrangement) {
        visibleItems.push(activeItem);
    }

    return {
        visibleItems,
        overflowItems,
    };
}
