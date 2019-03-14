---
examples:
 - name: basic
   label: Stateful Button Icons
   description: Stateful button icons can be toggled between states. They support multiple sizes and can be disabled.
 - name: variants
   label: Stateful Button Icons with Border Variants
   description: Button icons using the two types of border variants.
---
A `lightning-button-icon-stateful` component represents an icon-only button
element that toggles between two states. For example, you can use this
component for capturing a customer's feedback on a blog post (like or
dislike). Clicking the button triggers the client-side controller method set
for `onclick` and changes the state of the icon using the `selected`
attribute.

The Lightning Design System utility icon category offers nearly 200 utility
icons that can be used in `lightning-button-icon-stateful`. Although the
Lightning Design System provides several categories of icons, only the utility
category can be used with this component.

Visit [utility icons](https://lightningdesignsystem.com/icons/#utility) in
the Lightning Design System to view the utility icons.

When applying Lightning Design System classes or icons, check that they are
available in the Lightning Design System release tied to your org. The latest
Lightning Design System resources become available only when the new release
is available in your org.

This component inherits styling from
[button icons](https://www.lightningdesignsystem.com/components/button-icons/) in the
Lightning Design System.

You can use a combination of the `variant`, `size`, and `class` attributes to
customize the button and icon styles. To customize styling on the button
container, use the `class` attribute.

This example creates a Like button that toggles between two states. The like
button is selected by default. The button's state is stored in the `selected`
attribute.

Selecting the Dislike button also toggles the state on the like button and
deselects it.

```html
<template>
    <lightning-button-icon-stateful
        iconName="utility:like"
        selected={liked}
        alternative-text="Like"
        onclick={handleToggle}>
    </lightning-button-icon-stateful>
</template>
```

Handle the `click` event in your JavaScript code.

```javascript
import { LightningElement, track } from 'lwc';

export default class MyComponentName extends LightningElement {
    @track
    liked = true;

    handleToggle() {
        this.liked = !this.liked;
    }
}
```

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

