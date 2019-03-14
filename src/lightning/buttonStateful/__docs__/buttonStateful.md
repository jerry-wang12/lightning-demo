---
examples:
 - name: basic
   label: Stateful Button
   description: This stateful button changes its text and icon when you select it. The button changes its text and icon again when you hover over it. This uses the default variant.
 - name: inverseVariant
   label: Stateful Button with Inverse Variant
   description: This stateful button changes its text and icon when you select it. The button changes its text and icon again when you hover over it. This uses the inverse variant.
 - name: noIcon
   label: Stateful Button with No Icon
   description: This stateful button uses the brand variant and does not specify icons for any states.
 - name: textVariant
   label: Stateful Button with Text and Icon
   description: This stateful button uses the text variant and specifies icons for selected and not-selected states, but not the hover state.

---
A `lightning-button-stateful` component represents a button that toggles
between states, similar to a Like button on social media. Stateful buttons can
show a different label and icon based on their `selected` states.

Use the `variant` and `class` attributes to apply additional styling.

The Lightning Design System utility icon category provides nearly 200 utility
icons that can be used in `lightning-button` along with a text label. Although
the Lightning Design System provides several categories of icons, only the
utility category can be used with this component.

Visit <https://lightningdesignsystem.com/icons/#utility> to view the utility
icons.

This component inherits styling from
[stateful buttons](https://www.lightningdesignsystem.com/components/buttons/#flavor-stateful)
in the Lightning Design System.

To handle the state change when the button is clicked, use the `onclick` event
handler. This example enables you to toggle the button between states,
displaying the "Follow" label by default, and replacing it with "Following"
when the button is selected. Selecting the button toggles the `selected` state to true,
and deselecting it toggles `selected` to false. When the `selected` state is true, the
button displays "Unfollow" when you mouse over it or when it receives focus.

```html
<template>
    <lightning-button-stateful
        label-when-off="Follow"
        label-when-on="Following"
        label-when-hover="Unfollow"
        icon-name-when-off="utility:add"
        icon-name-when-on="utility:check"
        icon-name-when-hover="utility:close"
        selected={isSelected}
        onclick={handleClick}>
    </lightning-button-stateful>
</template>
```

The `handleClick()` function toggles the state via the `isSelected` attribute.

```javascript
import { LightningElement, track } from 'lwc';

export default class MyComponentName extends LightningElement {
    @track
    isSelected = false;

    handleClick() {
        this.isSelected = !this.isSelected;
    }
}
```

#### Accessibility

For accessibility, include the attribute `aria-live="assertive"` on the
button. The `aria-live="assertive"` attribute means the value of the `<span>`
inside the button will be spoken whenever it changes.

To inform screen readers that a button is disabled, set the `disabled`
attribute to true.


