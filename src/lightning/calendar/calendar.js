import labelAriaLabelMonth from '@salesforce/label/LightningDateTimePicker.ariaLabelMonth';
import labelNextMonth from '@salesforce/label/LightningDateTimePicker.nextMonth';
import labelPreviousMonth from '@salesforce/label/LightningDateTimePicker.previousMonth';
import labelToday from '@salesforce/label/LightningDateTimePicker.today';
import labelYearSelector from '@salesforce/label/LightningDateTimePicker.yearSelector';
import { LightningElement, track, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { generateUniqueId } from 'lightning/inputUtils';
import {
    handleKeyDownOnCalendar,
    handleKeyDownOnToday,
    handleKeyDownOnPreviousMonthNav,
} from './keyboard';
import {
    getLocale,
    toOtherCalendar,
    fromOtherCalendar,
    getToday,
    isBefore,
    isAfter,
    isSame,
    parseDateTime,
    formatDate,
    getNameOfWeekdays,
    getMonthNames,
    STANDARD_DATE_FORMAT,
    TIME_SEPARATOR,
} from 'lightning/dateTimeUtils';

const i18n = {
    ariaLabelMonth: labelAriaLabelMonth,
    nextMonth: labelNextMonth,
    previousMonth: labelPreviousMonth,
    today: labelToday,
    yearSelector: labelYearSelector,
};

const WEEKS_PER_MONTH = 6;
const DAYS_PER_WEEK = 7;
const calendarCache = {}; // cache of calendar cells for a given year/month

export default class LightningCalendar extends LightningElement {
    @track calendarYear = null;
    @track calendarMonth = null;

    @api min;
    @api max;

    @api
    get value() {
        return this.selectedDate;
    }
    set value(newValue) {
        // if value is an ISO string, only fetch the time part
        const dateOnlyString =
            typeof newValue === 'string'
                ? newValue.split(TIME_SEPARATOR)[0]
                : newValue;

        if (dateOnlyString !== this.selectedDate) {
            this.selectedDate = dateOnlyString;

            if (!this.connected) {
                return;
            }

            const newDate = this.parseDate(dateOnlyString);

            // if the date is invalid, render today's date
            if (!newDate) {
                this.selectedDate = null;

                this.renderToday();
            } else {
                this.selectDate(newDate);
            }
        }
    }

    initialRender = true;

    constructor() {
        super();
        this.uniqueId = generateUniqueId();
    }

    renderedCallback() {
        if (this.initialRender) {
            this.todayDate = getToday();

            // The connected logic here is needed because at the point when the @api setters are called, the actual value
            // for today's date may not have been set yet
            this.connected = true;

            const renderDate = this.getSelectedDate() || this.getTodaysDate();
            this.renderCalendar(renderDate);
            this.initialRender = false;
        }
    }

    connectedCallback() {
        this.keyboardInterface = this.calendarKeyboardInterface();
    }

    disconnectedCallback() {
        this.connected = false;
    }

    /**
     * Sets focus on the focusable date cell in the calendar.
     */
    @api
    focus() {
        requestAnimationFrame(() => {
            const dateElement = this.getFocusableDateCell();
            if (dateElement) {
                dateElement.focus();
            }
        });
    }

    get i18n() {
        return i18n;
    }

    get computedAriaLabel() {
        const renderedMonth = this.getCalendarDate().getMonth();
        return i18n.ariaLabelMonth + getMonthNames()[renderedMonth].fullName;
    }

    get computedMonthTitle() {
        const renderedMonth = this.getCalendarDate().getMonth();
        return getMonthNames()[renderedMonth].fullName;
    }

    get computedWeekdayLabels() {
        const nameOfWeekdays = getNameOfWeekdays();
        const firstDayOfWeek = this.getFirstDayOfWeek();
        const computedWeekdayLabels = [];

        // We need to adjust the weekday labels to start from the locale's first day of week
        for (let i = firstDayOfWeek; i < nameOfWeekdays.length; i++) {
            computedWeekdayLabels.push(nameOfWeekdays[i]);
        }
        for (let i = 0; i < firstDayOfWeek; i++) {
            computedWeekdayLabels.push(nameOfWeekdays[i]);
        }

        return computedWeekdayLabels;
    }

    get computedSelectElementId() {
        return this.uniqueId + '-select';
    }

    get computedWeekdaysElementId() {
        return this.uniqueId + '-weekdays';
    }

    get computedMonthTitleId() {
        return this.uniqueId + '-month';
    }

    get computedYearList() {
        const sampleDate = new Date();
        const currentYear = sampleDate.getFullYear();

        const minDate = this.parseDate(this.min);
        const maxDate = this.parseDate(this.max);

        const minYear = minDate ? minDate.getFullYear() : currentYear - 100;
        sampleDate.setFullYear(minYear);
        const convertedMinYear = toOtherCalendar(sampleDate).getFullYear();

        const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 100;
        sampleDate.setFullYear(maxYear);
        const convertedMaxYear = toOtherCalendar(sampleDate).getFullYear();

        const yearList = [];
        for (let year = convertedMinYear; year <= convertedMaxYear; year++) {
            yearList.push(year);
        }
        return yearList;
    }

    get computedMonth() {
        // The calendar will be rendered after getting today's date based on the user's timezone
        if (!this.connected) {
            return [];
        }

        this.removeCurrentlySelectedDateAttributes();

        const selectedDate = this.getSelectedDate();
        const renderDate = this.getCalendarDate();

        const cacheKey = this.getCalendarCacheKey(renderDate, selectedDate);
        if (cacheKey in calendarCache) {
            return calendarCache[cacheKey];
        }

        const todayDate = this.getTodaysDate();
        const focusableDate = this.getInitialFocusDate(
            todayDate,
            selectedDate,
            renderDate
        );

        const calendarDates = {
            selectedDate,
            renderDate,
            focusableDate,
            todayDate,
            minDate: this.parseDate(this.min),
            maxDate: this.parseDate(this.max),
        };

        const monthCells = [];
        const date = this.getCalendarStartDate(renderDate);
        for (let week = 0; week < WEEKS_PER_MONTH; week++) {
            const weekCells = {
                id: week,
                days: [],
            };
            for (let weekday = 0; weekday < DAYS_PER_WEEK; weekday++) {
                const dayCell = this.getDateCellAttributes(date, calendarDates);
                weekCells.days.push(dayCell);

                date.setDate(date.getDate() + 1);
            }

            monthCells.push(weekCells);
        }

        calendarCache[cacheKey] = monthCells;
        return monthCells;
    }

    getDateCellAttributes(date, calendarDates) {
        const isDisabled =
            !this.dateInCalendar(date, calendarDates.renderDate) ||
            !this.isBetween(date, calendarDates.minDate, calendarDates.maxDate);

        const isSelected = this.isSame(date, calendarDates.selectedDate);
        const isToday = this.isSame(date, calendarDates.todayDate);
        const ariaCurrent = isToday ? 'date' : false;
        const tabIndex = this.isSame(date, calendarDates.focusableDate)
            ? '0'
            : false;

        const className = classSet()
            .add({
                'slds-is-today': isToday,
                'slds-is-selected': isSelected,
                'slds-disabled-text': isDisabled,
            })
            .toString();

        return {
            date: date.getDate(),
            dateValue: this.formatDate(date),
            isDisabled,
            isSelected: isSelected ? 'true' : 'false',
            className,
            tabIndex,
            ariaCurrent,
        };
    }

    dispatchSelectEvent() {
        this.dispatchEvent(
            new CustomEvent('select', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: { value: this.selectedDate },
            })
        );
    }

    // Determines if the date is in the rendered month/year calendar.
    dateInCalendar(date, calendarDate) {
        const renderedCalendar = calendarDate || this.getCalendarDate();
        return (
            date.getMonth() === renderedCalendar.getMonth() &&
            date.getFullYear() === renderedCalendar.getFullYear()
        );
    }

    getInitialFocusDate(todayDate, selectedDate, renderedDate) {
        if (selectedDate && this.dateInCalendar(selectedDate, renderedDate)) {
            return selectedDate;
        }
        if (this.dateInCalendar(todayDate, renderedDate)) {
            return todayDate;
        }
        return new Date(renderedDate.getFullYear(), renderedDate.getMonth(), 1);
    }

    getTodaysDate() {
        if (this.todayDate) {
            return this.parseDate(this.todayDate);
        }
        // Today's date will be fetched in connectedCallback. In the meantime, use the date based on the device timezone.
        return new Date();
    }

    getSelectedDate() {
        return this.parseDate(this.selectedDate);
    }

    // returns the month and year in the calendar
    getCalendarDate() {
        if (this.calendarYear) {
            return new Date(this.calendarYear, this.calendarMonth, 1);
        }
        return this.getTodaysDate();
    }

    getCalendarStartDate(renderedDate) {
        const firstDayOfMonth = new Date(
            renderedDate.getFullYear(),
            renderedDate.getMonth(),
            1
        );

        return this.getStartOfWeek(firstDayOfMonth);
    }

    getStartOfWeek(dayInWeek) {
        const firstDayOfWeek = this.getFirstDayOfWeek();

        // Negative dates in JS will subtract days from the 1st of the given month
        let startDay = dayInWeek.getDay();
        while (startDay !== firstDayOfWeek) {
            dayInWeek.setDate(dayInWeek.getDate() - 1);
            startDay = dayInWeek.getDay();
        }
        return dayInWeek;
    }

    getFirstDayOfWeek() {
        return getLocale().firstDayOfWeek - 1; // In Java, week days are 1 - 7
    }

    // This method is called when a new value is set, or when you click the today button.
    // In both cases, we need to check if newValue is in the currently rendered calendar
    selectDate(newDate) {
        if (this.dateInCalendar(newDate)) {
            const dateElement = this.getElementByDate(this.formatDate(newDate));

            // do not select if date is disabled
            if (this.dateElementDisabled(dateElement)) {
                return;
            }

            this.selectDateInCalendar(dateElement);
        } else {
            this.renderCalendar(newDate);
        }
    }

    // Select a date in current calendar without the need to re-render the calendar
    selectDateInCalendar(dateElement) {
        this.selectedDate = dateElement.getAttribute('data-value');

        this.removeCurrentlySelectedDateAttributes();
        this.addSelectedDateAttributes(dateElement);
    }

    selectDateInCalendarAndDispatchSelect(dateElement) {
        // do not select if date is disabled
        if (this.dateElementDisabled(dateElement)) {
            return;
        }

        this.selectDateInCalendar(dateElement);
        this.dispatchSelectEvent();
    }

    // we should be able to control the select value with an attribute once we have a select component
    selectYear(year) {
        const sampleDate = new Date();
        sampleDate.setFullYear(year);
        const convertedYear = toOtherCalendar(sampleDate).getFullYear();

        const optionElement = this.template.querySelector(
            `option[value='${convertedYear}']`
        );
        if (optionElement) {
            optionElement.selected = true;
        }
    }

    getElementByDate(dateString) {
        return this.template.querySelector(`td[data-value='${dateString}']`);
    }

    getFocusableDateCell() {
        return this.template.querySelector(`td[tabIndex='0']`);
    }

    unfocusDateCell(element) {
        if (element) {
            element.removeAttribute('tabIndex');
        }
    }

    focusDateCell(element) {
        if (element) {
            element.setAttribute('tabIndex', 0);
            element.focus();
        }
    }

    focusElementByDate(date) {
        requestAnimationFrame(() => {
            const element = this.getElementByDate(this.formatDate(date));
            if (element) {
                this.unfocusDateCell(this.getFocusableDateCell());
                this.focusDateCell(element);
            }
        });
    }

    renderCalendar(newDate) {
        this.calendarMonth = newDate.getMonth();
        this.calendarYear = newDate.getFullYear();

        this.selectYear(newDate.getFullYear());
    }

    renderToday() {
        const todaysDate = this.getTodaysDate();

        if (this.dateInCalendar(todaysDate)) {
            this.removeCurrentlySelectedDateAttributes();

            this.unfocusDateCell(this.getFocusableDateCell());

            const todayElement = this.getElementByDate(this.todayDate);
            todayElement.setAttribute('tabIndex', 0);
        } else {
            this.renderCalendar(todaysDate);
        }
    }

    removeCurrentlySelectedDateAttributes() {
        const currentlySelectedElement = this.template.querySelector(
            `td[class*='slds-is-selected']`
        );
        if (currentlySelectedElement) {
            currentlySelectedElement.classList.remove('slds-is-selected');
            currentlySelectedElement.setAttribute('aria-selected', 'false');
        }
        this.unfocusDateCell(this.getFocusableDateCell());
    }

    addSelectedDateAttributes(dateElement) {
        this.focusDateCell(dateElement);

        dateElement.classList.add('slds-is-selected');
        dateElement.setAttribute('aria-selected', 'true');
    }

    dateElementDisabled(dateElement) {
        // do not select if date is disabled
        return (
            !dateElement || dateElement.getAttribute('aria-disabled') === 'true'
        );
    }

    handleCalendarKeyDown(event) {
        const dateString = event.target.getAttribute('data-value');

        handleKeyDownOnCalendar(
            event,
            this.parseDate(dateString),
            this.keyboardInterface
        );
    }

    handleTodayKeyDown(event) {
        handleKeyDownOnToday(event, this.keyboardInterface);
    }

    handlePrevNavKeyDown(event) {
        handleKeyDownOnPreviousMonthNav(event, this.keyboardInterface);
    }

    handleDateClick(event) {
        event.stopPropagation();

        const tdElement = event.target.parentElement;
        this.selectDateInCalendarAndDispatchSelect(tdElement);
    }

    handleTodayClick(event) {
        event.stopPropagation();

        this.selectedDate = this.todayDate;
        this.selectDate(this.getTodaysDate());

        this.dispatchSelectEvent();
    }

    handleYearSelectClick(event) {
        event.stopPropagation();
    }

    handleYearChange(event) {
        const sampleDate = new Date();
        sampleDate.setFullYear(event.target.value);
        const convertedYear = fromOtherCalendar(sampleDate).getFullYear();

        if (this.calendarYear !== convertedYear) {
            this.calendarYear = convertedYear;
        }
    }

    goToNextMonth(event) {
        event.stopPropagation();

        const calendarDate = this.getCalendarDate();
        calendarDate.setMonth(calendarDate.getMonth() + 1);

        this.renderCalendar(calendarDate);
    }

    goToPreviousMonth(event) {
        event.stopPropagation();

        const calendarDate = this.getCalendarDate();
        calendarDate.setMonth(calendarDate.getMonth() - 1);

        this.renderCalendar(calendarDate);
    }

    calendarKeyboardInterface() {
        const that = this;
        return {
            focusDate(newDate) {
                if (!that.dateInCalendar(newDate)) {
                    that.renderCalendar(newDate);
                }

                that.focusElementByDate(newDate);
            },
            getStartOfWeek(dayInWeek) {
                return that.getStartOfWeek(dayInWeek);
            },
            focusFirstFocusableElement() {
                that.template.querySelector('lightning-button-icon').focus();
            },
            focusLastFocusableElement() {
                that.template.querySelector('button[name="today"]').focus();
            },
            selectDate(dateElement) {
                that.selectDateInCalendarAndDispatchSelect(dateElement);
            },
        };
    }

    formatDate(date) {
        return formatDate(date, STANDARD_DATE_FORMAT);
    }

    parseDate(dateString) {
        return parseDateTime(dateString, STANDARD_DATE_FORMAT, true);
    }

    isSame(date1, date2) {
        return isSame(date1, date2);
    }

    isBetween(date, date1, date2) {
        let isBeforeEndDate = true;
        let isAfterStartDate = true;

        if (date2) {
            isBeforeEndDate =
                isBefore(date, date2, 'day') || this.isSame(date, date2);
        }

        if (date1) {
            isAfterStartDate =
                isAfter(date, date1, 'day') || this.isSame(date, date1);
        }

        return isBeforeEndDate && isAfterStartDate;
    }

    getCalendarCacheKey(renderDate, selectedDate) {
        let key = renderDate.getFullYear() + '-' + renderDate.getMonth();
        // Having the key include min/max seems enough for now.
        // We're not going to complicate things by checking if renderDate falls before/after the min/max.
        key += this.min ? 'min' + this.min : '';
        key += this.max ? 'max' + this.max : '';

        if (selectedDate && this.dateInCalendar(selectedDate, renderDate)) {
            key += '_' + selectedDate.getDate();
        }
        return key;
    }
}
