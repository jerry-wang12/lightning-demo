Display toasts to provide feedback to a user following an action, such as after a record is created.

You can style a toast to provide information, an error, a success, or a warning. You can also configure the visibility of the toast. It can remain visible for three seconds, until the user clicks to dismiss it, or a combination of both.

To trigger a toast from a Lightning web component, in the component's JavaScript class, import `ShowToastEvent` from `lightning/platformShowToastEvent`. Create a `ShowToastEvent` with a few parameters, and dispatch it. The app handles the rest.

In this example, when a user clicks the button, the app displays a
toast with the `info` variant, which is the default. The toast remains visible for 3 seconds or until the user presss the close
button, denoted by the X in the top right corner, which is also the default.


 ```html
<template>
    <lightning-button
        label="Show Toast"
        onclick={showToast}>
    </lightning-button>
</template>
```

The `showToast` function creates and dispatches the event. An info toast displays in Lightning Experience for 3 seconds or until the user clicks to close it.

```javascript
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
export default class MyComponent extends LightningElement {
    showToast() {
        const event = new ShowToastEvent({
            title: 'Get Help',
            message: 'Salesforce documentation is available in the app. Click ? in the upper-right corner.',
        });
        this.dispatchEvent(event);
    }
}
```

#### Parameters

Parameter|Type|Description
-----|-----|-----
`title`|String|(Required) The title of the toast, displayed as a heading.
`message`|String|(Required) A string representing the body of the message.
`variant`|String|Changes the appearance of the notice. Toasts inherit styling from [toasts](https://www.lightningdesignsystem.com/components/toast) in the Lightning Design System. Valid values are: `info` (default), `success`, `warning`, and `error`.
`mode`|String|Determines how persistent the toast is. Valid values are: `dismissable` (default), remains visible until you press the close button or 3 seconds has elapsed, whichever comes first; `pester`, remains visible until the close button is clicked; `sticky`, remains visible for 3 seconds.

#### See Also
[Display a Toast Notification](/docs/component-library/documentation/lwc/lwc.use_toast)
