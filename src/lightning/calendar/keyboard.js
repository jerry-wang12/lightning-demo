import { keyCodes } from 'lightning/utilsPrivate';

export function handleKeyDownOnCalendar(event, date, calendarInterface) {
    const tdElement = event.target;
    switch (event.keyCode) {
        case keyCodes.up:
            preventDefaultAndStopPropagation(event);
            date.setDate(date.getDate() - 7);
            calendarInterface.focusDate(date);
            break;
        case keyCodes.down:
            preventDefaultAndStopPropagation(event);
            date.setDate(date.getDate() + 7);
            calendarInterface.focusDate(date);
            break;
        case keyCodes.right:
            preventDefaultAndStopPropagation(event);
            date.setDate(date.getDate() + 1);
            calendarInterface.focusDate(date);
            break;
        case keyCodes.left:
            preventDefaultAndStopPropagation(event);
            date.setDate(date.getDate() - 1);
            calendarInterface.focusDate(date);
            break;
        case keyCodes.enter:
        case keyCodes.space:
            preventDefaultAndStopPropagation(event);
            calendarInterface.selectDate(tdElement);
            break;
        case keyCodes.pageup:
            preventDefaultAndStopPropagation(event);
            if (event.altKey) {
                date.setFullYear(date.getFullYear() - 1);
            } else {
                date.setMonth(date.getMonth() - 1);
            }
            calendarInterface.focusDate(date);
            break;
        case keyCodes.pagedown:
            preventDefaultAndStopPropagation(event);
            if (event.altKey) {
                date.setFullYear(date.getFullYear() + 1);
            } else {
                date.setMonth(date.getMonth() + 1);
            }
            calendarInterface.focusDate(date);
            break;
        case keyCodes.home: // eslint-disable-line no-case-declarations
            preventDefaultAndStopPropagation(event);
            const startOfWeek = calendarInterface.getStartOfWeek(date);
            calendarInterface.focusDate(startOfWeek);
            break;
        case keyCodes.end: // eslint-disable-line no-case-declarations
            preventDefaultAndStopPropagation(event);
            const endOfWeek = calendarInterface.getStartOfWeek(date);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            calendarInterface.focusDate(endOfWeek);
            break;
        default:
    }
}

export function handleKeyDownOnToday(event, calendarInterface) {
    switch (event.keyCode) {
        case keyCodes.tab:
            if (!event.shiftKey) {
                preventDefaultAndStopPropagation(event);
                calendarInterface.focusFirstFocusableElement();
            }
            break;
        default:
    }
}

export function handleKeyDownOnPreviousMonthNav(event, calendarInterface) {
    switch (event.keyCode) {
        case keyCodes.tab:
            if (event.shiftKey) {
                preventDefaultAndStopPropagation(event);
                calendarInterface.focusLastFocusableElement();
            }
            break;
        default:
    }
}

function preventDefaultAndStopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
}
