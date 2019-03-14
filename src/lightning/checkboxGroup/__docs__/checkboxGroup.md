---
examples:
 - name: basic
   label: Basic Checkbox Group
   description: A checkbox group contains at least two checkboxes. This example presets the selected value to the first option.
 - name: required
   label: Checkbox Group with Required Selection
   description: This checkbox group requires a selection by specifying the required attribute. If you do not select an option after first interaction, an error is displayed.
 - name: disabled
   label: Disabled Checkbox Group
   description: This checkbox group specifies the disabled attribute. The disabled options are grayed out and you can't change the selection.
---
A `lightning-checkbox-group` component represents a checkbox group that enables
selection of single or multiple options.

If the `required` attribute is set, at least one checkbox must be
selected. When a user interacts with the checkbox group and doesn't make a
selection, an error message is displayed. You can provide a custom error
message using the `message-when-value-missing` attribute.

If the `disabled` attribute is set, checkbox selections can't be
changed.

This component inherits styling from
[Checkbox](https://www.lightningdesignsystem.com/components/checkbox/) in the
Lightning Design System.

This example creates a checkbox group with two options and `option1` is
selected by default. At least one checkbox must be selected because the `required`
attribute is specified.

```html
<template>
    <lightning-checkbox-group
            id="mygroup"
            name="checkboxGroup"
            label="Checkbox Group"
            options={options}
            value={options}
            onchange={handleChange}
            required>
    </lightning-checkbox-group>
</template>
```

```javascript
//mycomponentname.js

import { LightningElement, api } from 'lwc';
export default class MyComponentName extends LightningElement {

    options = [
      { label: 'Ross', value: 'option1' },
      { label: 'Rachel', value: 'option2' },
    ];

    handleChange(event) {
        const changeValue = event.detail.value;
        alert(changeValue);
    }
}
 ```

To retrieve the values when a checkbox
is selected or deselected, use `event.detail.value` in the `change` event handler.


#### Usage Considerations

`lightning-checkbox-group` is useful for grouping a set of checkboxes. If you
have a single checkbox, use `lightning-input type="checkbox"` instead.

#### Accessibility

The checkbox group is nested in a `fieldset` element that contains a `legend`
element. The legend contains the `label` value. The `fieldset` element enables
grouping of related checkboxes to facilitate tabbing navigation and speech
navigation for accessibility purposes. Similarly, the `legend` element
improves accessibility by enabling a caption to be assigned to the `fieldset`.
