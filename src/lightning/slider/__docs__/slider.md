---
examples:
 - name: basic
   label: Basic Slider
   description: A slider enables you to specify a value between two numbers.
 - name: sizes
   label: Slider Sizes
   description: A slider supports multiple sizes.
 - name: type
   label: Slider Positioning
   description: A slider can be positioned horizontally or vertically.
 - name: variant
   label: Slider Variants
   description: A slider can be displayed without labels. If disabled, a slider is grayed out and you can't interact with it.
---
A `lightning-slider` component is a horizontal or vertical slider for
specifying a value between two specified numbers. For example, this slider can
be used to capture user input about order quantity or when you want to use an
input field of `type="range"`. To orient the slider vertically, set
`type="vertical"`. Older browsers that don't support the slider fall back and
treat it as `type="text"`.

This component inherits styling from
[slider](https://lightningdesignsystem.com/components/slider) in the Lightning
Design System.

Here's an example of a slider with a step increment of 10.

```html
    <template>
        <lightning-slider
            label="Volume"
            step="10"
            value="10"
            onchange={handleChange}>
        </lightning-slider>
    </template>
```

Handle the `change` event and get the slider value using the `event.target` property.

```javascript
import { LightningElement } from 'lwc';

export default class MyDemo extends LightningElement {
    handleChange(event) {
        alert(event.target.value);
    }
```

#### Usage Considerations

By default, the `min` and `max` values are 0 and 100, but you can specify your
own values. If you specify your own step increment value, you can drag the
slider based on the step increment only. If you set the value lower than the
`min` value, then the value is set to the `min` value. Similarly, setting the
value higher than the `max` value results in the value being set to the `max`
value.

For precise numerical values, we recommend using the `lightning-input`
component of `type="number"` instead.
