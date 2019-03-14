---
examples:
 - name: simple
   label: Simple Dual Listbox
   description: A simple dual listbox with options. Use the onchange event handler to capture what's selected.
 - name: selected
   label: Dual Listbox with Default Selected Options
   description: This dual listbox shows some pre-selected options.
 - name: required
   label: Dual Listbox with Required Selected Options
   description: This dual listbox shows required selected options.
 - name: minmax
   label: Dual listbox with Minimum and Maximum Required Options
   description: This dual listbox requires you to select a minimum and maximum number of options.
---
A `lightning-dual-listbox` component represents two side-by-side listboxes.
Select one or more options in the list on the left. Move selected options to
the list on the right. The order of the selected options is maintained and you
can reorder options.

This component inherits styling from [Dueling Picklist](https://www.lightningdesignsystem.com/components/dueling-picklist/)
in the Lightning Design System.

Here's an example that creates a simple dual listbox with 8 options. Options
7, 2 and 3 are selected under the second listbox. Options 2 and 7
are required options.
```html
<template>
    <lightning-dual-listbox id="selectOptions"
        name="Select Options"
        label="Select Options"
        source-label="Available Options"
        selected-label="Selected Options"
        options={listOptions}
        value={defaultOptions}
        required-options={requiredOptions}
        onchange={handleChange}>
    </lightning-dual-listbox>
</template>
```


```javascript
import { LightningElement, track } from 'lwc';
export default class MyComponentName extends LightningElement {
    @track
    listOptions = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
        { value: '4', label: 'Option 4' },
        { value: '5', label: 'Option 5' },
        { value: '6', label: 'Option 6' },
        { value: '7', label: 'Option 7' },
        { value: '8', label: 'Option 8' },
    ];

    @track
    defaultOptions = ['7', '2', '3'];

    @track
    requiredOptions = ['2', '7'];

    handleChange(event) {
        // Get the list of the "value" attribute on all the selected options
        const selectedOptionsList = event.detail.value;
        alert(`Options selected: ${selectedOptionsList}`);
    }
}
```

To specify the number of options users can select, use the `min` and `max`
attributes. For example, if you set `min` to 3 and `max` to 8, users must
select at least 3 options and at most 8 options.

#### Usage Considerations

To retrieve the selected values, use the `onchange` handler.

```
handleChange(event) {
    // Retrieve an array of the selected options
    const selectedOptionsList = event.detail.value;
    alert(`Options selected: ${selectedOptionsList}`);
}
```

The `onchange` handler is triggered when you click the left and right buttons to
move options from one list to another or when you change the order of options
in the selected options list.

#### Accessibility

Use the following keyboard shortcuts to work with dual listboxes.

  * Click - Select a single option.
  * Cmd+Click - Select multiple options or deselect selected options.
  * Shift+Click - Select all options between the current and last clicked option.

When focus is on options:

  * Up Arrow - Move selection to previous option.
  * Down Arrow - Move selection to next option.
  * Cmd/Ctrl+Up Arrow - Move focus to previous option.
  * Cmd/Ctrl+Down Arrow - Move focus to next option.
  * Ctrl+Space - Toggle selection of focused option.
  * Cmd/Ctrl+Right Arrow - Move selected options to right listbox.
  * Cmd/Ctrl+Left Arrow - Move selected options to left listbox.
  * Tab - Move focus to the buttons or between boxes.

When focus is on a button:

  * Enter - Perform the operation associated with that button.

#### Custom Events

 **`change`**

 The event fired when an item is selected in the combobox.

 The `change` event returns the following parameter.

 Parameter|Type|Description
-----|-----|----------
values|string|The values of the selected items.

 The event properties are as follows.

 Property|Value|Description
-----|-----|----------
bubbles|true|This event bubbles up through the DOM.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|true|This event propagates outside of the component in which it was dispatched.
