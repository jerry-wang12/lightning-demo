import { LightningElement, api, track } from 'lwc';
import { normalizeString } from 'lightning/utilsPrivate';
import { generateUniqueId } from 'lightning/inputUtils';

const tabClassPrefixByVariant = {
    scoped: 'slds-tabs_scoped',
    vertical: 'slds-vertical-tabs',
    standard: 'slds-tabs_default',
};

/**
 * Represents a list of tabs.
 */
export default class LightningTabset extends LightningElement {
    /**
     * Displays tooltip text when the mouse moves over the tabset.
     * @type {string}
     */
    @api title;

    @track _tabHeaders = [];
    @track _variant = 'standard';

    connectedCallback() {
        this._tabByValue = {};
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * The variant changes the appearance of the tabset. Accepted variants are standard, scoped, and vertical.
     * @type {string}
     */
    @api
    get variant() {
        return this._variant;
    }

    set variant(value) {
        this._variant = normalizeString(value, {
            fallbackValue: 'standard',
            validValues: ['scoped', 'vertical'],
        });
    }

    /**
     * Sets a specific tab to open by default using a string that matches a tab's value string. If not used, the first tab opens by default.
     * @type {string}
     */
    @api
    get activeTabValue() {
        return this._activeTabValue;
    }

    set activeTabValue(tabValue) {
        const newTabValue = tabValue && String(tabValue);
        if (!newTabValue || this._activeTabValue === newTabValue) {
            // already selected, do nothing
            return;
        }

        if (this._connected) {
            const tab = this._tabByValue[tabValue];
            if (tab) {
                this._selectTab(tabValue);
            }
        } else {
            this._activeTabValue = newTabValue;
        }
    }

    handleTabRegister(event) {
        event.stopPropagation();

        const tab = event.target;

        tab.role = 'tabpanel';
        const generatedUniqueId = generateUniqueId('tab');
        if (!tab.id) {
            // We need a tab.id on the tab component to ensure that aria-controls from tab-bar can point to it
            tab.id = generatedUniqueId;
        }

        if (!tab.value) {
            tab.value = generatedUniqueId;
        }
        const tabValue = tab.value;

        tab.dataTabValue = tabValue;
        tab.ariaLabelledBy = tabValue + '__item';

        tab.classList.add(`${tabClassPrefixByVariant[this.variant]}__content`);

        tab.classList.add('slds-hide');
        tab.classList.remove('slds-show');

        const tabs = this.querySelectorAll(`[role='tabpanel']`);
        let tabIndex;
        for (tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
            if (tabs[tabIndex].dataTabValue === tabValue) {
                break;
            }
        }

        event.detail.setDeRegistrationCallback(() => {
            if (!this._connected) {
                return;
            }
            const index = this._tabHeaders.findIndex(
                existingTab => existingTab.value === tabValue
            );
            if (index >= 0) {
                this._tabHeaders.splice(index, 1);

                this._queueTabBarRefresh();

                this._tabByValue[tabValue] = undefined;
                if (this._activeTabValue === tab.value) {
                    this._showTabContentForTabValue(this._tabHeaders[0].value);
                }
            }
        });

        // if no activeTabValue specified, we will default to the first registered tab
        if (!this._activeTabValue) {
            this._activeTabValue = tab.value;
        }

        this._tabHeaders.splice(tabIndex, 0, {
            value: tabValue,
            label: tab.label,
            domId: tab.id,
            title: tab.title,
            iconName: tab.iconName,
            iconAssistiveText: tab.iconAssistiveText,
            showErrorIndicator: tab.showErrorIndicator,
        });
        this._tabByValue[tabValue] = tab;

        this._queueTabBarRefresh();

        if (this._activeTabValue === tab.value) {
            this._selectTab(tabValue);
        }
    }

    _selectTab(value) {
        if (this._requestAnimationId) {
            cancelAnimationFrame(this._requestAnimationId);
        }

        this._requestAnimationId = requestAnimationFrame(() => {
            this._showTabContentForTabValue(value);
            this._selectTabHeaderByTabValue(value);
        });
    }

    _showTabContentForTabValue(value) {
        const tab = this._tabByValue[value];
        if (!tab) {
            return;
        }

        if (this._activeTabValue) {
            const currentTab = this._tabByValue[this._activeTabValue];
            if (currentTab) {
                currentTab.classList.add('slds-hide');
                currentTab.classList.remove('slds-show');
            }
        }
        this._activeTabValue = tab.value;
        tab.classList.add('slds-show');
        tab.classList.remove('slds-hide');
        tab.loadContent();
    }

    _selectTabHeaderByTabValue(value) {
        if (!this._connected) {
            return;
        }

        const tabBar = this.template.querySelector('lightning-tab-bar');
        tabBar.selectTabByValue(value);
    }

    handleTabSelected(event) {
        const selectedTabValue = event.detail.value;
        const tab = this._tabByValue[selectedTabValue];
        if (this._activeTabValue !== tab.value) {
            this._showTabContentForTabValue(selectedTabValue);
        }
    }

    handleTabDataChange(event) {
        const changedTab = event.target;
        const newTabValue = changedTab.value;
        const currentTabValue = changedTab.dataTabValue;
        const matchingTabHeader = this._tabHeaders.find(
            tabHeader => tabHeader.value === currentTabValue
        );
        if (matchingTabHeader) {
            matchingTabHeader.label = changedTab.label;
            matchingTabHeader.value = newTabValue;
            matchingTabHeader.title = changedTab.title;
            matchingTabHeader.iconName = changedTab.iconName;
            matchingTabHeader.iconAssistiveText = changedTab.iconAssistiveText;
            matchingTabHeader.showErrorIndicator =
                changedTab.showErrorIndicator;
        }

        this._queueTabBarRefresh();

        if (currentTabValue !== newTabValue) {
            const tab = this._tabByValue[currentTabValue];
            if (tab) {
                tab.dataTabValue = newTabValue;
                this._tabByValue[newTabValue] = this._tabByValue[
                    currentTabValue
                ];
                this._tabByValue[currentTabValue] = undefined;
            }
            if (this._activeTabValue === currentTabValue) {
                this._activeTabValue = newTabValue;
            }
        }
    }

    _queueTabBarRefresh() {
        this._tabHeaders = this._tabHeaders.slice();
    }

    get computedClass() {
        return tabClassPrefixByVariant[this.variant];
    }
}
