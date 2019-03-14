---
examples:
 - name: basic
   label: Basic Combobox
   description: A combobox enables you to select only one option. Use the onchange event handler to capture what's selected.
 - name: required
   label: Combobox with Selection Required
   description: This combobox requires a selection by specifying the required attribute. If you do not select an option after first interaction, an error is displayed.
---
`lightning-combobox` is an input element that enables single selection from a
list of options. The result of the selection is displayed as the value of the
input.

This component inherits styling from
[combobox](https://www.lightningdesignsystem.com/components/combobox/) in the
Lightning Design System.

This example creates a list of options with a default selection.

```html
<template>
    <lightning-combobox
            name="status"
            label="Status"
            placeholder="Choose Status"
            value={value}
            onchange={handleChange}
            options={statusOptions}>
    </lightning-combobox>
</template>
```
In your JavaScript, define an array of options. Each option corresponds to a list item on the
dropdown list.

```javascript
import { LightningElement, track } from 'lwc';
export default class MyComponentName extends LightningElement {
    @track
    statusOptions = [
        {value: 'new', label: 'New'},
        {value: 'in-progress', label: 'In Progress'},
        {value: 'finished', label: 'Finished'}
    ];

    @track
    value = 'new';

    handleChange(event) {
        // Get the string of the "value" attribute on the selected option
        const selectedOption = event.detail.value;
        alert(`Option selected with value: ${selectedOption}`);
    }
}
```

Selecting an option triggers the `change` event, which calls the
`handleChange` function. To check which option has been clicked,
use `event.detail.value`.


#### Usage Considerations

Special characters like `"` must be escaped. For example, you want to display
`"New"`.

```javascript
    const options = [
        { value: "\"new\"", label: "\"New\"" },
        { value: "expired", label: "Expired" }
    ];
```

When using single quotes in your value, escape the quote with a double slash
instead of a single slash.

#### Input Validation

Client-side input validation is available for this component. You can make
the selection required by adding the `required` attribute. An error message is
automatically displayed when an item is not selected and the element is `required`.

To check the validity states of an input, use the `validity` attribute, which
is based on the `ValidityState` object. You can access the validity states in
your Javascript. This `validity` attribute returns an object with
`boolean` attributes. See `lightning-input` documentation for more information.

You can override the default message by providing your own value for
`message-when-value-missing`.

#### Accessibility

You must provide a text label for accessibility to make the information
available to assistive technology. The `label` attribute creates an HTML label
element for your input component. To hide a label from view and make it
available to assistive technology, use the `label-hidden` variant.

#### Custom Events

 **`change`**

 The event fired when an item is selected in the combobox.

 The `change` event returns the following parameter.

 Parameter|Type|Description
-----|-----|----------
selectedValue|string|The value of the selected option.

 The event properties are as follows.

 Property|Value|Description
-----|-----|----------
bubbles|true|This event bubbles up through the DOM.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|true|This event propagates outside of the component in which it was dispatched.

**`open`**

The event fired when the dropdown is opened.

The `open` event does not return any parameters.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event.
composed|false|This event does not propagate outside of the component in which it was dispatched.
