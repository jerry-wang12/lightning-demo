A `lightning-formatted-rich-text` component is a read-only representation of
rich text. Rich text refers to text that's formatted by HTML tags, such as
`<b>` for bold text or `<u>` for underlined text. You can pass in rich text to
this component using the `lightning-input-rich-text` component or
programmatically in JavaScript.

By default, the component creates links automatically for linkable text. For example, if the input is "Go to salesforce.com", `lightning-formatted-rich-text` creates a link so the output is "Go to [salesforce.com](https://www.salesforce.com/)".
To prevent links from being created, specify the `disable-linkify` attribute.

This example creates a rich text editor that's wired up to a
`lightning-formatted-rich-text` component. The rich text content is set during
initialization.

```html
<template>
    <!-- Rich text editor and formatted output -->
    <lightning-input-rich-text
        value={richtext}
        onchange={handleChange}
    ></lightning-input-rich-text>
    <lightning-formatted-rich-text
        value={richtext}
    ></lightning-formatted-rich-text>
</template>
```


```javascript
import { LightningElement, track } from 'lwc';
export default class MyComponentName extends LightningElement {
    @track richtext = "<h2>Default <s>Value</s></h2>";

    handleChange(e) {
        this.richtext = e.detail.value;
    }
}
```

To use double quotes in your value definitions, escape them using the `\`
character.

```javascript
import { LightningElement, track } from 'lwc';
export default class MyComponentName extends LightningElement {
    @track richtext = "<h2 style=\"text-align: center\">Default <s>Value</s></h2>";

    ...
}
```

To pass in HTML tags in your component markup, escape the tags like this.
```html
<template>
    <lightning-formatted-rich-text value="&lt;h1>TEST&lt;/h1>">
    </lightning-formatted-rich-text>
</template>
```

#### Supported HTML Tags and attributes

The component sanitizes HTML tags passed to the `value` attribute to prevent
XSS vulnerabilities. It also ensures that the formatted output is valid HTML.
For example, if you have mismatched tags like `<div>My Title</h1>`, the
component returns `<div>My Title</div>`.

If you set unsupported tags via JavaScript, those tags are
removed and the text content is preserved. The supported HTML tags are: `a`,
`abbr`, `acronym`, `address`, `b`, `br`, `big`, `blockquote`, `caption`,
`cite`, `code`, `col`, `colgroup`, `del`, `div`, `dl`, `dd`, `dt`, `em`,
`font`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `hr`, `i`, `img`, `ins`, `kbd`,
`li`, `ol`, `p`, `q`, `s`, `samp`, `small`, `span`, `strong`, `sub`, `sup`,
`table`, `tbody`, `td`, `tfoot`, `th`, `thead`, `tr`, `tt`, `u`, `ul`, `var`,
`strike`.

Supported HTML attributes include: `accept`, `action`, `align`, `alt`,
`autocomplete`, `background`, `bgcolor`, `border`, `cellpadding`,
`cellspacing`, `checked`, `cite`, `class`, `clear`, `color`, `cols`,
`colspan`, `coords`, `data-fileid`, `datetime`, `default`, `dir`, `disabled`,
`download`, `enctype`, `face`, `for`, `headers`, `height`, `hidden`, `high`,
`href`, `hreflang`, `id`, `ismap`, `label`, `lang`, `list`, `loop`, `low`,
`max`, `maxlength`, `media`, `method`, `min`, `multiple`, `name`, `noshade`,
`novalidate`, `nowrap`, `open`, `optimum`, `pattern`, `placeholder`, `poster`,
`preload`, `pubdate`, `radiogroup`, `readonly`, `rel`, `required`, `rev`,
`reversed`, `rows`, `rowspan`, `spellcheck`, `scope`, `selected`, `shape`,
`size`, `span`, `srclang`, `start`, `src`, `step`, `style`, `summary`,
`tabindex`, `target`, `title`, `type`, `usemap`, `valign`, `value`, `width`,
`xmlns`.

