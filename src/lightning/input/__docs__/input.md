---
examples:
 - name: date
   label: Date Input
   description: Date input fields provide a date picker for entering a date.
 - name: datetime
   label: Date/Time Input
   description: Date/Time input fields provide a date and time picker for entering a date and time.
 - name: timebasic
   label: Time Input (Basic)
   description: Time input fields provide a dropdown list of time values in 15-minute increments.
 - name: timeadvanced
   label: Time Input (Advanced)
   description: Time input fields support earliest and latest time input.
 - name: color
   label: Color Input
   description: Color input fields provide a color swatch for entering a HEX or RGB value.
 - name: file
   label: File Input
   description: File input fields support upload of single or multiple files and can restrict the accepted file types.
 - name: password
   label: Password Input
   description: Password input fields obscure text.
 - name: tel
   label: Telephone Input
   description: Telephone input fields support number pattern matching.
 - name: url
   label: URL Input
   description: URL input fields support URL pattern matching.
 - name: number
   label: Number Input
   description: Number input fields support decimal, percentage, and currency values.
 - name: checkboxbasic
   label: Checkbox
   description: Checkbox options can be required or disabled.
 - name: checkboxbutton
   label: Checkbox Button
   description: Checkbox buttons can be required or disabled.
 - name: toggle
   label: Toggle
   description: Toggle buttons can be required or disabled.
 - name: search
   label: Search Input
   description: A search input field enables search queries.
---
A `lightning-input` component creates an HTML `input` element. This component
supports HTML5 input types, including `checkbox`, `date`, `datetime`, `time`,
`email`, `file`, `password`, `search`, `tel`, `url`, `number`, `radio`,
`toggle`. The default is `text`.

You can define an action for input events like `onblur`,
`onfocus`, and `onchange`. For example, to handle a change event on the
component when the value of the component is changed, use the `onchange`
attribute.

