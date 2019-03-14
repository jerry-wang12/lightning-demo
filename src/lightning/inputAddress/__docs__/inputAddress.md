A `lightning-input-address` component is an address compound field represented
by HTML `input` elements of type `text`. The country and province fields can
be an input field or a dropdown menu. An input field is displayed if
`country-options` and `province-options` are not provided.

This example creates an address compound field with a field for the street,
city, province, postal code, and country.

```html
<template>
    <div >
        <lightning-input-address
            address-label="Address"
            street-label="Street"
            city-label="City"
            country-label="Country"
            province-label="State"
            postal-code-label="PostalCode"
            street="1 Market St."
            city="San Francisco"
            country="US"
            province="CA"
            postal-code="94105">
        </lightning-input-address>
    </div>
</template>
```

To create a dropdown menu for the country and province, pass in an array of
label-value pairs to `country-options` and `province-options`. The `country` and
`province` values are used as the default values on the dropdown menus.

```html
<template>
    <div>
        <lightning-input-address
            address-label="Address"
            street-label="Street"
            city-label="City"
            country-label="Country"
            province-label="Province/State"
            postal-code-label="PostalCode"
            street="1 Market St."
            city="San Francisco"
            country="US"
            country-options={countryOptions}
            province-options={provinceOptions}
            postal-code="94105"
            required>
        </lightning-input-address>
    </div>
</template>
```

JavaScript file:

```javascript
import { LightningElement } from 'lwc';

export default class DemoInputAddress extends LightningElement {
    provinceOptions = [
        { label: 'California', value: 'CA' },
        { label: 'Texas', value: 'TX' },
        { label: 'Washington', value: 'WA' },
    ];

    countryOptions = [
        { label: 'United States', value: 'US' },
        { label: 'Japan', value: 'JP' },
        { label: 'China', value: 'CN' },
    ];

}
```


Alternatively, you can enable state and country picklists in your org, and
access the values through an Apex controller. For more information, see
[Let Users Select State and Country from Picklists](https://help.salesforce.com/articleView?id=admin_state_country_picklists_overview.htm)
in Salesforce Help.

#### Usage Considerations

When you set `required`, a red asterisk is displayed on every address
field to indicate that they are required. An error message is displayed below
a field if a user interacted with it and left it blank. The `required`
attribute is not enforced and you must validate it before submitting a form
that contains an address compound field.

Let's say you have a `lightning-button` component that calls the `handleClick`
function. You can display the error message when a user clicks the
button without providing a value on a field.


```
    function handleClick(e) {
        const address =
            this.template.querySelector('lightning-address');
        const isValid = address.checkValidity();
        if(isValid) {
            alert("Creating a new address);
        }

    }
```
#### Custom Events

**`change`**

The event fired when an item is changed in the `lightning-input-address` component.

The `change` event returns the following parameters.

Parameter|Type|Description
-----|-----|----------
street|string|The number and name of street.
city|string|The name of the city.
province|string|The name of the province/state.
country|string|The name of the country.
postalCode|string|The postal code for the address.
validity|object|The validity state of the element.


The `change` event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|true|This event bubbles up through the DOM.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|true|This event propagates outside of the component in which it was dispatched.
