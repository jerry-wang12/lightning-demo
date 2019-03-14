---
examples:
 - name: basic
   label: Formatted Phone Number
   description: Formatted phone numbers displayed in several ways.
---
A `lightning-formatted-phone` component displays a read-only representation of
a phone number as a hyperlink using the `tel:` URL scheme. Clicking the phone
number opens the default VOIP call application on a desktop. On mobile
devices, clicking the phone number calls the number.

Providing a phone number with 10 or 11 digits that starts with 1 displays the
number in the format (999) 999-9999. Including a "+" sign before the number
displays the number in the format +19999999999.

Here are two ways to display (425) 333-4444 as a hyperlink.

```html
<template>
    <p>
        <lightning-formatted-phone
            value="4253334444">
        </lightning-formatted-phone>
    </p>
    <p>
        <lightning-formatted-phone
            value="14253334444">
        </lightning-formatted-phone>
    </p>
</template>
```

The previous example renders the following HTML.
```html
    <a href="tel:4253334444">(425) 333-4444</a>
    <a href="tel:14253334444">(425) 333-4444</a>
```
