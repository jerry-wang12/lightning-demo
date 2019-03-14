---
examples:
 - name: simple
   label: Simple Layout
   description: A layout can include layout items as columns.
 - name: nested
   label: Nested Page Layout
   description: A layout item can contain nested layouts.
 - name: horizontalAlignSpace
   label: Layout with a Horizontal Align (Space)
   description: Position layout items horizontally across the container, with space before, between, and after the items.
 - name: horizontalAlignSpread
   label: Layout with a Horizontal Align (Spread)
   description: Position layout items horizontally across the container, with space between the items.
 - name: verticalAlignCenter
   label: Layout with a Vertical Align (Center)
   description: Position layout items vertically in the center of the container.
 - name: verticalAlignStretch
   label: Layout with a Vertical Align (Stretch)
   description: Stretch out layout items vertically to fill the container.
 - name: pullToBoundary
   label: Layout with PullToBoundary Attribute
   description: Pull layout items to the edges of the container.
---
A `lightning-layout` is a flexible grid system for arranging containers within
a page or inside another container. The default layout is mobile-first and can
be easily configured to work on different devices.

The layout can be customized by setting the following attributes.

#### `horizontal-align`

Spread layout items out horizontally based on the following values.

  * `center`: Appends the `slds-grid_align-center` class to the grid. This attribute orders the layout items into a horizontal line without any spacing, and places the group into the center of the container.
  * `space`: Appends the `slds-grid_align-space` class to the grid. The layout items are spaced horizontally across the container, starting and ending with a space.
  * `spread`: Appends the `slds-grid_align-spread` class to the grid. The layout items are spaced horizontally across the container, starting and ending with a layout item.
  * `end`: Appends the `slds-grid_align-end` class to the grid. The layout items are grouped together and aligned horizontally on the right side of the container.

#### `vertical-align`

Spread layout items out vertically based on the following values.

  * `start`: Appends the `slds-grid_vertical-align-start` class to the grid. The layout items are aligned at the top of the container.
  * `center`: Appends the `slds-grid_vertical-align-center` class to the grid. The layout items are aligned in the center of the container.
  * `end`: Appends the `slds-grid_vertical-align-end` class to the grid. The layout items are aligned at the bottom of the container.
  * `stretch`: Appends the `slds-grid_vertical-stretch` class to the grid. The layout items extend vertically to fill the container.

#### `pull-to-boundary`

Pull layout items to the layout boundaries based on the following values. If
padding is used on layout items, this attribute pulls the elements on either
side of the container to the boundary. Choose the size that corresponds to the
padding on your `layout-items`. For instance, if
`lightning-layout-item padding="horizontalSmall"`, choose `pull-to-boundary="small"`.

  * `small`: Appends the `slds-grid_pull-padded` class to the grid.
  * `medium`: Appends the `slds-grid_pull-padded-medium` class to the grid.
  * `large`: Appends the `slds-grid_pull-padded-large` class to the grid.

Use the `class` or `multiple-rows` attributes to customize the styling in other
ways.

A simple layout can be achieved by enclosing layout items within
`lightning-layout`. Here is an example.

Web component HTML template:

```html
<template>
    <div class="c-container">
            <lightning-layout horizontal-align={horizontalAlign}>
                <lightning-layout-item flexibility="auto" padding="around-small">
                    1
                </lightning-layout-item>
                <lightning-layout-item flexibility="auto" padding="around-small">
                    2
                </lightning-layout-item>
                <lightning-layout-item flexibility="auto" padding="around-small">
                    3
                </lightning-layout-item>
                <lightning-layout-item flexibility="auto" padding="around-small">
                    4
                </lightning-layout-item>
            </lightning-layout>
     </div>
</template>
```

JavaScript class
```javascript

import { LightningElement, api } from 'lwc';

export default class MyLayout extends LightningElement {
    @api horizontalAlign = 'space';
}
```


