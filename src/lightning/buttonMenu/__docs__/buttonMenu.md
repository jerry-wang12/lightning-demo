---
examples:
 - name: basic
   label: Button Menus
   description: Button menus can include menu items that are disabled. Menu subheaders and dividers can categorize or group menu items. Menu dividers support a compact variant.
 - name: withIcon
   label: Button Menus with Icons
   description: Button menus can include a utility icon to the left of the dropdown.
 - name: menuItems
   label: Button Menu Item Styling
   description: Button menu items can include icons to the left or right of the item label, or both.
 - name: variants
   label: Button Menu Variants
   description: Button menus support several variants that let you change the border style and size, or display with a dark background.
 - name: onselect
   label: Button Menu with Custom onselect Behavior
   description: Button menu with custom onselect handler.
 - name: iteration
   label: Button Menus Using for:each Iteration for Menu Items
   description: Button menu items can be created from a data source using iteration.
---
A `lightning-button-menu` component represents a button that when clicked displays a
dropdown menu of actions or functions that a user can access.

Use `lightning-menu-item` as subcomponents of `lightning-button-menu` to specify the menu items for the button menu.

This component inherits styling from [menus](https://www.lightningdesignsystem.com/components/menus/) in the Lightning Design System.

Use the `variant`, `icon-size`, or `class` attributes to customize the styling. For example, you can set `class="slds-m-vertical_large"` or other
[margin](https://lightningdesignsystem.com/utilities/margin/) classes to add spacing around the icon.

Specify an optional [utility icon](https://www.lightningdesignsystem.com/icons/#utility) to display in front of the default icon with the `icon-name` attribute, or
use the `label` attribute to add a text label to the button before the icon.

When applying Lightning Design System classes or icons, check that they are
available in the Lightning Design System release tied to your org. The Lightning
Design System site shows the latest Lightning Design System resources, and these
become available only when the new release is available in your org.

This example shows how to create a dropdown button menu with some customized styling and three items.

```html
<template>
    <lightning-button-menu
            icon-name="utility:settings"
            icon-size="large"
            alternative-text="Settings"
            variant="bare">
        <lightning-menu-item label="Font" value="font"></lightning-menu-item>
        <lightning-menu-item label="Size" value="size"></lightning-menu-item>
        <lightning-menu-item label="Format" value="format"></lightning-menu-item>
    </lightning-button-menu>
</template>
```

```javascript
import { LightningElement } from 'lwc';

export default class DemoButtonMenu extends LightningElement {}
```


You can create menu items that can be checked or unchecked using the `checked`
attribute in the `lightning-menu-item` component, toggling it as needed. To
enable toggling of a menu item, you must set an initial value on the `checked`
attribute, specifying either `true` or `false`.

The menu closes when you click away from it, and it also closes and puts the
focus back on the button when a menu item is selected.

#### Creating Dividers and Subheadings

Use the `lightning-menu-divider` subcomponent to create a dividing line after a menu item. By default, space is added
above and below the divider. Use `variant="compact"` with `lightning-menu-divider` to reduce the space.

Use the `lightning-menu-subheader` subcomponent to create sub-headings in the list of menu items. Specify the text
of the heading using the `label` attribute.

This example shows a dropdown menu with dividers and sub-headings.

```html
 <template>
 <lightning-button-menu label="Menu trigger">
     <lightning-menu-item label="Menu item 1">
     </lightning-menu-item>
     <lightning-menu-divider variant="compact">
         </lightning-menu-divider>
     <lightning-menu-subheader label="Menu sub heading">
         </lightning-menu-subheader>
     <lightning-menu-item label="Menu item 2">
     </lightning-menu-item>
 </lightning-button-menu>
 </template>
```

#### Generating Menu Items

This example creates a button menu with several items during initialization. The `items` property is a private
reactive property which is indicated by the `@track` decorator in the JS file. If the value of `items` changes, the component's template rerenders.

```html
<template>

  <lightning-button-menu
        alternative-text="Action"
        onselect={handleMenuSelect}>

    <template for:each={items} for:item="action">
        <lightning-menu-item
            id="action-id"
            label={action.label}
            value={action.value}
            key={action.label}>
        </lightning-menu-item>
    </template>

  </lightning-button-menu>

</template>
```

Define `items` and handle the `select` event in your JavaScript code.

```javascript

    import { LightningElement, track } from 'lwc';

    export default class DemoButtonMenu extends LightningElement {

        @track
        items = [
            {
                id: 'menu-item-1',
                label: 'Alpha',
                value: 'alpha',
            },
            {
                id: 'menu-item-2',
                label: 'Beta',
                value: 'beta',
            },
            {
                id: 'menu-item-3',
                label: 'Gamma',
                value: 'gamma',
            }
        ];



    handleMenuSelect(event) {
        // retrieve the selected item's value
        const selectedItemValue = event.detail.value;

        // INSERT YOUR CODE HERE
    }

}
```
#### Showing the Loading State of a Menu

The `is-loading` attribute enables you to show an activity indicator while the menu is loading. You might
use this, for example, to inform users that the menu is working while generating a large list of menu items.
When `is-loading` is `true`, the menu shows a spinner.

Use `loading-state-alternative-text` along with `is-loading` to specify explanatory text such as "Loading menu..." or
"Please wait while items load".

#### Draft Indicators

Use the `is-draft` and `draft-alternative-text` attributes together to indicate that the button menu is in an unsaved state.
The draft indicator, an asterisk, is shown for the button menu when `is-draft` is `true`. The `draft-alternative-text` attribute
is required to provide text describing the reason the menu is considered in a draft state. The button menu draft state might
be used to show there is unsaved state or data that could be lost, for example if there's a user change in a customizable menu.

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

This component contains menu items that are created only if the button is
triggered. You won't be able to reference the menu items during initialization
or if the button isn't triggered yet.

You can customize the alignment of the dropdown menu relative to the button using `menu-alignment`.
If you are using `button-menu` in a container that specifies the `overflow:hidden` CSS property,
setting `menu-alignment="auto"` ensures that the dropdown menu is not hidden from view when the menu is toggled.


#### Accessibility

To inform screen readers that a button is disabled, set the `disabled`
attribute to `true`.

#### Custom Events

**`select`**

The event fired when the menu is selected.

The `select` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
value|string|The value of the selected option.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|true|This event can be canceled. You can call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

