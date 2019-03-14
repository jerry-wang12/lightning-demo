---
examples:
 - name: basic
   label: Formatted URL
   description: Displays a URL with a protocol such as http:// and https://. Protocol http:// is automatically prepended to a value like "my/path" to create an absolute URL. A value "/my/path" creates a relative URL.
---
A `lightning-formatted-url` component displays a text
URL as a hyperlink with an href attribute. The `value` can be a relative or
absolute URL. Absolute URLs use protocols such as `http://`, `https://`, and
`ftp://`, followed by the domain name and path.

This component renders an anchor link with the absolute URL as the
href value and the `label` value as the displayed text. If no label is provided,
the URL passed in `value` is used as the displayed text.

The component renders the link using the `http://` protocol by default.

```html
<template>
    <lightning-formatted-url value="www.salesforce.com">
    </lightning-formatted-url>
</template>
```

The previous example renders the following HTML.

```html
<a href="http://www.salesforce.com">http://www.salesforce.com</a>
```

A relative URL navigates to a path within the current site you're on.

```html
<template>
<!-- Resolves to http://current-domain/my/path -->
    <lightning-formatted-url value="/my/path">
    </lightning-formatted-url>
</template>
```

#### Usage Considerations

Use the `target` attribute to change where the link should open. If you don't
provide a target, the link opens in the window where it was clicked.

Supported `target` values are:

  * `_blank`: Opens the link in a new window or tab.
  * `_self`: Opens the link in the same frame as it was clicked. This is the default behavior.
  * `_parent`: Opens the link in the parent frame. If there's no parent, this is similar to `_self`.
  * `_top`: Opens the link into the top-level browsing context. If there's no parent, this is similar to `_self`.

The framework handles navigation for you, so there's no need to provide onclick
behavior with `lightning-formatted-url`. To create a link with a
custom onclick event handler, use the HTML anchor tag `<a>` instead.
To create a URL that navigates to another page in Salesforce, use
[`lightning-navigation`](bundle/lightning-navigation/documentation).
