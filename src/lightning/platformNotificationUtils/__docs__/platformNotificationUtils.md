Messages can be displayed in notices and toasts. Notices alert users to
system-related issues and updates. Toasts enable you to provide feedback and
serve as a confirmation mechanism after the user takes an action.

Import the relevant methods from 'lightning-notifications-library' in your JavaScript
for the component that triggers the notifications.

#### Notices

Notices interrupt the user's workflow and block everything else on the page.
Notices must be acknowledged before a user regains control over the app again.
As such, use notices sparingly. They are not suitable for confirming a user's
action, such as before deleting a record. To dismiss the notice, only the OK
button is currently supported.

Notices inherit styling from
[prompts](https://www.lightningdesignsystem.com/components/prompt) in the
Lightning Design System.

Here's an example that contains a button. When clicked, the button displays a
notice with the `error` variant.

<---TODO Fix this html--->

 ```html
    <template>
        <lightning-notifications-library id="notifLib">
        </lightning-notifications-library>
        <lightning-button
                name="notice"
                label="Show Notice"
                onclick={handleShowNotice}>
        </lightning-button>
    </template>
```

The `handleShowNotice` function displays the notice.

<---TODO Fix this javascript--->

```javascript
import { LightningElement } from "lwc";
import { showNotice } from "lightning-notifications-library"
export default class MyComponentName extends LightningElement {

        handleShowNotice : function(component, event, helper) {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Something has gone wrong!",
                "message": "Unfortunately, there was a problem updating the record.",
                closeCallback: function() {
                    alert('You closed the alert!');
                }
            });
        }
    }
```

To create and display a notice, pass in the notice attributes using
`component.find('notifLib').showNotice()`, where `notifLib` matches the
`id` on the `lightning-notifications-library` instance.

#### Parameters

Parameter|Type|Description
-----|-----|-----
header|String|The heading that's displayed at the top of the notice.
title|String|The title of the notice, displayed in bold.
message|String|The message within the notice body. New lines are replaced by `<br/>` and text links by anchors.
variant|String|Changes the appearance of the notice. Accepted variants are info, warning, and error. This value defaults to info.
closeCallback|Function|A callback that's called when the notice is closed.


#### Toasts

Toasts are less intrusive than notices and are suitable for providing feedback
to a user following an action, such as after a record is created. A toast can
be dismissed or can remain visible until a predefined duration has elapsed.

Toasts inherit styling from
[toasts](https://www.lightningdesignsystem.com/components/toast) in the
Lightning Design System.

Here's an example that contains a button. When clicked, the button displays a
toast with the `info` variant and remains visible until you press the close
button, denoted by the X in the top right corner.

<---TODO Fix this html-->

```html
    <template>
        <lightning-notifications-library id="notifLib">
        </lightning-notifications-library>
        <lightning-button
                name="toast"
                label="Show Toast"
                onclick={handleShowToast}>
        </lightning-button>
    </template>
```
The `handleShowToast` function displays the toast.

<---TODO Fix this javascript-->

```javascript
import { LightningElement } from "lwc";
import { showToast } from "lightning-notifications-library"
export default class MyComponentName extends LightningElement {

        handleShowToast : function(component, event, helper) {
            component.find('notifLib').showToast({
                "title": "Notif library Success!",
                "message": "The record has been updated successfully."
            });
        }
    })
```

To create and display a toast, pass in the toast attributes using
`component.find('notifLib').showToast()`, where `notifLib` matches the
`aura:id` on the `lightning-notifications-library` instance.

#### Parameters

Parameter|Type|Description
-----|-----|-----
title|String|The title of the toast, displayed as a heading.
message|String|A string representing the message. It can contain placeholders in the form of {0} ... {N}. The placeholders will be replaced with the action links on the message data.
messageData|Object|Array of inlined action links to replace within the toast message template.
variant|String|Changes the appearance of the notice. Accepted variants are `info`, `success`, `warning`, and `error`. This value defaults to `info`.
mode|String|Determines how persistent the toast is. The default is `dismissable`. Valid modes are `dismissable`: Remains visible until you press the close button or 3 seconds has elapsed, whichever comes first, `pester`: Remains visible until the close button is clicked, `sticky`: Remains visible for 3 seconds.
