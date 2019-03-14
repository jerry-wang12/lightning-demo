---
examples:
 - name: basic
   label: Formatted Text
   description: URLs and email addresses in a block of text are displayed as links when you specify the linkify attribute. Newline characters are converted to line breaks.
---
A `lightning-formatted-text` component displays a read-only representation of
text, wrapping URLs and email addresses in anchor tags (also known as
"linkify"). It also converts the \r or \n characters into `<br />` tags.

To display URLs and email addresses in a block of text in anchor tags, include
`linkify` on the `lightning-formatted-text` tag. If not set, URLs and email addresses display as plain text.
`linkify` wraps URLs and email addresses in anchor tags with
`target="_blank"`. URLs and email addresses are appended by `http://` and
`mailto://` respectively.

 ```html
<template>
    <lightning-formatted-text
        value="I like salesforce.com and trailhead.salesforce.com."
        linkify>
    </lightning-formatted-text>
</template>
```

The previous example renders like this.

```html
    I like <a target="_blank" href="http://salesforce.com">salesforce.com</a>
    and <a target="_blank" href="http://trailhead.salesforce.com">trailhead.salesforce.com</a>.
```

#### Usage Considerations

`lightning-formatted-text` supports the following protocols: `http`, `https`,
`ftp` and `mailto`.

If you're working with hyperlinks and need to specify the `target` value, use
`lightning-formatted-url` instead. If you're working with email addresses only,
use `lightning-formatted-email`.

For rich text that uses tags beyond anchor tags, use
`lightning-formatted-rich-text` instead.
