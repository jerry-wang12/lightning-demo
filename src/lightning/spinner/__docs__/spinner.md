---
examples:
 - name: sizes
   label: Spinner Sizes
   description: A spinner can be displayed in multiple sizes.
 - name: inverse
   label: Spinner with Inverse Variant
   description: A spinner uses the inverse variant to display a dark background.
 - name: if
   label: Display a Spinner Conditionally
   description: A spinner can be displayed or hidden conditionally.
---
A `lightning-spinner` displays an animated spinner image to indicate that a
feature is loading. This component can be used when retrieving data or anytime
an operation doesn't immediately complete.

The `variant` attribute changes the appearance of the spinner. If you set
`variant="brand"`, the spinner matches the Lightning Design System brand
color. Setting `variant="inverse"` displays a white spinner. The default
spinner color is dark blue.

This component inherits styling from
[spinners](https://www.lightningdesignsystem.com/components/spinners/) in the
Lightning Design System.

Here is an example.

```html
<template>
    <lightning-spinner
        variant="brand"
        size="large">
    </lightning-spinner>
</template>
```

`lightning-spinner` is intended to be used conditionally. You can use
`if:{true or false}` or the Lightning Design System utility classes to show or hide the
spinner.

```html
<template>
    <lightning-button
        label="Toggle"
        variant="brand"
        onclick={toggle}>
    </lightning-button>

    <div class="slds-m-around_large">
        <p if:true={isLoaded}>Content has been loaded.</p>

         <div if:false={isLoaded} class="slds-is-relative">
            <lightning-spinner
                alternative-text="Loading...">
            </lightning-spinner>
        </div>
    </div>
</template>
```

The `toggle()` function toggles the boolean value of the `isLoaded` variable.

```javascript
import { LightningElement, api } from 'lwc';

export default class DemoSpinner extends LightningElement {
    @api isLoaded = false;

    // change isLoaded to the opposite of its current value
    toggle() {
        this.isLoaded = !this.isLoaded;
    }
}
```
