import { keyCodes } from 'lightning/utilsPrivate';

export function handleKeyDownOnDatePickerIcon(event, datepickerInterface) {
    switch (event.keyCode) {
        case keyCodes.enter:
        case keyCodes.space:
            preventDefaultAndStopPropagation(event);
            datepickerInterface.showCalendar();
            break;
        case keyCodes.escape:
            preventDefaultAndStopPropagation(event);
            datepickerInterface.hideCalendar();
            break;
        default:
    }
}

export function handleBasicKeyDownBehaviour(event, datepickerInterface) {
    if (!datepickerInterface.isCalendarVisible()) {
        return;
    }

    if (event.keyCode === keyCodes.escape) {
        preventDefaultAndStopPropagation(event);
        datepickerInterface.hideCalendar();
    }
}

function preventDefaultAndStopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
}
