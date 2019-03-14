A `lightning-pill-container` component represents a list of pills in a container
that resembles an input field. Use `lightning-pill-container`to display a user's
selection when filtering a list, such as from a multi-select picklist.

This component displays pills using `lightning-pill`, which supports utility
icons from the Lightning Design System. To view the utility icons, visit
[utility icons](https://lightningdesignsystem.com/icons/#utility).

`lightning-pill-container` inherits styling from
[pills](https://www.lightningdesignsystem.com/components/pills) in the
Lightning Design System.

This example creates three pills: a text-only pill, a pill with an avatar, and
a pill with an icon.

```html
<template>
    <lightning-pill-container
        items={items}>
    </lightning-pill-container>
</template>
```

```javascript
import { LightningElement } from 'lwc';
export default class DemoApp extends LightningElement {
    items = [
        {
            label: 'My Pill',
            name: 'mypill'
        },
        {
            type: 'avatar',
            label: 'Avatar Pill',
            name: 'avatarpill',
            src: '/my/path/avatar.jpg',
            fallbackIconName: 'standard:user',
            variant: 'circle',
            alternativeText: 'User avatar',
        },
        {
            type: 'icon',
            label: 'Icon Pill',
            name: 'iconpill',
            iconName: 'standard:account',
            alternativeText: 'Account',
        },
    ];
}
```

A text-only pill supports the following attributes. These attributes can also
be used to create a pill with an avatar or icon.

  * `label`: Required. The text label that displays in the pill.
  * `name`: The name for the pill. This value is optional and can be used to identify the pill in a callback.

To create a pill with an avatar, use the following attributes.

  * `type`: The media type. Use `avatar`.
  * `src`: Required. The URL of the avatar.
  * `fallbackIconName`: The Lightning Design System name of the icon used as a fallback when the image fails to load. The initials fallback relies on this for its background color. Names are written in the format 'standard:account' where 'standard' is the category, and 'account' is the specific icon to be displayed. Only icons from the standard and custom categories are allowed.
  * `variant`: Changes the shape of the avatar. Valid values are empty, circle, and square. This value defaults to square.
  * `alternativeText`: The alternative text used to describe the avatar, which is displayed as hover text on the image.

To create a pill with an icon, use the following attributes.

  * `type`: The media type. Use `icon`.
  * `iconName`: Required. The Lightning Design System name of the icon. Names are written in the format '\utility:down\' where 'utility' is the category, and 'down' is the specific icon to be displayed. Only utility icons can be used in this component.
  * `alternativeText`: The alternative text used to describe the icon. This text should describe what happens when you click the button, for example 'Upload File', not what the icon looks like, 'Paperclip'.

#### Removing Pills

Clicking the remove button triggers the `onitemremove` handler.

```html
<template>
    <lightning-pill-container
            items={items}
            onitemremove={handleItemRemove}>
    </lightning-pill-container>
</template>
```

You can retrieve the name of the pill that's clicked in the event handler and
remove the pill from view.

```javascript
import { LightningElement, track } from 'lwc';

export default class MyDemo extends LightningElement {

    @track items = [
        {
            label: 'My Pill',
            name: 'mypill'
        },
        {
            type: 'avatar',
            label: 'Avatar Pill',
            name: 'avatarpill',
            src: '/my/path/avatar.jpg',
            fallbackIconName: 'standard:user',
            variant: 'circle',
            alternativeText: 'User avatar',
        },
        {
            type: 'icon',
            label: 'Icon Pill',
            name: 'iconpill',
            iconName: 'standard:account',
            alternativeText: 'Account',
        },
    ];
    handleItemRemove (event) {
            const name = event.detail.item.name;
            alert(name + ' pill was removed!');
            const index = event.detail.index;
            this.items = items.splice(index, 1);
        }
}
```

#### Custom Events

**`itemremove`**

The event fired when a pill is removed.

The `itemremove` event returns the following parameters.

Parameter|Type|Description
-----|-----|----------
item|string|The name of the pill that's removed.
index|number|The position of the pill in the array.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|true|This event can be canceled. You can call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.
