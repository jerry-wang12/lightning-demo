A `lightning-formatted-name` component displays formatted names in a given
format and order. The locale set in the app's user preferences determines how
names are formatted and the order they are presented.

This example displays "Mr. John Middleton Doe The 3rd Jo" based on the
default English United States locale with the `long` format.

```html
<template>
    <lightning-formatted-name
            first-name="John"
            middle-name="Middleton"
            last-name="Doe"
            informal-name="Jo"
            suffix="The 3rd"
            salutation="Mr.">
        </lightning-formatted-name>
</template>
```
The `format` attribute determines the length of the name to be displayed.

Format|Description|Example
-----|-----|-----
short|Displays the first name and last name only.|John Doe
medium|Displays the first name, middle name, and last name only.|John Middleton Doe
long (default)|Displays the name including salutation, first name, middle name, last name, suffix, informal name.|Mr. John Middleton Doe The 3rd Jo

For more information on supported locales, see
[Supported Locales](https://help.salesforce.com/articleView?id=admin_supported_locales.htm)
in the Salesforce Help.

To create a form that takes in user input for names, you can use the
`lightning-input-name` component, which displays a name compound field that
supports user input for salutation, suffix, and so on.
