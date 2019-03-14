---
examples:
 - name: icons
   label: Vertical Navigation with Icons
   description: Navigation items can include an icon on the left of the label.
---
A `lightning-vertical-navigation-item-icon` component is a navigation item that displays an icon to the left of the item label.

Here's an example that creates a navigation menu with icons on the navigation items.

```html
 <template>
    <lightning-vertical-navigation>
        <lightning-vertical-navigation-section label="Reports">
            <lightning-vertical-navigation-item-icon
                    label="Recent"
                    name="recent"
                    icon-name="utility:clock">
            </lightning-vertical-navigation-item-icon>
            <lightning-vertical-navigation-item-icon
                    label="Created by Me"
                    name="created"
                    icon-name="utility:user">
            </lightning-vertical-navigation-item-icon>
            <lightning-vertical-navigation-item
                    label="All Reports"
                    name="all">
            </lightning-vertical-navigation-item>
        </lightning-vertical-navigation-section>
    </lightning-vertical-navigation>
</template>
```

Icons from the Lightning Design System are supported. Visit [https://lightningdesignsystem.com/icons](https://lightningdesignsystem.com/icons) to view available icons.

When applying Lightning Design System classes or icons, check that they are available in the
Lightning Design System release tied to your org. The latest Lightning Design System
resources become available only when the new release is available in your org.
