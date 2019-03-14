---
examples:
 - name: basic
   label: Basic Buttons
   description: Button variants display the buttons with different colors to convey different meanings. The default variant is neutral.
 - name: disabled
   label: Disabled Buttons
   description: Disabled buttons are grayed out and can't be clicked.
 - name: withIcon
   label: Buttons with Icons
   description: Buttons can include a utility icon next to the label for decorative purposes. The default icon position is left.
 - name: inverse
   label: Inverse Buttons
   description: Buttons with the inverse variant display with a dark background.
 - name: onclick
   label: Buttons with Custom onclick Actions
   description: Buttons can use custom onclick handlers. The first button's handler toggles the icon used on the button and visibility of a content block. The second button's handler generates random content.
 - name: accesskey
   label: Buttons with Accesskey and Tabindex Attributes
   description: Buttons define access key shortcuts with the accesskey attribute, and use the tabindex attribute to determine the order in which those buttons are visited when using the tab key.
---
A `lightning-button` component represents a button element that executes an
action. Clicking the button triggers the JavaScript
method set for `onclick`. You can create buttons in several ways: a
button with a label only, or a button with a label and icon. For an icon-only
button, use `lightning-button-icon` instead.

Use the `variant` and `class` attributes to apply additional styling.

The Lightning Design System utility icon category provides nearly 200 utility
icons that can be used in `lightning-button` along with label text. Although
Lightning Design System provides several categories of icons, only the utility category can be
used in this component.

Visit [https://lightningdesignsystem.com/icons/#utility](https://lightningdesignsystem.com/icons/#utility)
to view the utility icons.

This component inherits styling from
[buttons](https://www.lightningdesignsystem.com/components/buttons/) in the
Lightning Design System.

Here's an example that creates a button with the `brand` variant, which displays
a label on the button.

```html
<template>
    <lightning-button
        variant="brand"
        label="Submit"
        onclick={handleClick}>
    </lightning-button>
</template>
```

Here's another example that creates a button with the `brand` variant, which
displays a label and icon on the button.

```html
<template>
    <lightning-button
        variant="brand"
        label="Download"
        icon-name="utility:download"
        icon-position="left"
        onclick={handleClick}>
    </lightning-button>
</template>
```

You can retrieve the button that's clicked by using `event.target`. For
example, to retrieve the label on the button, use
`event.target.label`.

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

#### Accessibility

To inform screen readers that a button is disabled, set the `disabled`
attribute to `true`.

