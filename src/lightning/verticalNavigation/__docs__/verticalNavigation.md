---
examples:
 - name: basic
   label: Basic Vertical Navigation
   description: A vertical navigation includes at least one navigation section and item.
 - name: selected
   label: Vertical Navigation with Default Selection
   description: A selected item is highlighted in blue.
 - name: icon
   label: Vertical Navigation Items with Icons
   description: Navigation items can include an icon on the left of the label.
 - name: badge
   label: Vertical Navigation Items with Badges
   description: Navigation items can include a badge on the right of the label.
 - name: href
   label: Vertical Navigation Items with Links
   description: Navigation items can include links to external websites.
 - name: compact
   label: Vertical Navigation with Compact Spacing
   description: A vertical navigation can be displayed with reduced whitespace.
 - name: shaded
   label: Vertical Navigation On Shaded Background
   description: Navigation items on a shaded background are highlighted in white when selected.
 - name: overflow
   label: Vertical Navigation with Overflow Section
   description: An overflow section is helpful when you have limited space to display all navigation items.
 - name: iteration
   label: Vertical Navigation with Iteration
   description: Navigation items can be created from a data source using iteration.
 - name: validation
   label: Vertical Navigation with Asynchronous Validation
   description: Run an action using the onbeforeselect event handler before a navigation item is selected.
 - name: advanced
   label: Vertical Navigation in Action
   description: A vertical navigation provides a rich feature set, including icons and badges for navigation items, and an overflow section to group additional items when space is limited.
---
A `lightning-vertical-navigation` component represents a list of links that's only one level deep, with support for overflow sections that collapse and expand.
The overflow section must be created using `lightning-vertical-navigation-overflow` and does not adjust automatically based on the view port.

This component inherits styling from [vertical navigation](https://www.lightningdesignsystem.com/components/vertical-navigation/) in the Lightning Design System.

`lightning-vertical-navigation` is used together with these sub-components.
* `lightning-vertical-navigation-section`
* `lightning-vertical-navigation-item`
* `lightning-vertical-navigation-overflow`
* `lightning-vertical-navigation-item-badge`
* `lightning-vertical-navigation-item-icon`

This example creates a basic vertical navigation menu.

```html
<lightning-vertical-navigation>
    <lightning-vertical-navigation-section label="Reports">
        <lightning-vertical-navigation-item label="Recent" name="recent" ></lightning-vertical-navigation-item>
        <lightning-vertical-navigation-item label="Created by Me" name="created" ></lightning-vertical-navigation-item>
        <lightning-vertical-navigation-item label="Private Reports" name="private" ></lightning-vertical-navigation-item>
        <lightning-vertical-navigation-item label="Public Reports" name="public" ></lightning-vertical-navigation-item>
        <lightning-vertical-navigation-item label="All Reports" name="all" ></lightning-vertical-navigation-item>
    </lightning-vertical-navigation-section>
</lightning-vertical-navigation>
```

To define an active navigation item, use `selected-item="itemName"` on `lightning-vertical-navigation`, where `itemName` matches the `name` of the `lightning-vertical-navigation-item` component to be highlighted.

This example creates a navigation menu with a highlighted item and an overflow section.

```html
<lightning-vertical-navigation selected-item="recent">
    <lightning-vertical-navigation-section label="Reports">
        <lightning-vertical-navigation-item label="Recent" name="recent" ></lightning-vertical-navigation-item>
        <lightning-vertical-navigation-item label="All Reports" name="all" ></lightning-vertical-navigation-item>
    </lightning-vertical-navigation-section>
    <lightning-vertical-navigation-overflow>
        <lightning-vertical-navigation-item label="Regional Sales East" name="east" ></lightning-vertical-navigation-item>
        <lightning-vertical-navigation-item label="Regional Sales West" name="west" ></lightning-vertical-navigation-item>
    </lightning-vertical-navigation-overflow>
</lightning-vertical-navigation>
```

#### Selecting a Navigation Item

To determine which navigation item is selected, use the `event.detail` property on the `onselect` event handler.

```html
<lightning-vertical-navigation onselect={handleSelect} selected-item="recent">
    <lightning-vertical-navigation-section label="Reports">
        <lightning-vertical-navigation-item label="Recent" name="recent"></lightning-vertical-navigation-item>
        <lightning-vertical-navigation-item label="Created by Me" name="created"></lightning-vertical-navigation-item>
        <lightning-vertical-navigation-item label="All Reports" name="all"></lightning-vertical-navigation-item>
    </lightning-vertical-navigation-section>
</lightning-vertical-navigation>
```

The `onselect` event handler returns the name of the navigation item that's selected.

```javascript
import { LightningElement } from 'lwc';

export default class VerticalNavigationExample extends LightningElement {
    handleSelect(event) {
        const selectedName = event.detail.name;
    }
}
```

#### Usage Considerations

If you want a navigation menu that's more than one level deep, consider using `lightning-tree` instead.

The navigation menu takes up the full width of the screen. You can specify a width by wrapping in a div and specifying width using CSS.

```html
<div style="width: 320px;">
    <lightning-vertical-navigation>
        ...
    </lightning-vertical-navigation>
</div>
```

#### Accessibility

Use the Tab and Shift+Tab keys to navigate up and down the menu. To expand or collapse an overflow section, press the Enter key or Space Bar.

#### Custom Events

**`beforeselect`**

The event fired before a navigation item is selected.

The `beforeselect` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
name|string|The name of the item to be selected, which matches the `name` value on the `vertical-navigation-item` component.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|true|This event can be canceled. You can call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`select`**

The event fired when a navigation item is selected.

The `select` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
name|string|The name of the selected item, which matches the `name` value on the `vertical-navigation-item` component.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.
