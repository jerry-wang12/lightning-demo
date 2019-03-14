import { LightningElement, api } from 'lwc';
import { createAccordionManager } from 'lightning/accordionUtilsPrivate';

/**
 * A collection of vertically stacked sections with multiple content areas.
 */
export default class LightningAccordion extends LightningElement {
    privateIsSectionLessInLastRender = true;
    _allowMultipleSectionsOpen = false;
    connected = false;

    constructor() {
        super();

        this.privateAccordionManager = createAccordionManager();
        this.privateAccordionManager.attachOpenSectionObserver(() => {
            const openSections = this.activeSectionName;
            // there is nothing but to dispatch the sectiontoggle here.
            if (this.connected) {
                this.dispatchEvent(
                    new CustomEvent('sectiontoggle', {
                        detail: {
                            openSections,
                        },
                    })
                );
            }
        });
    }

    connectedCallback() {
        this.connected = true;
        this.setAttribute('role', 'list');
        this.classList.add('slds-accordion');

        this.addEventListener(
            'privateaccordionsectionregister',
            this.handleSectionRegister.bind(this)
        );
    }

    disconnectedCallback() {
        this.connected = false;
    }

    /**
     * Displays tooltip text when the mouse moves over the element.
     *
     * @type {string}
     */
    @api
    get title() {
        return this.getAttribute('title');
    }

    set title(value) {
        this.setAttribute('title', value);
    }

    /**
     * Changes the default expanded section.
     * The first section in the accordion is expanded by default.
     *
     * @type {string}
     */
    @api
    get activeSectionName() {
        const openSections = this.privateAccordionManager.openSectionsNames;

        if (!this.allowMultipleSectionsOpen) {
            return openSections.length ? openSections[0] : undefined;
        }

        return openSections;
    }

    set activeSectionName(value) {
        this._activeSectionName = value;

        if (!this.privateIsSectionLessInLastRender) {
            this.privateAccordionManager.openSectionByName(value);
        }
    }

    /**
     * If present, the accordion allows multiple open sections.
     * Otherwise, opening a section closes another that's currently open.
     *
     * @type {boolean}
     * @default false
     */
    @api
    get allowMultipleSectionsOpen() {
        return this._allowMultipleSectionsOpen;
    }

    set allowMultipleSectionsOpen(value) {
        this._allowMultipleSectionsOpen = value;
        this.privateAccordionManager.collapsible = value;
    }

    renderedCallback() {
        if (this.privateIsSectionLessInLastRender) {
            let hasOpenSection = false;
            // open sectionName or first section.
            if (this._activeSectionName) {
                hasOpenSection = this.privateAccordionManager.openSectionByName(
                    this._activeSectionName
                );
            }

            if (!(this._allowMultipleSectionsOpen || hasOpenSection)) {
                this.privateAccordionManager.openFirstSection();
            }
        }

        this.privateIsSectionLessInLastRender =
            this.privateAccordionManager.sections.length === 0;
    }

    get openedSection() {
        return this.privateAccordionManager.openedSection;
    }

    handleSectionRegister(event) {
        event.stopPropagation();
        event.preventDefault();
        const { detail } = event;

        const accordionSection = {
            id: detail.targetId,
            name: detail.targetName,
            ref: event.srcElement,
            open: detail.openSection,
            isOpen: detail.isOpen,
            close: detail.closeSection,
            focus: detail.focusSection,
            ackParentAccordion: detail.ackParentAccordion,
        };

        this.privateAccordionManager.registerSection(accordionSection);
    }
}
