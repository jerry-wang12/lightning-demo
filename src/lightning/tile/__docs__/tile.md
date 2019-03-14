A `lightning-tile` component groups related information associated with a
record. The information can be actionable and paired with a figure, such as a
`lightning-icon` or `lightning-avatar` component.

Use the `class` attributes to customize the styling. For example, providing
the `slds-tile_board` class creates the `board` variant. To style the tile
body, use the Lightning Design System helper classes.

This component inherits styling from
[tiles](https://www.lightningdesignsystem.com/components/tiles/) in the
Lightning Design System.

Here is an example.

```html
<template>
    <lightning-tile
        label="Lightning component team"
        href="/path/to/somewhere">
        <p class="slds-truncate" title="7 Members">7 Members</p>
    </lightning-tile>
</template>
```

To insert an icon or avatar, pass it into the `media` slot. You can
create a tile with an icon using definition lists. This example aligns an icon
and some text using helper classes like `slds-dl_horizontal`.

```html
<template>
    <lightning-tile label="Salesforce UX" href="/path/to/somewhere">
        <span slot="media">
                <lightning-icon
                    icon-name="standard:groups"
                    alternative-text="Groups">
                </lightning-icon>
        </span>
        <dl class="slds-dl_horizontal">
            <dt class="slds-dl_horizontal__label">
                <p class="slds-truncate" title="Company">Company:</p>
            </dt>
            <dd class="slds-dl_horizontal__detail slds-tile__meta">
                <p class="slds-truncate" title="Salesforce">Salesforce</p>
            </dd>
            <dt class="slds-dl_horizontal__label">
                <p class="slds-truncate" title="Email">Email:</p>
            </dt>
            <dd class="slds-dl_horizontal__detail slds-tile__meta">
                <p class="slds-truncate" title="salesforce-ux@salesforce.com">salesforce-ux@salesforce.com</p>
            </dd>
        </dl>
    </lightning-tile>
</template>
```

You can also create a list of tiles with avatars using an unordered list, as
shown in this example.

```html
<template>
    <ul class="slds-has-dividers_bottom-space">
        <li class="slds-item">
            <lightning-tile type="media" label="Astro" href="/path/to/somewhere">
                <span slot="media">
                    <lightning-avatar
                        src="/path/to/img"
                        alternative-text="Astro"
                        fallback-icon-name="standard:person_account">
                    </lightning-avatar>
                </span>
                <ul class="slds-list_horizontal slds-has-dividers_right">
                    <li class="slds-item">Trailblazer, Salesforce</li>
                    <li class="slds-item">Trailhead Explorer</li>
                </ul>
            </lightning-tile>
        </li>
        <!-- More list items here -->
    </ul>
</template>
```

You can add a dropdown menu with actions to a tile. To find out which sections are active, use the `actiontriggered` event.

```html
<template>
    <lightning-tile
        label="My Open Cases"
        href="/path/to/my-open-cases"
        actions={actions}
        onactiontriggered={handleAction}>
        <p class="slds-truncate" title="10 Cases">10 Cases</p>
    </lightning-tile>
</template>
```
Use the `detail` property to return the action that was triggered.

```javascript
import { LightningElement, track } from 'lwc';

export default class DemoTileAction extends LightningElement {
    @track actions = [
        {label: 'Edit', value: 'edit', iconName: 'utility:edit'},
        {label: 'Delete', value: 'delete', iconName: 'utility:delete'},
    ];

    handleAction(event) {
        // Get the value of the selected action
        const tileAction = event.detail.action.value;
    }
}
```

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

#### Custom Events

**`actiontriggered`**

The event fired when an action on the dropdown menu is triggered.

The `actiontriggered` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
action|object|The selected action.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.