This component inherits styling from
[input](https://www.lightningdesignsystem.com/components/input/) in the
Lightning Design System.

#### Checkbox

Checkboxes let you select one or more options. `lightning-input
type="checkbox"` is useful for creating single checkboxes. If you are working
with a group of checkboxes, use [`lightning-checkbox-group`](bundle/lightning-checkbox-group/documentation) instead.

```html
<template>
    <lightning-input type="checkbox"
                     label="Red"
                     name="red"
                     checked>
    </lightning-input>
    <lightning-input type="checkbox"
                     label="Blue"
                     name="blue">
    </lightning-input>
</template>
```

#### Checkbox-button

Checkbox buttons let you select one or more options with an alternative visual
design.

```html
<template>
    <lightning-input type="checkbox"
                     label="Add pepperoni"
                     name="addPepperoni"
                     checked
                     value="pepperoni">
    </lightning-input>
    <lightning-input type="checkbox-button"
                     label="Add salami"
                     name="addSalami"
                     value="salami">
    </lightning-input>
</template>
```

#### Color

A color picker enables you to specify a color using a color picker or by
entering the color into a text field.

```html
<template>
    <lightning-input type="color"
                     label="Color"
                     name="color"
                     value="#EEEEEE">
    </lightning-input>
</template>
```

#### Date

An input field for entering a date. The date format is automatically validated
against the user's Salesforce locale format during the `onblur` event.

Use the date picker to pick a date or provide an ISO8601 formatted string in
the `value` attribute. On mobile devices the native date picker is used and on
desktop the Lightning date picker is used.

```html
<template>
    <lightning-input type="date"
                     label="Birthday"
                     name="date">
    </lightning-input>
</template>
```

#### Datetime

An input field for entering a date and time. The date and time formats are
automatically validated against the user's Salesforce locale format during the
`onblur` event. The date and time reflect the user's time zone setting. Use
the `timezone` attribute to specify a different time zone in IANA time zone
database format. For example, specify `timezone="America/New_York"` for US
Eastern Time or `timezone="GMT"` for Greenwich Mean Time.

Use the date picker and time picker to pick a date and time or provide an
ISO8601 formatted string in the `value` attribute. On mobile devices the
native date and time pickers are used and on desktop the Lightning date and
time pickers are used.

```html
<template>
    <lightning-input type="datetime"
                     label="Created date"
                     name="datetime">
    </lightning-input>
</template>
```

#### Email

An input field for entering an email address. The email pattern is
automatically validated during the `onblur` event.

```html
<template>
    <lightning-input type="email"
                     label="Email"
                     name="email"
                     value="abc@example.com">
    </lightning-input>
</template>
```

#### File

An input field for uploading files using an `Upload Files` button or a drag-
and-drop zone.

To retrieve the list of selected files, use
`event.target.files` in the `onchange` event handler. Your selected files are returned in a `FileList` object, each specified as a `File` object with the `name`, `size`, and `type` attributes.

```html
<template>
    <lightning-input type="file"
                     label="Attachment"
                     name="file"
                     accept="image/png, .zip"
                     onchange={handleFilesChange}
                     multiple>
    </lightning-input>
</template>
```

Files uploaded using `type="file"` are subject to a 1 MB size limit, or about
4 MB if you chunk the files. You must wire up your component to an Apex
controller that handles file uploads. Alternatively, use the
[`lightning-file-upload`](bundle/lightning-file-upload/documentation) component for an integrated way to upload files to
records.

#### Number

An input field for entering a number. When working with numerical input, you
can use attributes like `max`, `min`, and `step`.

```html
<template>
    <lightning-input type="number"
                     label="Number"
                     name="number"
                     value="12345">
    </lightning-input>
</template>
```

To format numerical input as a percentage or currency, set `formatter` to
`percent` or `currency` respectively.

```html
<template>
    <lightning-input type="number"
                     label="Price"
                     name="ItemPrice"
                     value="12345"
                     formatter="currency">
    </lightning-input>
</template>
```

Fields for percentage and currency input default to a step increment of 0.01.

```html
<template>
    <lightning-input type="number"
                     name="decimal"
                     label="Enter a decimal value" step="0.001"
                     step="0.001">
    </lightning-input>
    <lightning-input type="number"
                     name="percentVal"
                     label="Enter a percentage value"
                     formatter="percent"
                     step="0.01">
    </lightning-input>
    <lightning-input type="number"
                     name="currencyVal"
                     label="Enter a dollar amount"
                     formatter="currency"
                     step="0.01">
    </lightning-input>
</template>

```

To enter a percentage value as is, use `formatter="percent-fixed"`. For
example, entering "10" results in "10%" on blur.

#### Password

An input field for entering a password. Characters you enter are masked.

```html
<template>
    <lightning-input type="password"
                     label="Password"
                     name="password">
    </lightning-input>
</template>
```

#### Radio

Radio buttons let you select only one of a given number of options.
`lightning-input type="radio"` is useful for creating single radio buttons. If
you are working with a set of radio buttons, use [`lightning-radio-group`](bundle/lightning-radio-group/documentation)
instead.

```html
<template>
    <lightning-input type="radio"
                     label="Red"
                     name="red"
                     value="red"
                     checked>
    </lightning-input>
    <lightning-input type="radio"
                     label="Blue"
                     name="blue"
                     value="blue">
    </lightning-input>
</template>
```

#### Range

A slider control for entering a number. When working with numerical input, you
can use attributes like `max`, `min`, and `step`.

```html
<template>
    <lightning-input type="range"
                     label="Number"
                     name="number"
                     min="0"
                     max="10">
    </lightning-input>
</template>
```

#### Search

An input field for entering a search string. This field displays the Lightning
Design System search utility icon.

```html
<template>
    <lightning-input type="search"
                     label="Search"
                     name="search">
    </lightning-input>
</template>
```

#### Tel

An input field for entering a telephone number. Use the `pattern` attribute to
define a pattern for field validation.

```html
<template>
    <lightning-input type="tel"
                     label="Telephone"
                     name="tel"
                     value="343-343-3434"
                     pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
    </lightning-input>
</template>
```

#### Text

An input field for entering text. This is the default input type.

```html
<template>
    <lightning-input label="Name"
                     name="myname">
    </lightning-input>
</template>
```

#### Time

An input field for entering time. The time format is automatically validated
against the user's Salesforce locale format during the `onblur` event.

Use the time picker to pick a time or provide an ISO8601 formatted time string
in the `value` attribute. On mobile devices the native time picker is used and
on desktop the Lightning time picker is used.

```html
<template>
    <lightning-input type="time"
                     label="Time"
                     name="time">
    </lightning-input>
</template>
```

#### Toggle

A checkbox toggle for selecting one of two given values. Use the
`message-toggle-active` and `message-toggle-inactive` attributes to specify labels
displayed under the toggle for each state. By default the labels are Active
and Inactive. To display no labels, set these attributes to empty strings.

```html
<template>
    <lightning-input type="toggle"
                     label="Toggle value"
                     name="togglevalue"
                     checked>
    </lightning-input>
</template>
```

#### URL

An input field for entering a URL. The address must include the protocol, such
as http:// or ftp://. The URL pattern is automatically validated during the
`onblur` event. If you want to enter the address without the protocol, such as
www.example.com, use the default `type="text"` instead.

```html
<template>
    <lightning-input type="url"
                     label="Website"
                     name="website">
    </lightning-input>
</template>
```

#### Input Validation

Client-side input validation is available for this component. For example, an
error message is displayed when a URL or email address is expected for an
input type of `url` or `email`. Note that disabled and read-only inputs are
always valid.

You can define additional field requirements. For example, to set a maximum
length, use the `maxlength` attribute.

```html
<template>
    <lightning-input type="quantity"
                     value="1234567890"
                     label="Quantity"
                     maxlength="10">
    </lightning-input>
</template>
```

To check the validity states of an input, use the `validity` attribute, which
is based on the Constraint Validation API. To determine if a field is valid,
you can access the validity states in JavaScript. Let's say
you have the following input field.

```html
<template>
    <lightning-input name="input"
                     id="myinput"
                     label="Enter some text"
                     onblur={handleBlur}>
    </lightning-input>
</template>
```

The `valid` attribute returns true because all constraint validations are met,
and in this case there are none.

```javascript
import { LightningElement } from 'lwc';

export default class DemoInput extends LightningElement {

    handleBlur(event) {
        var validity = get("myinput.validity");
        console.log(validity.valid); //returns true
    }
```

For example, you have the following form with several fields and a button. To
display error messages on invalid fields, use the `reportValidity()` method.

```html
<template>
    <lightning-input id="field"
                     label="First name"
                     placeholder="First name"
                     required>
    </lightning-input>
    <lightning-input id="field"
                     label="Last name"
                     placeholder="Last name"
                     required>
    </lightning-input>
    <lightning-button id="submit"
                      type="submit"
                      label="Submit"
                      onclick={handleClick}>
    </lightning-button>
</template>
```

Validate the fields in JavaScript.

```javascript
export default class InputHandler extends LightningElement {
    @track value = "initial value";

    handleClick(evt) {
        console.log('Current value of the input: ' + evt.target.value);

        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                        inputCmp.reportValidity();
                        return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            alert('All form entries look valid. Ready to submit!');
        } else {
            alert('Please update the invalid form entries and try again.');
        }

    }
}
```

This `validity` attribute returns an object with the following read-only `boolean`
attributes.

  * `badInput`: Indicates that the value is invalid.
  * `customError`: Indicates that a custom error has been set. See Custom Validity Error Messages.
  * `patternMismatch`: Indicates that the value doesn't match the specified pattern.
  * `rangeOverflow`: Indicates that the value is greater than the specified `max` attribute.
  * `rangeUnderflow`: Indicates that the value is less than the specified `min` attribute.
  * `stepMismatch`: Indicates that the value doesn't match the specified `step` attribute.
  * `tooLong`: Indicates that the value exceeds the specified `maxlength` attribute.
  * `tooShort`: Indicates that the value is less than the specified `minlength` attribute.
  * `typeMismatch`: Indicates that the value doesn't match the required syntax for an email or url input type.
  * `valueMissing`: Indicates that an empty value is provided when `required` attribute is set to `true`
  * `valid`: True if none of the preceding properties are true.

#### Error Messages

When an input validation fails, the following messages are displayed by
default.

  * `badInput`: Enter a valid value.
  * `patternMismatch`: Your entry does not match the allowed pattern.
  * `rangeOverflow`: The number is too high.
  * `rangeUnderflow`: The number is too low.
  * `stepMismatch`: Your entry isn't a valid increment.
  * `tooLong`: Your entry is too long.
  * `tooShort`: Your entry is too short.
  * `typeMismatch`: You have entered an invalid format.
  * `valueMissing`: Complete this field.

You can override the default messages by providing your own values for these
attributes: `message-when-bad-input`, `message-when-pattern-mismatch`,
`message-when-type-mismatch`, `message-when-value-missing`,
`message-when-range-overflow`, `message-when-range-underflow`,
`message-when-step-mismatch`, `message-when-too-long`.

For example, you want to display a custom error message when the input is less
than five characters.

```html
<template>
    <lightning-input name="firstname"
                     label="First Name"
                     minlength="5"
                     message-when-bad-input="Your entry must be at least 5 characters.">
    </lightning-input>
 </template>
 ```

#### Custom Validity Error Messages

The component supports `setCustomValidity()` from HTML5's Constraint
Validation API. To set an error message, provide a quoted string to display.
To reset the error message, set the message to an empty string (""). See
details at [https://www.w3.org/TR/html52/sec-forms.html#dom-htmlinputelement-setcustomvalidity](https://www.w3.org/TR/html52/sec-forms.html#dom-htmlinputelement-setcustomvalidity).

This example shows how to display a custom error message with
`setCustomValidity()` and `reportValidity()`. The component is a simple text
input with a button.


```html
<template>
    <lightning-input class="inputCmp"
                     name="fullName"
                     label="Enter your name:">
    </lightning-input>
    <lightning-button label="Register"
                      onclick={register}>
    </lightning-button>
 </template>
 ```

The `register()` function compares the input entered by the user to a
particular text string. If true, `setCustomValidity()` sets the custom error
message. The error message is displayed immediately using `reportValidity()`.
Note that when the comparison isn't true, you should set the error message to
an empty string to zero out any messages that might have been set on previous
calls.

```javascript
import { LightningElement } from 'lwc';
export default class MyComponent extends LightningElement {

    register(event) {
        var inputCmp = this.template.querySelector(".inputCmp");
        var value = inputCmp.value;
        // is input valid text?
        if (value === "John Doe") {
            inputCmp.setCustomValidity("John Doe is already registered");
        } else {
            inputCmp.setCustomValidity(""); // if there was a custom error before, reset it
        }
        inputCmp.reportValidity(); // Tells lightning-input to show the error right away without needing interaction
    }
}
```


#### Usage Considerations

`maxlength` limits the number of characters you can enter. The
`message-when-too-long` error message isn't triggered because you can't type more
than the number of characters allowed. However, you can use the
`message-when-pattern-mismatch` and `pattern` to achieve the same behavior.

```html
    <lightning-input type="text"
                     message-when-pattern-mismatch="Too many characters!"
                     pattern=".{0,5}"
                     name="input-name"
                     label="Enter up to 5 characters">
    </lightning-input>
```

You can use custom labels that display translated values on input fields. For more information,
see [Access Labels](docs/component-library/documentation/lwc/lwc.create_labels)

The following input types are not supported.

  * `button`
  * `hidden`
  * `image`
  * `reset`
  * `submit`

Use `lightning-button` instead for input types `button`, `reset`, and
`submit`.

Additionally, when working with checkboxes, radio buttons, and toggle
switches, use `id` to group and traverse the array of components. You can
use `get("checked")` to determine which elements are checked or unchecked
without reaching into the DOM. You can also use the `name` and `value`
attributes to identify each component during the iteration. The following
example groups three checkboxes together using `id`.

```html
<template>
    <fieldset>
        <legend>Select your favorite color:</legend>
        <lightning-input type="checkbox" label="Red"
            name="color1" value="1" id="colors">
        </lightning-input>
        <lightning-input type="checkbox" label="Blue"
            name="color2" value="2" id="colors">
        </lightning-input>
        <lightning-input type="checkbox" label="Green"
            name="color3" value="3" id="colors">
        </lightning-input>
    </fieldset>
    <lightning-button label="Submit" onclick={submitForm}>
    </lightning-button>
</template>
```

Arabic, Hindi, and Persian numbers are not supported by `lightning-input` for these `type` values:

  * `number`
  * `date`
  * `time`
  * `datetime`

#### Accessibility

You must provide a text label for accessibility to make the information
available to assistive technology. The `label` attribute creates an HTML
`label` element for your input component. To hide a label from view and make
it available to assistive technology, use the `label-hidden` variant.
