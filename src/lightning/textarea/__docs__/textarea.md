---
examples:
 - name: various
   label: Textarea
   description: A textarea field can hold an unlimited number of characters or a maximum number of characters specified by the max-length attribute. If disabled, the field is grayed out and you can't interact with it. A required textarea field displays an error if you don't enter any input after first interaction.
---
A `lightning-textarea` component creates an HTML `textarea` element for
entering multi-line text input. A text area holds an unlimited number of
characters.

This component inherits styling from
[textarea](https://www.lightningdesignsystem.com/components/textarea/) in the
Lightning Design System.

The `rows` and `cols` HTML attributes are not supported. To apply a custom
height and width for the text area, use the `class` attribute. To set the
input for the text area, set its value using the `value` attribute. Setting
this value overwrites any initial value that's provided.

The following example creates a text area with a maximum length of 300
characters.

```html
<template>
    <lightning-textarea
            name="myTextArea"
            value="initial value"
            label="What are you thinking about?"
            max-length="300">
     </lightning-textarea>
</template>
```

You can define a function in JavaScript to handle input events like
`blur`, `focus`, and `change`. For example, to handle a `change` event on
the component, use the `onchange` attribute.

To retrieve the content of the text area field, use `event.detail.value` property.

```html
<template>
    <lightning-textarea
            name="myTextArea"
            value="initial value"
            label="What are you thinking about?"
            onchange={countLength}>
     </lightning-textarea>
</template>
```

#### Input Validation

Client-side input validation is available for this component. Set a maximum
length using the `max-length` attribute or a minimum length using the
`min-length` attribute. An error message is automatically displayed in the
following cases:

  * A required field is empty when `required` is present on the `lightning-textarea` tag.
  * The input value contains fewer characters than that specified by the `min-length` attribute.
  * The input value contains more characters than that specified by the `max-length` attribute.

To check the validity states of an input, use the `validity` attribute, which
is based on the `ValidityState` object. You can access the validity states in
your JavaScript. This `validity` attribute returns an object with
`boolean` properties. For more information, see the
[`lightning-input`](bundle/lightning-input/documentation) documentation.

You can override the default message by providing your own values for
`message-when-value-missing`, `message-when-bad-input`, `message-when-too-long`, or
`message-when-too-short`.

For example, provide an error message when a required field's value is missing.

```html
<template>
    <lightning-textarea
            name="myText"
            label="Your Name"
            message-when-value-missing="This field is required."
            required>
     </lightning-textarea>
</template>
```

#### Accessibility

You must provide a text label for accessibility to make the information
available to assistive technology. The label attribute creates an HTML label
element for your input component. To hide a label from view and make it
available to assistive technology, use the `label-hidden` variant.


