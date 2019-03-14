---
examples:
 - name: basic
   label: Basic Card
   description: A basic card that provides a title attribute. The card uses a button in the actions slot, and plain text in the footer slot.
 - name: narrow
   label: Card with Narrow Variant
   description: This card uses the narrow variant and specifies an icon to include with the title. The card uses a button icon in the actions slot and plain text in the footer slot.
 - name: custom
   label: Card with Custom Title and Footer
   description: This card creates a custom title by using a title slot that contains a header tag and lightning-icon. The footer slot contains lightning-badge components, and the actions slot is empty.
---
A `lightning-card` is used to apply a stylized container around a grouping of
information. The information could be a single item or a group of items such
as a related list.

Use the `variant` or `class` attributes to customize the styling.

A `lightning-card` contains a title, body, and footer. To style the card body,
use the Lightning Design System helper classes.

When applying Lightning Design System classes or icons, check that they are
available in the Lightning Design System release tied to your org. The latest
Lightning Design System resources become available only when the new release
is available in your org.

This component inherits styling from
[cards](https://www.lightningdesignsystem.com/components/cards/) in the
Lightning Design System.

Here is an example that passes in the title, actions, and footer as slots.

```html
<template>
    <lightning-card
            variant="narrow"
            icon-name="standard:opportunity">
        <h1 slot="title">This is a title</h1>
        <h1>This is the body</h1>
        <div slot="actions">
            <lightning-button-icon icon-name="utility:down"></lightning-button-icon>
        </div>
        <div slot="footer">
            <h6>This is the footer</h6>
        </div>
    </lightning-card>
</template>
```

#### Usage Considerations
Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

`title` is available as an attribute or a slot. Pass in the title as a slot if you want to pass in additional markup, such as making the title bold.
Or use the `title` attribute if your title does not need extra formatting. Setting the `title` attribute overwrites the `title` slot. For more information, see [Use Slots as Placeholders](docs/component-library/documentation/lwc/lwc.create_components_slots).
