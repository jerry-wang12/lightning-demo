A `lightning-input-name` component is a name compound field represented by HTML
`input` elements of type `text`. The Salutation field is a dropdown menu that
accepts an array of label-value pairs.

This example creates a name compound field with a field for first name, middle
name, last name, informal name, suffix. The Salutation dropdown menu displays
"Mr." by default. The `fields-to-display` attribute determines which fields are
rendered.

```html
<template>
        <div class="slds-size_1-of-2">
            <lightning-input-name
                label="Contact Name"
                first-name="John"
                middle-name="Middleton"
                last-name="Doe"
                informal-name="Jo"
                suffix="The 3rd"
                salutation="Mr."
                options={salutationOptions}
                fields-to-display={fields}>
            </lightning-input-name>
         </div>
</template>
```

JavaScript file:

```javascript
import { LightningElement } from 'lwc';

export default class InputName extends LightningElement {

    salutationOptions = [
        {'label': 'None', 'value': 'None'},
        {'label': 'Mr.', 'value': 'Mr.'},
        {'label': 'Ms.', 'value': 'Ms.'},
        {'label': 'Mrs.', 'value': 'Mrs.'},
        {'label': 'Dr.', 'value': 'Dr.'},
        {'label': 'Prof.', 'value': 'Prof.'},
    ];
}
```

#### Usage Considerations

You can use custom labels that display translated values. For more information, see the
[Access Static Resources, Labels, Internationalization Properties, and User IDs](docs/component-library/documentation/lwc/create_global_value_providers).

#### Input Validation

When you set `required`, a red asterisk is displayed on the Last Name
field to indicate that it's required. An error message is displayed below the
Last Name field if a user interacted with it and left it blank. The `required`
attribute is not enforced and you must validate it before submitting a form
that contains a name compound field.

To check the validity states of an input, use the `validity` attribute, which
is based on the `ValidityState` object. You can access the validity states in
your JavaScript. This `validity` attribute returns an object with
`boolean` properties. For more information, see the
[`lightning-input`](bundle/lightning-input/documentation) documentation.

Let's say you have a `lightning-button` component that calls the `handleClick`
method. You can display the error message when a user clicks the
button without providing a value for the Last Name field.

```javascript
handleClick : () => {
    var name = this.template.querySelector('lightning-input-name');
    var isValid = name.checkValidity();
    if(isValid) {
        alert("Creating new contact for " + this.name);
    }
}
```
#### Custom Events

**`change`**

The event fired when an item is changed in the `lightning-input-name` component.

The `change` event returns the following parameters.

Parameter|Type|Description
-----|-----|----------
salutation|string|The value of the salutation field.
firstName|string|The value of the first name field.
middleName|string|The value of the middle name field.
lastName|string|The value of the last name field.
informalName|string|The value of the informal name field.
suffix|string|The value of the suffix field.
validity|object|The validity state of the element.


The `change` event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|true|This event bubbles up through the DOM.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|true|This event propagates outside of the component in which it was dispatched.


