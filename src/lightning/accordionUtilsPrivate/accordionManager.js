import {
    EventEmitter,
    keyCodes,
    normalizeBoolean,
} from 'lightning/utilsPrivate';
import { AccordionSectionList } from './accordionSectionList';
import { SingleOpenSectionStrategy } from './singleOpenSectionStrategy';
import { MultipleOpenSectionStrategy } from './multipleOpenSectionStrategy';

const ACCORDION_SECTION_DEREGISTER = 'accordion-section-deregister';
const ACCORDION_SECTION_SELECT = 'accordion-section-select';
const ACCORDION_SECTION_KEYNAV = 'accordion-section-keynav';

/**
 * Creates an accordion section observer for a section.
 *
 * @param {String} sectionId - The id of the section to observe.
 * @param {EventEmitter} eventEmitter - The the event emitter of the manager instance.
 * @returns {{notifySectionDeregister: notifySectionDeregister, notifySectionSelect: notifySectionSelect, notifySectionKeyNav: notifySectionKeyNav}} - Observer for the accordion section instance.
 */
function createAccordionSectionObserver(sectionId, eventEmitter) {
    return {
        notifySectionDeregister: () => {
            eventEmitter.emit(ACCORDION_SECTION_DEREGISTER, sectionId);
        },
        notifySectionSelect: () => {
            eventEmitter.emit(ACCORDION_SECTION_SELECT, sectionId);
        },
        notifySectionKeyNav: keyCode => {
            eventEmitter.emit(ACCORDION_SECTION_KEYNAV, sectionId, keyCode);
        },
    };
}

/**
 * Manage the state and logic of an accordion component.
 */
export class AccordionManager {
    privateAccordionSectionList;
    privateOpenSectionObservers = [];
    privateEventEmitter;
    privateCollapsible = false;
    privateAccordionStrategies;

    constructor(
        accordionSectionList,
        singleOpenSectionStrategy,
        multipleOpenSectionStrategy
    ) {
        this.privateAccordionSectionList = accordionSectionList;
        this.privateAccordionStrategies = {
            false: singleOpenSectionStrategy,
            true: multipleOpenSectionStrategy,
        };
        this._configureSectionsEventEmitter();
    }

    get sectionStrategy() {
        return this.privateAccordionStrategies[this.collapsible];
    }

    get collapsible() {
        return this.privateCollapsible;
    }

    set collapsible(value) {
        // @todo: assert oldValue === true and value === false. This is not supported so far.
        this.privateCollapsible = normalizeBoolean(value);
    }

    attachOpenSectionObserver(observerCb) {
        this.privateOpenSectionObservers.push(observerCb);
    }

    get sections() {
        return this.privateAccordionSectionList.sections;
    }

    /**
     * It opens the first section.
     * Is used as the default for the SingleOpenSection accordion.
     */
    openFirstSection() {
        const openSectionsChange = this.sectionStrategy.openFirstSection();

        if (openSectionsChange) {
            this._notifyOpenSectionChange();
        }
    }

    /**
     * Returns a list of open sections names.
     *
     * **Notes:
     * - If section does not have name defined, then it wont be here.
     * - If there is 2 open sections with the same name, only one will be here.
     *
     * @return {string[]} the open sections names
     */
    get openSectionsNames() {
        const openSections = this.privateAccordionSectionList.openSections;

        const namesMap = openSections.reduce((accumulator, currentValue) => {
            if (currentValue.name) {
                accumulator[currentValue.name] = true;
            }

            return accumulator;
        }, {});

        return Object.keys(namesMap);
    }

    /**
     * Open a section(s) by the name.
     *
     * @param {String} sectionName The name(s) of the sections to open
     * @return {Boolean} whether the open sections changed or not
     */
    openSectionByName(sectionName) {
        const sectionsChanged = this.sectionStrategy.openSectionByName(
            sectionName
        );

        if (sectionsChanged) {
            this._notifyOpenSectionChange();
        }

        return sectionsChanged;
    }

    /**
     * Register a section.
     *
     * @param {Object} accordionSectionInterface - An accordion section interface:
     *      - id: used to identify this section,
     *      - name: the name of the section,
     *      - ref: the DOM element corresponding to this section,
     *      - open: function to open the section,
     *      - isOpen: function that returns true if the section is open,
     *      - close: function to close the section,
     *      - focus: function to focus the section,
     *      - ackParentAccordion: function that is called from the parent accordion of the section to pass information down to the section, a section observer is sent.
     */
    registerSection(accordionSectionInterface) {
        this.privateAccordionSectionList.add(accordionSectionInterface);

        accordionSectionInterface.ackParentAccordion(
            createAccordionSectionObserver(
                accordionSectionInterface.id,
                this.privateEventEmitter
            )
        );
    }

    _handleSectionSelect(sectionId) {
        const sectionChanged = this.sectionStrategy.handleSectionSelect(
            sectionId
        );

        if (sectionChanged) {
            this._notifyOpenSectionChange();
        }
    }

    /**
     * Deregister an accordion section. In case its the open one, it will open the next registered section.
     *
     * @param {String} deletedSectionId The section id of the removed section.
     */
    _deregisterSection(deletedSectionId) {
        const sectionsChanged = this.sectionStrategy.handleSectionWillDeregister(
            deletedSectionId
        );
        this.privateAccordionSectionList.remove(deletedSectionId);

        if (sectionsChanged) {
            this._notifyOpenSectionChange();
        }
    }

    _configureSectionsEventEmitter() {
        this.privateEventEmitter = new EventEmitter();

        this.privateEventEmitter
            .on(ACCORDION_SECTION_DEREGISTER, sectionId => {
                this._deregisterSection(sectionId);
            })
            .on(ACCORDION_SECTION_KEYNAV, (sectionId, keyCode) => {
                this._handleSectionKeyNav(sectionId, keyCode);
            })
            .on(ACCORDION_SECTION_SELECT, sectionId => {
                this._handleSectionSelect(sectionId);
            });
    }

    _notifyOpenSectionChange() {
        this.privateOpenSectionObservers.forEach(observerCallback =>
            observerCallback()
        );
    }

    /**
     * Handles keyboard navigation.
     *
     * @param {String} selectedSectionId The section id from which the key event is triggered
     * @param {left | up | right | down} keyCode The key pressed.
     */
    _handleSectionKeyNav(selectedSectionId, keyCode) {
        const isReverseDirection =
            keyCode === keyCodes.left || keyCode === keyCodes.up;
        const sectionList = this.privateAccordionSectionList;
        const nextSection = isReverseDirection
            ? sectionList.getPrevSectionTo(selectedSectionId)
            : sectionList.getNextSectionTo(selectedSectionId);

        if (nextSection !== null) {
            nextSection.focus();
        }
    }
}

/**
 * Instantiates an accordion manager
 *
 * @return {AccordionManager} A new instance of an accordion manager.
 */
export function createAccordionManager() {
    const accordionSectionList = new AccordionSectionList();
    const singleOpenSectionStrategy = new SingleOpenSectionStrategy(
        accordionSectionList
    );
    const multipleOpenSectionStrategy = new MultipleOpenSectionStrategy(
        accordionSectionList
    );

    return new AccordionManager(
        accordionSectionList,
        singleOpenSectionStrategy,
        multipleOpenSectionStrategy
    );
}
