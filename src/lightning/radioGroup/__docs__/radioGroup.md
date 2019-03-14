---
examples:
 - name: basic
   label: Basic Radio Group
   description: A radio group contains at least two options and only one can be selected.
 - name: required
   label: Required Radio Group
   description: A radio group displays a field-level error if it's required and no option is selected after the first interaction.
 - name: disabled
   label: Disabled Radio Group
   description: Disabled options are grayed out and you can't interact with them.
 - name: button
   label: Radio Group with Button Type
   description: A radio group can use the button type to display a different visual style.
 - name: buttonrequired
   label: Required Radio Group with Button Type
   description: A radio button group displays a field-level error if it's required and no option is selected after the first interaction.
 - name: buttondisabled
   label: Disabled Radio Group with Button Type
   description: Disabled options are grayed out and you can't interact with them.
---
A `lightning-radio-group` component represents a radio button group that can
have a single option selected. Set the `name` attribute to give the same name
to each of the radio buttons in the group and ensure that only one button can
be selected. If `name` is not specified, multiple radio buttons can be selected.
The <input> elements rendered by the component must have the same `name` value
to form a group of radio buttons.

If the `required` attribute is specified, at least one radio button must be selected.
When a user interacts with the radio group and doesn't make a selection, an
error message is displayed.

If the `disabled` attribute is specified, radio button selections can't be changed.

This component inherits styling from
[Radio Button](https://www.lightningdesignsystem.com/components/radio-group/) in the
Lightning Design System.

Set `type="button"` to create a component that
inherits styling from
[Radio Button Group](https://www.lightningdesignsystem.com/components/radio-button-group/)
in the Lightning Design System.

This example creates a radio group with two options and `option1` is selected
by default. One radio button must be selected as the `required` attribute is
specified.
```html
<template>
    <lightning-radio-group
        name="radioButtonGroup"
        label="Radio Button Group"
        options={options}
        value={value}
        onchange={handleChange}
        required>
    </lightning-radio-group>
</template>
```

You can check which values are selected by using the `value` attribute.
To retrieve the values when the selection is changed, use the `onchange` event handler and call
`event.detail.value`.

```javascript
import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {
    @track
    options = [
        {'label': 'Ross', 'value': 'option1'},
        {'label': 'Rachel', 'value': 'option2'},
    ];

    @track
    value = 'option1';

    handleChange(event) {
        const selectedOption = event.detail.value;
        console.log(`Option selected with value: ${selectedOption}`);
    }
}
```

#### Accessibility

The radio group is nested in a `fieldset` element that contains a `legend`
element. The legend contains the `label` value. The `fieldset` element enables
grouping of related radio buttons to facilitate tabbing navigation and speech
navigation for accessibility purposes. Similarly, the `legend` element
improves accessibility by enabling a caption to be assigned to the `fieldset`.
