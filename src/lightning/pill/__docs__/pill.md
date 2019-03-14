---
examples:
 - name: basic
   label: Basic Pills
   description: Pills can include links and use separate handlers for clicks on the label text and the remove button (X).
 - name: avatarPill
   label: Pill With an Avatar
   description: A pill includes an avatar by nesting a lighting-avatar component.
 - name: iconPill
   label: Pill With an Icon
   description: A pill includes an icon by nesting a lighting-icon component.
 - name: errorPill
   label: Pill With an Error
   description: A pill indicates an error condition by specifying the has-error attribute.
---
A `lightning-pill` component represents an item, such as an account name or
case number, and the text label is wrapped by a rounded border. By default,
pills are rendered with a remove button. They are useful for displaying read-
only text that can be added and removed on demand, for example, a list of
email addresses or a list of keywords.

This component inherits styling from
[pills](https://www.lightningdesignsystem.com/components/pills) in the
Lightning Design System.

Use the `class` attribute to apply additional styling.

This example creates a basic pill.

```html
<template>
    <lightning-pill
        label="Pill Label"
        href="/path/to/some/where"
        onremove={handleRemove}>
    </lightning-pill>
</template>
```

Pills have two clickable elements: the text label and the remove button. Both
elements trigger the `onclick` handler. If you provide an `href` value,
clicking the text label triggers the `onclick` handler and then takes you to
the provided path. Clicking the remove button on the pill triggers the
`onremove` handler and then the `onclick` handler. These event handlers are
optional.

To prevent the `onclick` handler from running, call `event.preventDefault()`
in the `onremove` handler. This example hides a pill when the remove button is clicked
and prevents the `click` event from being fired.

```html
<template if:true={showPill}>
    <lightning-pill
        label="account"
        href="/path/to/some/where"
        onremove={handleRemoveOnly}
        onclick={handleClick}>
    </lightning-pill>
</template>
```


```javascript
import { LightningElement, track } from 'lwc';
export default class MyComponentName extends LightningElement {

    @track showPill = true;

    handleRemoveOnly(event) {
        event.preventDefault();
        this.showPill = !this.showPill;
    }

    handleClick(event) {
        // this won't run when you click the remove button
        alert('The pill was clicked!');
    }
}
```

#### Inserting an Image

A pill can contain an image, such as an icon or avatar, which represents the
type of object. To insert an image in the pill, nest the component for the
image inside the `lightning-pill` component.

```html
<template>
    <lightning-pill
        name="account"
        label="Pill Label"
        href="/path/to/some/where">
                <lightning-icon
                    icon-name="standard:account"
                    alternative-text="Account">
                </lightning-icon>
    </lightning-pill>
</template>
```

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

A pill can display an error state when the containing text doesn't match a
pre-defined collection of items, such as when an email address is invalid or a
case number doesn't exist. Use the `has-error` attribute to denote a pill that
contains an error. This attribute inserts a warning icon on the left
of the label and changes the border to red. Providing your own image in this context
has no effect on the pill.

To create more than one pill, use the `pill-container` component, which gives you access
to the pill array via the `itemremove` event.

#### Accessibility

Use the `alternative-text` attribute to describe the avatar, such as a user's
initials or name. This description provides the value for the `alt` attribute
in the `img` HTML tag.

#### Custom Events

**`remove`**

The event fired when a pill is removed.

The `remove` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
name|string|The name of the pill that's removed.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|true|This event can be canceled. You can call `preventDefault()` on this event to prevent the `click` event from being fired.
composed|false|This event does not propagate outside the template in which it was dispatched.
