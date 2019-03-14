---
examples:
 - name: basic
   label: Button Icon Variants and Sizes
   description: Button icons support mutliple variants and sizes.
 - name: inverse
   label: Button Icons with Inverse Variant
   description: Button icons support two types of inverse variants to display with a dark background.
---
A `lightning-button-icon` component represents an icon-only button element that
executes an action in a controller. Clicking the button triggers the JavaScript
method set for `onclick`.

You can use a combination of the `variant`, `size`, `class`, and `icon-class`
attributes to customize the button and icon styles. To customize styling on
the button container, use the `class` attribute. For the bare variant, the
`size` class applies to the icon itself. For non-bare variants, the `size`
class applies to the button.

To customize styling on the icon element, use the
`icon-class` attribute. This example creates an icon-only button with bare
variant and icon styling. Only Lightning Design System  utility classes are currently supported with `icon-class`.

```html
    <lightning-button-icon
        icon-name="utility:settings"
        variant="bare"
        alternative-text="Settings"
        icon-class="slds-m-around_medium">
    </lightning-button-icon>
```

The Lightning Design System utility icon category offers nearly 200 utility
icons that can be used in `lightning-button-icon`. Although the Lightning
Design System provides several categories of icons, only the utility category
can be used in `lightning-button-icon`.

Visit [utility icons](https://lightningdesignsystem.com/icons/#utility) to view the utility
icons.

When applying Lightning Design System classes or icons, check that they are
available in the Lightning Design System release tied to your org. The latest
Lightning Design System resources become available only when the new release
is available in your org.

This component inherits styling from
[button icons](https://www.lightningdesignsystem.com/components/button-icons/) in the
Lightning Design System.

Here is an example.

```html
<template>
    <lightning-button-icon
        icon-name="utility:close"
        variant="bare"
        onclick={handleClick}
        alternative-text="Close window">
    </lightning-button-icon>
</template>
```

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

#### Accessibility

Use the `alternative-text` attribute to describe the icon. The description
should indicate what happens when you click the button, for example 'Upload
File', not what the icon looks like, 'Paperclip'.

