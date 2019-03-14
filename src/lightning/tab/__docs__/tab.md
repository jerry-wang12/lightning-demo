A `lightning-tab` keeps related content in a single container. The tab content
displays when a user clicks the tab. `lightning-tab` is intended to be used
with `lightning-tabset`.

This component inherits styling from
[tabs](https://www.lightningdesignsystem.com/components/tabs/) in the
Lightning Design System.

#### Usage Considerations

Tab content is lazy loaded, and as such only the active and previously active tabs content is queryable.

See [`lightning-tabset`](bundle/lightning-tabset/documentation) for more
information.

You can nest `lightning-tab` within other elements such as `<div>` or `<template>`, for example to render tabs conditionally using `if:true` and `if:false`. Otherwise, you must nest
`lightning-tab` directly within `lightning-tabset` tags.

For example, you want to display a tab conditionally.

```html
<lightning-tabset>
    <lightning-tab label="Item One">
        Content for tab 1
    </lightning-tab>
    <template if:true={showTabTwo}>
        <lightning-tab label="Item Two">
            Content for tab 2
        </lightning-tab>
    </template>
</lightning-tabset>
```

The `label` attribute supports text only.  Use the `iconName` attribute to include an icon in a tab, and `iconAssistiveText` to provide alternative text for the icon. Set `showErrorIndicator` to `true` to display an error indicator in the tab.
