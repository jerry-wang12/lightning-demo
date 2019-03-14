import labelOverflowMore from '@salesforce/label/LightningTabs.overflowMore';
import labelOverflowMoreAlternativeText from '@salesforce/label/LightningTabs.overflowMoreAlternativeText';
import labelOverflowMoreTitle from '@salesforce/label/LightningTabs.overflowMoreTitle';
import labelErrorStateAlternativeText from '@salesforce/label/LightningTabs.errorStateAlternativeText';

import { LightningElement, api, track, unwrap } from 'lwc';
import { classSet } from 'lightning/utils';
import { calculateOverflow } from 'lightning/overflowLibrary';
import { LightningResizeObserver } from 'lightning/resizeObserver';
import { handleKeyDownOnTabList } from './keyboard';

const i18n = {
    more: labelOverflowMore,
    moreAlternativeText: labelOverflowMoreAlternativeText,
    moreTitle: labelOverflowMoreTitle,
    errorStateAlternativeText: labelErrorStateAlternativeText,
};

export default class LightningTabBar extends LightningElement {
    @api disableOverflow = false;

    @track _allTabs = [];
    @track _hasOverflow = false;

    @track _variant;

    connectedCallback() {
        this._connected = true;
        if (this.overflowSupported) {
            this._queueOverflow();
        }
    }

    renderedCallback() {
        if (this.overflowSupported && !this._resizeObserver) {
            this._resizeObserver = this._setupResizeObserver();
        }
    }

    disconnectedCallback() {
        this._connected = false;
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
    }

    @api
    get variant() {
        return this._variant;
    }

    set variant(value) {
        if (this._connected && value === 'vertical') {
            if (this._resizeObserver) {
                this._resizeObserver.disconnect();
            }
        }
        this._variant = value;
    }

    @api
    get tabHeaders() {
        return this._tabHeaders;
    }

    set tabHeaders(tabHeaders = []) {
        this._tabHeaders = tabHeaders;
        const allTabs = tabHeaders.map(tab => {
            const classNames = this.tabClass({});
            const linkClassNames = this.computedLinkClass;
            return {
                label: tab.label,
                title: tab.title || tab.label,
                linkId: tab.value + '__item',
                domId: tab.domId,
                value: String(tab.value),
                class: classNames,
                linkClass: linkClassNames,
                tabIndex: -1,
                ariaSelected: false,
                contentId: '',
                visible: true,
                iconName: tab.iconName,
                iconAssistiveText: tab.iconAssistiveText,
                showErrorIndicator: tab.showErrorIndicator,
            };
        });

        let selectedTab = allTabs[0];
        if (this._selectedTab) {
            selectedTab = allTabs.find(
                tab => tab.value === this._selectedTab.value
            );
            if (!selectedTab) {
                selectedTab = allTabs[0];
            }
        }
        if (selectedTab) {
            this._selectedTab = selectedTab;
            selectedTab.class = this.tabClass({ selected: true });
            selectedTab.ariaSelected = 'true';
            selectedTab.tabIndex = 0;
        }
        this._allTabs = allTabs;

        if (this._connected && this.overflowSupported) {
            requestAnimationFrame(this._queueOverflow.bind(this));
        }
    }

    @api
    selectTabByValue(tabValue) {
        this._selectTab(tabValue);
    }

    get overflowSupported() {
        return this._variant !== 'vertical' && !this.disableOverflow;
    }

    get computedLinkClass() {
        const isScopedVariant = this._variant === 'scoped';
        const isVerticalVariant = this._variant === 'vertical';

        const linkClassNames = classSet()
            .add({
                'slds-tabs_default__link':
                    !isScopedVariant && !isVerticalVariant,
                'slds-tabs_scoped__link': isScopedVariant,
                'slds-vertical-tabs__link': isVerticalVariant,
            })
            .toString();
        return linkClassNames;
    }

    get computedOverflowVisibility() {
        return this._hasOverflow ? '' : 'visibility: hidden;';
    }

    get i18n() {
        return i18n;
    }

    handleOverflowSelect(event) {
        event.stopPropagation();
        this._selectTabAndFireSelectEvent(event.detail.value);

        if (this._hasOverflow) {
            this._recomputeOverflow();
        }
    }

    handleTabClick(event) {
        // Don't navigate to href. Since href is set to "javascript:void(0)", if event default action is not prevented
        // the browser attempts to navigate to the url provided, thus raising a CSP violation that doesn't allow
        // javascript: in urls.
        event.preventDefault();

        const clickedtabValue = event.target.getAttribute('data-tab-value');
        this._selectTabAndFireSelectEvent(clickedtabValue, { hasFocus: true });
    }

    _findTabByValue(tabValue) {
        return this._allTabs.find(tab => tab.value === tabValue);
    }

    _selectTabAndFireSelectEvent(tabValue, options) {
        this._selectTab(tabValue, options);

        const tab = this._findTabByValue(tabValue);

        this.dispatchEvent(
            new CustomEvent('select', {
                detail: {
                    value: tab.value,
                    label: tab.label,
                },
            })
        );
    }

