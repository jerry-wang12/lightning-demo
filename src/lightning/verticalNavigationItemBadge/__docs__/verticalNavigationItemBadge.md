---
examples:
 - name: badges
   label: Vertical Navigation with Badges
   description: Navigation items can include a badge on the right of the label.
---
A `lightning-vertical-navigation-item-badge` component is a navigation item that displays a numerical badge to the right of the item label.

Here's an example that creates a navigation menu with an item containing a badge.

```html
<template>
    <lightning-vertical-navigation selected-item="recent">
        <lightning-vertical-navigation-section label="Reports">
            <lightning-vertical-navigation-item-badge
                    label="Recent"
                    name="recent"
                    badge-count="3">
            </lightning-vertical-navigation-item-badge>
            <lightning-vertical-navigation-item
                    label="Created by Me"
                    name="usercreated">
            </lightning-vertical-navigation-item>
            <lightning-vertical-navigation-item
                    label="Private Reports"
                    name="private">
            </lightning-vertical-navigation-item>
            <lightning-vertical-navigation-item
                    label="Public Reports"
                    name="public">
            </lightning-vertical-navigation-item>
            <lightning-vertical-navigation-item
                    label="All Reports"
                    name="all">
            </lightning-vertical-navigation-item>
        </lightning-vertical-navigation-section>
    </lightning-vertical-navigation>
</template>
```
