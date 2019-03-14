A `lightning-breadcrumb` component displays the path of a page relative to a
parent page. Breadcrumbs are nested in a `lightning-breadcrumbs` component.
Each breadcrumb is actionable and separated by a greater-than sign. The order
the breadcrumbs appear depends on the order they are listed in markup.

This component inherits styling from
[breadcrumbs](https://www.lightningdesignsystem.com/components/breadcrumbs/)
in the Lightning Design System.

Here is an example.

```html
<template>
 <lightning-breadcrumbs>
    <lightning-breadcrumb
        label="Parent Account"
        href="path/to/place/1">
    </lightning-breadcrumb>
    <lightning-breadcrumb
        label="Case"
        href="path/to/place/2">
    </lightning-breadcrumb>
  </lightning-breadcrumbs>
</template>
```

The behavior of a breadcrumb is similar to a link. If a link is not provided
via the `href` attribute, the value defaults to `javascript:void(0);`. To
provide custom navigation, use an `onclick` handler with `lightning-navigation`. If you provide a link in the `href` attribute,
calling `event.preventDefault()` enables you to bypass the link and use your
custom navigation instead.

```html
<template>
    <lightning-breadcrumbs>
        <lightning-breadcrumb
            label="Parent Account"
            href="path/to/place/1"
            onclick={handleNavigateToCustomPage1}>
        </lightning-breadcrumb>
        <lightning-breadcrumb
            label="Case"
            href="path/to/place/2"
            onclick={handleNavigateToCustomPage2}>
        </lightning-breadcrumb>
    </lightning-breadcrumbs>
</template>
```

Handle the `click` events in your JavaScript code.

```javascript
import { LightningElement } from 'lwc';

export default class DemoBreadcrumbs extends LightningElement {

handleNavigateToCustomPage1(event) {
    event.preventDefault();
    //your custom navigation here
}
handleNavigateToCustomPage2(event) {
    event.preventDefault();
    //your custom navigation here
}
```

#### Generating Breadcrumbs with Iteration

Iterate over a list of items using `for:each` to generate breadcrumbs.
For example, you can create an array of breadcrumbs with label and name
values.

```html
<template>
    <lightning-breadcrumbs>
        <template for:each={myBreadcrumbs} for:item="crumbs">
            <lightning-breadcrumb
                key={crumbs.id}
                label={crumbs.label}
                name={crumbs.name}
                onclick={handleNavigateTo}
            </lightning-breadcrumb>
        </template>
    </lightning-breadcrumbs>
</template>
```

Get the name of the breadcrumb that's clicked using the `event.target` property.

```javascript
//mybreadcrumbs.js
import { LightningElement, track } from 'lwc';

export default class MyComponentName extends LightningElement {
  @track
   myBreadcrumbs = [
      { label: 'Account', name: 'objectName', id: "account1" },
      { label: 'Record Name', name: 'record', id: "account2"},
    ];

    handleNavigateTo(event) {
        //get the name of the breadcrumb that's clicked
        const name = event.target.name;
        event.preventDefault();
        //your custom navigation here
    }
}
```

#### See Also
 [lightning-navigation](bundle/lightning-navigation/documentation)
