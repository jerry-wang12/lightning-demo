A `lightning-tree` component displays visualization of a structural hierarchy,
such as a sitemap for a website or a role hierarchy in an organization. Items
are displayed as hyperlinks and items in the hierarchy can be nested. Items
with nested items are also known as branches.

This component inherits styling from
[trees](https://www.lightningdesignsystem.com/components/trees/) in the
Lightning Design System.

To create a tree, pass in an array of key-value pairs to the `items`
attribute.

Key|Type|Description
-----|-----|-----
label|string|Required. The title and label for the hyperlink.
metatext|string|Text to provide users with supplemental information and aid with identification or disambiguation.
items|object|Nested items as an array of key-value pairs.
name|string|The unique name for the item for the `onselect` event handler to return the tree item that was clicked.
href|string|The URL for the link.
expanded|boolean|Specifies whether a branch is expanded. An expanded branch displays its nested items visually. The default is false.
disabled|boolean|Specifies whether a branch is disabled. A disabled branch can't be expanded. The default is false.

Here's an example of a tree with more than one level of nesting. To retrieve the selected item Id, use the `onselect` event handler. The `select` event is also fired when you select an item with an `href` value.

```html
<template>
    <lightning-tree
        items={treeList}
        onselect={handleSelect}>
    </lightning-tree>
</template>
```

Define the tree items in your JavaScript file. Use the `detail` property to retrieve the name of the selected tree item.

```javascript

import {LightningElement, track} from "lwc";

const items = [{
    "label": "Western Sales Director",
    "name": "1",
    "expanded": true,
    "items": [{
        "label": "Western Sales Manager",
        "name": "2",
        "expanded": true,
        "items" :[{
            "label": "CA Sales Rep",
            "name": "3",
            "expanded": true,
            "items" : []
        },{
            "label": "OR Sales Rep",
            "name": "4",
            "expanded": true,
            "items" : []
        }]
    }]
}, {
    "label": "Eastern Sales Director",
    "name": "5",
    "expanded": false,
    "items": [{
        "label": "Eastern Sales Manager",
        "name": "6",
        "expanded": true,
        "items" :[{
            "label": "NY Sales Rep",
            "name": "7",
            "expanded": true,
            "items" : []
        }, {
            "label": "MA Sales Rep",
            "name": "8",
            "expanded": true,
            "items" : []
        }]
    }]
}];

const mapping = {
    '1' : 'Western Sales Director',
    '2' : 'Western Sales Manager',
    '3' : 'CA Sales Rep',
    '4' : 'OR Sales Rep',
    '5' : 'Eastern Sales Director',
    '6' : 'Eastern Sales Manager',
    '7' : 'NY Sales Rep',
    '8' : 'MA Sales Rep'

};

export default class DemoComponent extends LightningElement {
    @track treeList = items;
    @track selected = '';

    handleSelect(event) {
        //set the name of selected tree item
        this.selected = mapping[event.detail.name];
    }
}
```

#### Adding and Removing Items in a Tree

You can add or remove items in a tree. Let's say you have a tree that looks
like this, with a button to add a nested item to the tree.

```html
<template>
    <lightning-button
        label="Add to Tree"
        id="change-button"
        onclick={handleClick}>
    </lightning-button>
    <lightning-tree
        items={treeList}>
    </lightning-tree>
</template>
```

Define the items in your JavaScript code.

```javascript

import {LightningElement, track} from "lwc";

const items = [{
    label: "Go to Record 1",
    href: "#record1",
    items: [],
    expanded: true,
}, {
    label: "Go to Record 2",
    href: "#record2",
    items: [],
    expanded: true,
}, {
    label: "Go to Record 3",
    href: "#record3",
    items: [],
    expanded: true,
}];

export default class DemoComponent extends LightningElement {
    @track treeList = items;
}
```

This example `handleClick()` function adds a nested item at the end of the tree when the button is clicked.

```javascript
export default class DemoComponent extends LightningElement {
    @track treeList = items;

    handleClick(e) {
        const newItems = Array.from(this.treeList);
        const branch = newItems.length;
        const label = 'New item added at Record' + branch;
        const newItem = {
            label: label,
            expanded: true,
            disabled: false,
            items: []
        };
        newItems[branch - 1].items.push(newItem);
        this.treeList = newItems;
    }
}
```

When providing an `href` value to an item, the `onselect` event handler is
triggered before navigating to the hyperlink.

#### Accessibility

You can use the keyboard to navigate the tree. Tab into the tree and use the
Up and Down Arrow key to focus on tree items. To collapse an expanded branch,
press the Left Arrow key. To expand a branch, press the Right Arrow key.
Pressing the Enter key or Space Bar is similar to an onclick event, and
performs the default action on the item.

#### Custom Events

**`select`**

The event fired when a tree item is selected and before navigating to a given hyperlink.

The `select` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
name|string|The label of the selected tree item.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|true|This event bubbles up through the DOM.
cancelable|true|This event can be canceled. You can call `preventDefault()` on this event.
composed|true|This event propagates outside of the component in which it was dispatched.
