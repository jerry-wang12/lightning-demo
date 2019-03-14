---
examples:
 - name: basic
   label: Formatted Email
   description: Displays an email address with an email icon. The email address is displayed as the default label.
 - name: onclick
   label: Formatted Email with Custom onclick Behavior
   description: Displays an email address with onclick handler to count clicks.
---
A `lightning-formatted-email` component displays a read-only representation of
an email address as a hyperlink using the `mailto:` URL scheme. Clicking on
the email address opens the default mail application for the desktop or mobile
device.

This example displays an email address with an email icon. The email address
is displayed as the default label.

```html
<template>
    <lightning-formatted-email value="hello@example.com">
    </lightning-formatted-email>
</template>
```

Multiple email addresses are supported. The label "Send a group email" is
displayed as a hyperlink in this example.

```html
<template>
    <lightning-formatted-email
                value="hello@example.com,hellothere@example.com"
                label="Send a group email">
    </lightning-formatted-email>
</template>
```

This example creates an email address with values for cc, subject, and email
body. The label is displayed as a hyperlink.

```html
<template>
    <lightning-formatted-email
            value="hello@example.com?cc=cc@example.com&subject=My%20subject &body=The%20email%20body"
            label="Send us your feedback">
    </lightning-formatted-email>
</template>
```

