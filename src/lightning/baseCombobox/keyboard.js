import {
    keyCodes,
    runActionOnBufferedTypedCharacters,
} from 'lightning/utilsPrivate';

function preventDefaultAndStopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
}

function moveHighlightToTypedCharacters(
    event,
    currentIndex,
    dropdownInterface
) {
    runActionOnBufferedTypedCharacters(
        event,
        dropdownInterface.highlightOptionWithText.bind(this, currentIndex || 0)
    );
}

// eslint-disable-next-line complexity
export function handleKeyDownOnInput(event, currentIndex, dropdownInterface) {
    const isVisible = dropdownInterface.isDropdownVisible();
    switch (event.keyCode) {
        case keyCodes.enter:
            preventDefaultAndStopPropagation(event);
            if (isVisible && currentIndex >= 0) {
                dropdownInterface.selectByIndex(currentIndex);
            } else {
                dropdownInterface.openDropdownIfNotEmpty();
            }
            break;
        case keyCodes.pagedown:
            preventDefaultAndStopPropagation(event);

            if (!isVisible) {
                dropdownInterface.openDropdownIfNotEmpty();
            }
            // Jump 10 options down
            requestAnimationFrame(() =>
                dropdownInterface.highlightOptionWithIndex(
                    Math.min(
                        currentIndex + 10,
                        dropdownInterface.getTotalOptions() - 1
                    )
                )
            );
            break;
        case keyCodes.pageup:
            preventDefaultAndStopPropagation(event);

            if (!isVisible) {
                dropdownInterface.openDropdownIfNotEmpty();
            }
            // Jump 10 options up
            requestAnimationFrame(() =>
                dropdownInterface.highlightOptionWithIndex(
                    Math.max(currentIndex - 10, 0)
                )
            );
            break;
        case keyCodes.home:
            // If not a read-only input we want the default browser behaviour
            if (!dropdownInterface.isInputReadOnly()) {
                break;
            }

            preventDefaultAndStopPropagation(event);

            if (!isVisible) {
                dropdownInterface.openDropdownIfNotEmpty();
            }
            requestAnimationFrame(() =>
                dropdownInterface.highlightOptionWithIndex(0)
            );
            break;
        case keyCodes.end:
            // If not a read-only input we want the default browser behaviour
            if (!dropdownInterface.isInputReadOnly()) {
                break;
            }

            preventDefaultAndStopPropagation(event);

            if (!isVisible) {
                dropdownInterface.openDropdownIfNotEmpty();
            }

            requestAnimationFrame(() =>
                dropdownInterface.highlightOptionWithIndex(
                    dropdownInterface.getTotalOptions() - 1
                )
            );
            break;
        case keyCodes.down:
        case keyCodes.up: // eslint-disable-line no-case-declarations
            preventDefaultAndStopPropagation(event);

            if (!isVisible) {
                currentIndex = -1;
                dropdownInterface.openDropdownIfNotEmpty();
            }

            let nextIndex;
            if (currentIndex >= 0) {
                nextIndex =
                    event.keyCode === keyCodes.up
                        ? currentIndex - 1
                        : currentIndex + 1;
                if (nextIndex >= dropdownInterface.getTotalOptions()) {
                    nextIndex = 0;
                } else if (nextIndex < 0) {
                    nextIndex = dropdownInterface.getTotalOptions() - 1;
                }
            } else {
                nextIndex =
                    event.keyCode === keyCodes.up
                        ? dropdownInterface.getTotalOptions() - 1
                        : 0;
            }

            requestAnimationFrame(() => {
                dropdownInterface.highlightOptionWithIndex(nextIndex);
            });
            break;
        case keyCodes.escape:
        case keyCodes.tab:
            if (isVisible) {
                event.stopPropagation();
                dropdownInterface.closeDropdown();
            }
            break;
        default:
            if (!isVisible) {
                dropdownInterface.openDropdownIfNotEmpty();
            }
            if (dropdownInterface.isInputReadOnly()) {
                // The element should be read only, it's a work-around for IE11 as it will still make editable an input
                // that has focus and was dynamically changed to be readonly on focus change. Remove once we no longer
                // support IE11
                event.preventDefault();

                requestAnimationFrame(() =>
                    moveHighlightToTypedCharacters(
                        event,
                        currentIndex,
                        dropdownInterface
                    )
                );
            }
    }
}
