---
examples:
 - name: basic
   label: Basic Tabset
   description: A tabset includes content within tabs.
 - name: scoped
   label: Tabset with Scoped Variant
   description: The scoped variant displays the tabset with a different visual styling than the default.
 - name: activeTab
   label: Tabset with Default Selected Tab
   description: A tabset can display an active tab by default using the active-tab-value attribute.
 - name: conditionalTab
   label: Tabset with Conditional Tabs
   description: A tab can be displayed or hidden conditionally.
 - name: onactive
   label: Tabset with Lazy Loading Tabs
   description: Add content to the tab programmatically using the onactive event handler when a tab is active.
 - name: overflow
   label: Tabset with Overflow Tabs
   description: Overflow tabs are hidden from view when the view port is not wide enough. Overflow tabs are grouped in a dropdown menu labelled "More".
 - name: vertical
   label: Tabset with Vertical Variant
   description: A tabset can be displayed vertically using the vertical variant.
---
A `lightning-tabset` displays a tabbed container with multiple content areas,
only one of which is visible at a time. Tabs are displayed horizontally inline
with content shown below it, by default.

A tabset can hold multiple `lightning-tab` components as part of its body. The first tab is activated by default.

Set the `variant` attribute to change the look of the tabset.
The `scoped` variant displays a border around the tabset and content.
The `vertical` variant displays tabs vertically instead of
horizontally, with a border around the tabset and content.

This component inherits styling from
[tabs](https://www.lightningdesignsystem.com/components/tabs/) in the
Lightning Design System.

Next is an example of a standard horizontal tabset.
```html
<template>
    <lightning-tabset>
        <lightning-tab label="Tab One">
            Content of Tab One
        </lightning-tab>
        <lightning-tab label="Tab Two">
            Content of Tab Two
        </lightning-tab>
    </lightning-tabset>
</template>
```

#### Usage Considerations

When a tabset contains more tabs than could fit on the screen, the tabs that don't fit are moved into a dropdown menu (also known as an overflow) next to the last tab that fits. Note that the active tab always shows and is never moved into the overflow.

You can nest `lightning-tab` within other elements such as `<div>` or `<template>`, for example to render tabs conditionally using `if:true` and `if:false`. Otherwise, you must nest
`lightning-tab` directly within `lightning-tabset` tags.

Tab content is lazy loaded, and as such only the active and previously
active tabs content is queryable. In the example, the text `Content of Tab Two` is inserted in the DOM of the page only when the second tab is selected.