    _selectTab(tabValue, options = {}) {
        const tab = this._findTabByValue(tabValue);

        if (!tab) {
            return;
        }

        if (this._selectedTab) {
            if (this._selectedTab.value === tabValue) {
                // already selected, do nothing
                return;
            }

            this._selectedTab.hasFocus = false;
            this._selectedTab.ariaSelected = 'false';
            this._selectedTab.class = this.tabClass({});
            this._selectedTab.tabIndex = -1;
        }
        tab.hasFocus = true;
        tab.ariaSelected = 'true';
        tab.class = this.tabClass({
            selected: true,
            hasFocus: options.hasFocus,
        });
        tab.tabIndex = 0;

        this._selectedTab = tab;
    }

    handleBlur(event) {
        const tabValue = event.target.getAttribute('data-tab-value');
        const tab = this._findTabByValue(tabValue);
        if (tab) {
            tab.class = this.tabClass({
                selected: this._selectedTab.value === tab.value,
                hasFocus: false,
            });
        }
    }

    handleFocus(event) {
        const tabValue = event.target.getAttribute('data-tab-value');
        const tab = this._findTabByValue(tabValue);

        tab.class = this.tabClass({
            selected: this._selectedTab.value === tab.value,
            hasFocus: true,
        });
    }

    get _visibleTabs() {
        return this._allTabs.filter(tab => tab.visible);
    }

    handleKeyDown(event) {
        let currentFocusedIndex = 0;

        if (this._selectedTab) {
            currentFocusedIndex = this._visibleTabs.findIndex(
                tab => tab.value === this._selectedTab.value
            );
        }
        handleKeyDownOnTabList(event, currentFocusedIndex, {
            isVerticalOrientation: () => this._variant === 'vertical',
            totalTabs: () => this._visibleTabs.length,
            selectTabIndex: index => {
                const tab = this._visibleTabs[index];
                this._selectTabAndFireSelectEvent(tab.value, {
                    hasFocus: true,
                });
                this.template
                    .querySelector(`a[data-tab-value="${tab.value}"]`)
                    .focus();
            },
        });
    }

    get computedAriaOrientation() {
        return this._variant === 'vertical' ? 'vertical' : null;
    }

    get computedListClass() {
        const isScoped = this._variant === 'scoped';
        const isVertical = this._variant === 'vertical';
        return classSet()
            .add({
                'slds-tabs_scoped__nav': isScoped,
                'slds-vertical-tabs__nav': isVertical,
                'slds-tabs_default__nav': !isScoped && !isVertical,
            })
            .toString();
    }

    tabClass({ selected = false, hasFocus = false }) {
        const isScopedVariant = this._variant === 'scoped';
        const isVerticalVariant = this._variant === 'vertical';
        return classSet()
            .add({
                'slds-tabs_default__item':
                    !isScopedVariant && !isVerticalVariant,
                'slds-tabs_scoped__item': isScopedVariant,
                'slds-vertical-tabs__nav-item': isVerticalVariant,
                'slds-is-active': selected,
                'slds-has-focus': hasFocus,
            })
            .toString();
    }

    get computedOverflowClass() {
        const tabStyle = this._variant === 'scoped' ? 'scoped' : 'default';
        return `slds-tabs_${tabStyle}__item slds-tabs_${tabStyle}__overflow-button`;
    }

    _setupResizeObserver() {
        const resizeObserver = new LightningResizeObserver(
            this._queueOverflow.bind(this)
        );
        resizeObserver.observe(this.template.querySelector('[role="tablist"]'));
        return resizeObserver;
    }

    _queueOverflow() {
        this._allTabs.forEach(tab => {
            tab.visible = true;
        });
        requestAnimationFrame(this._recomputeOverflow.bind(this));
    }

    _recomputeOverflow() {
        if (!this._connected) {
            return;
        }

        const tabHeaderElements = this.template.querySelectorAll('[data-tab]');
        for (let i = 0; i < tabHeaderElements.length; i++) {
            const tabHeaderElement = tabHeaderElements[i];
            const tabValue = tabHeaderElement.getAttribute('data-tab-value');

            const tab = this._findTabByValue(tabValue);
            let tabWidth = tabHeaderElement.getBoundingClientRect().width;
            // eslint-disable-next-line lightning-global/check-return-value-for-nullable-call
            const computedStyle = getComputedStyle(unwrap(tabHeaderElement));
            if (computedStyle) {
                tabWidth +=
                    parseFloat(computedStyle.marginLeft) +
                    parseFloat(computedStyle.marginRight);
            }
            tab.width = tabWidth;
        }
        const overflowElement = this.template.querySelector('[data-overflow]');

        const overflowData = calculateOverflow({
            items: this._allTabs,
            activeItem: this._selectedTab,
            containerWidth: this.getBoundingClientRect().width,
            overflowWidth: overflowElement.getBoundingClientRect().width,
        });

        overflowData.overflowItems.forEach(overflowItem => {
            if (overflowItem.visible) {
                overflowItem.visible = false;
            }
        });
        this._hasOverflow =
            overflowData.overflowItems && overflowData.overflowItems.length > 0;

        overflowData.visibleItems.forEach(overflowItem => {
            if (!overflowItem.visible) {
                overflowItem.visible = true;
            }
        });
    }
}
