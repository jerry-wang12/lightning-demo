A `lightning-input-rich-text` component creates a rich text editor based on the
Quill JS library, enabling you to add, edit, format, and delete rich text. You
can create multiple rich text editors with different toolbar configurations.
Pasting rich content into the editor is supported if the feature is available
in the toolbar. For example, you can paste bold text if the bold button is
available in the toolbar.

This component inherits styling from
[rich text editor](https://www.lightningdesignsystem.com/components/rich-text-editor)
in the Lightning Design System.

This example creates a rich text editor and sets its content during
initialization.

```html
<template>
    <lightning-input-rich-text
        value={myVal}>
    </lightning-input-rich-text>
</template>
```

Initialize the rich text content in JavaScript.

```javascript
import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {

    get myVal() {
        return '**Hello!**';
    }
}
```

#### Customizing the Toolbar

The toolbar provides menus and buttons that are ordered within the following categories.

  1. `FORMAT_FONT`: Font family and size menus. The font menu provides the following font selections: Arial, Courier, Garamond, Salesforce Sans, Tahoma, Times New Roman, and Verdana. The font selection defaults to Salesforce Sans with a size of 12px. Supported font sizes are: 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, and 72. When you copy and paste text in the editor, the font is preserved only if the font is available in the font menu.
  2. `FORMAT_TEXT`: Bold, Italic, Underline, and Strikethrough buttons.
  3. `FORMAT_BODY`: Bulleted List, Numbered List, Indent, and Outdent buttons.
  4. `ALIGN_TEXT`: Left Align Text, Center Align Text, and Right Align Text buttons.
  5. `INSERT_CONTENT`: Image and Link buttons.
  6. `REMOVE_FORMATTING`: Remove formatting button, which stands alone at the end of the toolbar.

You can disable buttons by category using the `disabled-categories` attribute.

This example shows how to disable the `FORMAT_TEXT` category for Bold, Italic, Underline, and Strikethrough buttons.
```html
<lightning-input-rich-text
    value={myVal}
    disabled-categories="FORMAT_TEXT">
</lightning-input-rich-text>
```

You can also customize the text editor using the `formats` attribute, which lists individual formats that the text editor supports within the categories.

By default, `lightning-input-rich-text` enables the following formats:

`'font', 'size', 'bold', 'italic', 'underline', 'strike', 'list', 'indent', 'align', 'link', 'image', 'clean', 'table', 'header'`

Some formats are associated with buttons in the toolbar, and some only support pasted content. The `table` and `header` formats support pasted content only, and do not provide toolbar buttons.

Formats you can add to `lightning-input-rich-text` in addition to the default formats:

*Inline formats*

* `background` to support background color of pasted text.
* `color` to to support text color and provide a text color button.
* `code` to support pasted text that is styled for code
* `script` to support subscript and superscript pasted text.

*Block formats*

* `blockquote` to support blockquotes in pasted text.
* `direction` to support RTL and LTR text in pasted text.
* `code-block` to support code blocks in pasted text.

The `formats` attribute must include the complete list of formats to enable. If you pass in a subset of the formats, all other formats are removed from the toolbar, and pasted content using the missing formats are not rendered correctly in the text editor.

This example shows how to add the `color` format to the editor, which adds a text color button.
```html
<lightning-input-rich-text
    value={myVal}
    formats=['font', 'size', 'bold', 'italic', 'underline',
    'strike', 'list', 'indent', 'align', 'link',
    'image', 'clean', 'table', 'header', 'color']>
</lightning-input-rich-text>
```
This example shows how to remove `strike` from the editor, which removes the strikethrough button from the toolbar.
```html
<lightning-input-rich-text
    value={myVal}
    formats=['font', 'size', 'bold', 'italic', 'underline',
    'list', 'indent', 'align', 'link',
    'image', 'clean', 'table', 'header']>
</lightning-input-rich-text>
```

#### Inserting Images

Clicking the image button opens a file picker you can use to locate and upload
the image. Supported image types are png, jpg, jpeg, and gif. The maximum image
size is 1MB. The image is uploaded to your org's Files object and inserted
inline in the text editor. Resizing of images is not supported.

On macOS, you can also paste images that you copy from the desktop directly in
the text editor when using Chrome or Safari. On Windows, pasting images from
the desktop into the text editor is not supported in any browser.

Control access to the image by using the `share-with-entity-id` attribute to
specify entity ID. The image that's uploaded to the Files object is shared
with the specified entity, such as a record, org, or user. For example, if the
text editor is used in a record edit form, the image could be shared with the
recordId of the record that's being edited. The image is visible to all users
in an org if you set `share-with-entity-id` to the org ID.
If `share-with-entity-id` is not set,
the image is private and visible only to the user who uploaded the image.


#### Input Validation

`lightning-input-rich-text` doesn't provide built-in validation but you can wire
up your own validation logic. Set the `valid` attribute to `false` to change
the border color of the rich text editor to red. This example checks whether
the rich text content is empty or undefined.

```html
<template>
    <lightning-input-rich-text
        value={myVal}
        placeholder="Type something interesting"
        message-when-bad-input={errorMessage}
        valid={validity}>
    </lightning-input-rich-text>
    <lightning-button
        name="validate"
        label="Validate"
        onclick={validate}>
    <lightning-button>
</template>
```

The `validity` method toggles the validity of the rich text editor, and
displays the error message when it's invalid.

```javascript
import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {

    @api myVal = "";
    @api errorMessage = "You haven't composed anything yet." ;
    @api validity = true;

    validity() {
        if (!this.myVal) {
            this.validity = false;
        }
        else {
            this.validity = true;
        }
    }
```

#### Supported HTML Tags

The rich text editor provides a WYSIWYG interface only. You can't edit HTML
tags using the editor, but you can set the HTML tags via the `value`
attribute. When you copy content from a web page or another source and paste
it into the editor, unsupported tags are removed. Only formatting that
corresponds to an enabled toolbar button or menu is preserved.

For example, if
you disable the `FORMAT_TEXT` category, the Bold, Italic,
Underline, and Strikethrough buttons are not available. Furthermore,
pasting bold, italic, underlined, or strikethrough text in the editor are not
supported when you disable the `FORMAT_TEXT` category. Text that was enclosed
in unsupported tags is preserved as plain text. However, tables that you copy
in a browser window can be pasted into the editor and set
via the `value` attribute, even though there are no corresponding toolbar
buttons or menus for them.

The component sanitizes HTML tags passed to the `value` attribute to prevent
XSS vulnerabilities. Only HTML tags that correspond to features available on
the toolbar are supported. If you set unsupported tags via JavaScript,
those tags are removed and the text content is preserved. The
supported HTML tags are: `a`, `b`, `col`, `colgroup`, `em` (converted to `i`),
`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `i`, `img`, `li`, `ol`, `p`, `q`, `s`,
`strike` (converted to `s`), `strong`, `table`, `tbody`, `td`, `tfoot`, `th`,
`thead`, `tr`, `u`, `ul`, `strike`.

Pasting text enclosed in `div` and `span` tags convert those tags to `p` tags.
Let's say you paste or set some text in the editor that looks like this.

```
    The sky is <span style="color:blue;font-weight:bold">blue</span>.
    <div style="color:#0000FF;font-weight:bold">This is some text in a div element.</div>
```

The editor returns the following markup.

```html
    <p>The sky is <b>blue</b>.</p>
    <p><b>This is some text in a div element.</b></p>
```

Notice that the `font-weight:bold` formatting is preserved and converted to a
`b` tag since it corresponds to the Bold toolbar button. Color formatting
in the markup is removed.

To retrieve the HTML content in the rich text editor, use the `event.detail.value` property.

#### Differences From the `lightning:inputRichText` Component

The `lightning-input-rich-text` component provides the Link button and the Image
button by default. The Aura component `lighting:inputRichText` does not provide the
Link button, and requires you to use the `lightning:insertImageButton` child component
to add the Image button.


#### Usage Considerations

The editor automatically indents nested bulleted lists. If you insert extra indents, they are removed on save.

Although a toolbar button for creating tables is not available,
creating them programmatically or copying from a browser window and pasting
these elements preserves the formatting in the editor.

The value of the `label` attribute is read by screen readers and the
`label-visible` attribute determines whether the label is also visible on the
screen. If you don't specify either attribute, a default label is applied and
it's not visible. You can set `label` to a value of your choice. Use
`label-visible` to make the label visible, whether `label` has a default value
or one you have specified.

