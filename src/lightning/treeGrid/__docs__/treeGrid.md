A `lightning-tree-grid` component displays hierarchical data in a table. Its
appearance resembles `lightning-datatable`, with the exception that each row
can be expanded to reveal a nested group of items. Rows that contain nested
data display a chevron icon to denote that they can be expanded or collapsed.
This visual representation is useful for displaying structured data such as
account hierarchy or forecasting data. Each column's formatting is determined
by its data type. For example, a phone number is displayed as a hyperlink with
the `tel:` URL scheme by specifying the `phone` type. The default type is
`text`.

This component inherits styling from
[trees](https://www.lightningdesignsystem.com/components/trees/) in the
Lightning Design System.

Inline editing and sorting of columns are not supported. Supported features
include:

  * Displaying and formatting of columns with appropriate data types
  * Header-level actions
  * Infinite scrolling of rows
  * Row-level actions
  * Resizing of columns
  * Selecting of rows
  * Text wrapping and clipping

A checkbox is displayed by default in the first column. The `hide-checkbox-column` attribute
removes the checkbox.

Initialize your tree grid data using the `data`, `columns`, and `key-field` attributes
and define their values in JavaScript. Note that `key-field` is required.

This example creates a tree grid with 5 columns, where the
first column displays a checkbox for row selection. Selecting the checkbox
enables you to select the entire row of data and triggers the `onrowselection`
event handler. The `expanded-rows` attribute is optional, and expands nested
items on a row when provided.

The example includes two buttons whose handlers call `lightning-tree-grid` methods
to collapse all rows and to show which rows are expanded.

```html
<template>
    <div class="slds-m-bottom_small">
        <lightning-button
            label="Collapse All"
            onclick={clickToCollapseAll}>
        </lightning-button>
    </div>

    <div class="slds-m-bottom_small">
        <lightning-button
            label="Get Expanded"
            onclick={clickToGetExpanded}>
        </lightning-button>
        <p>Expanded currently : {currentExpandedStr}</p>
    </div>

    <lightning-tree-grid
        data={data}
        columns={columns}
        key-field="name"
        expanded-rows={currentExpanded}>
    </lightning-tree-grid>
</template>
```

This example JavaScript creates selectable rows, with the row named 123555 having no nested
data and the row named 123556 having two levels of nested data.
The Account Owner column displays labels with an associated URL. Nested
items must be defined using the `_children` key.

```javascript
import { LightningElement, track } from 'lwc';

const columns = [
    {
        type: 'text',
        fieldName: 'accountName',
        label: 'Account Name'
    },
    {
        type: 'number',
        fieldName: 'employees',
        label: 'Employees'
    },
    {
        type: 'phone',
        fieldName: 'phone',
        label: 'Phone Number'
    },
    {
        type: 'url',
        fieldName: 'accountOwner',
        label: 'Account Owner',
        typeAttributes: {
            label: { fieldName: 'accountOwnerName' }
        }
    }
];

const nestedData = [
    {
        "name": "123555",
        "accountName": "Rewis Inc",
        "employees": 3100,
        "phone": "837-555-1212",
        "accountOwner": "http://example.com/jane-doe",
        "accountOwnerName": "Jane Doe"
    },
    {
        "name": "123556",
        "accountName": "Acme Corporation",
        "employees": 10000,
        "phone": "837-555-1212",
        "accountOwner": "http://example.com/john-doe",
        "accountOwnerName": "John Doe",
        "_children": [
            {
                "name": "123556-A",
                "accountName": "Acme Corporation (Bay Area)",
                "employees": 3000,
                "phone": "837-555-1212",
                "accountOwner": "http://example.com/john-doe",
                "accountOwnerName": "John Doe",
                "_children": [
                    {
                        "name": "123556-A-A",
                        "accountName": "Acme Corporation (Oakland)",
                        "employees": 745,
                        "phone": "837-555-1212",
                        "accountOwner": "http://example.com/john-doe",
                        "accountOwnerName": "John Doe"
                    },
                    {
                        "name": "123556-A-B",
                        "accountName": "Acme Corporation (San Francisco)",
                        "employees": 578,
                        "phone": "837-555-1212",
                        "accountOwner": "http://example.com/jane-doe",
                        "accountOwnerName": "Jane Doe"
                    }
                ]
            }
        ]
    },
];

export default class DemoElement extends LightningElement {}
```

This example JavaScript shows that row 123556 is expanded initially.

The `columns`, `data`, and `currentExpanded` properties are private
reactive properties, which is indicated by the `@track` decorator in the JS file.
If the values of any of these properties change, the component's template rerenders.

The `clickToGetExpanded()` function calls the `getCurrentExpandedRows()` method to retrieve
the names of the rows that are currently expanded.

```javascript
const initialExpandedRows = ['123556'];

export default class DemoElement extends LightningElement {
    @track columns = columns;
    @track data = nestedData;
    @track currentExpanded = initialExpandedRows;


    clickToGetExpanded(e) {
        const grid =  this.template.querySelector('lightning-tree-grid');
        this.currentExpanded = grid.getCurrentExpandedRows();
    }

    get currentExpandedStr() {
        return this.currentExpanded.toString();
    }
}
```

Additionally, you can toggle nested items using `expandAll()` and
`collapseAll()` methods supported by `lightning-tree-grid`.

These functions show how to use the `expandAll()` and `collapseAll()` methods.
The Collapse All button in the example calls the `clickToExpandAll()` function.

```javascript
clickToExpandAll(e) {
        const grid =  this.template.querySelector('lightning-tree-grid');
        grid.expandAll();
    }

clickToCollapseAll(e) {
        const grid =  this.template.querySelector('lightning-tree-grid');
        grid.collapseAll();
    }
```


#### Working with Column Properties

Use the following column properties to customize the behavior and visual
aspects of your columns.

Attribute|Type|Description
-----|-----|-----
label|string|Required. The text label displayed in the column header.
fieldName|string|Required. The name that binds the columns attributes to the associated data. Each columns attribute must correspond to an item in the data array.
type|string|Required. The data type to be used for data formatting. For more information, see __Formatting with Data Types__.
initialWidth|integer|The width of the column when it's initialized, which must be within the minColumnWidth and maxColumnWidth values, or within 50px and 1000px if they are not provided.
typeAttributes|object|Provides custom formatting with component attributes for the data type. For example, currencyCode for the currency type. For more information, see __Formatting with Data Types__.
cellAttributes|object|Provides additional customization, such as appending an icon to the output. For more information, see __Appending an Icon to Column Data__
actions|object|Appends a dropdown menu of actions to a column. You must pass in a list of label-name pairs.
iconName|string|The Lightning Design System name of the icon. Names are written in the format standard:opportunity. The icon is appended to the left of the header label.

#### Formatting with Data Types

The tree grid formats the data cells of a column based on the type you
specify for the column. Each data type
is associated with a base Lightning web component. For example, specifying the
`text` type renders the associated data using a `lightning-formatted-text`
component. Some of these types allow you to pass in the attributes via the
`typeAttributes` attribute to customize your output.

The properties you pass with `typeAttributes` must be specified using the format shown here,
not the format that's used for Lightning web component attributes in your HTML template. For example,
although `lightning-formatted-number` recognizes a `currency-code` attribute, you must specify it as
`currencyCode` with the `typeAttributes` property. For supported attribute
values, refer to the component's documentation.

The first column in the tree grid supports the following data types.

Type|Description|Supported Type Attributes
-----|-----|-----
currency|Displays a currency using `lightning-formatted-number`|currencyCode, currencyDisplayAs, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits
date|Displays a date and time based on the locale using `lightning-formatted-date-time`|day, era, hour, hour12, minute, month, second, timeZone, timeZoneName, weekday, year
number|Displays a number using `lightning-formatted-number`|minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits
percent|Displays a percentage using `lightning-formatted-number`|Same as number type
text|Displays text using `lightning-formatted-text`|N/A
url|Displays a URL using `lightning-formatted-url`|label, target, tooltip

All other columns support the following data types.


Type|Description|Supported Type Attributes
-----|-----|-----
action|Displays a dropdown menu using `lightning-button-menu` with actions as menu items|rowActions (required), menuAlignment (defaults to right)
boolean|Displays the icon utility:check if the value is true, and a blank value otherwise.|N/A
button|Displays a button using `lightning-button`|disabled, iconName, iconPosition, label, name, title, variant
button-icon|Displays a button icon using `lightning-button-icon`|alternativeText, class, disabled, iconClass, iconName, name, title, variant
currency|Displays a currency using `lightning-formatted-number`|currencyCode, currencyDisplayAs, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits
date|Displays a date and time based on the locale using `lightning-formatted-date-time`|day, era, hour, hour12, minute, month, second, timeZone, timeZoneName, weekday, year
date-local|Displays a simple date that is formatted based on the locale. The value passed is assumed to be in the browser local time zone and there is no time zone transformation.|day, month, year
email|Displays an email address using `lightning-formatted-email`|N/A
location|Displays a latitude and longitude of a location using `lightning-formatted-location`|latitude, longitude
number|Displays a number using `lightning-formatted-number`|minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits
percent|Displays a percentage using `lightning-formatted-number`|Same as number type
phone|Displays a phone number using `lightning-formatted-phone`|N/A
text|Displays text using `lightning-formatted-text`|N/A
url|Displays a URL using `lightning-formatted-url`|label, target, tooltip

To customize the formatting based on the data type, pass in the attributes for
the corresponding base Lightning web component. For example, pass in a custom
`currencyCode` value to override the default currency code.

```javascript
    var columns = [
        {label: 'Amount', fieldName: 'amount', type: 'currency', typeAttributes: { currencyCode: 'EUR' }}
        // other column data
    ]
```

When using currency or date and time types, the default user locale is used
when no locale formatting is provided. For more information on attributes, see
the corresponding component documentation.

#### Creating Header-Level and Row-Level Actions

Header-level actions refer to tasks you can perform on a column of data, while
row-level actions refer to tasks you can perform on a row of data, such as
updating or deleting the row. Creating actions in `lightning-tree-grid` is
similar to creating actions in `lightning-datatable`. For more information,
see [lightning-datatable](bundle/lightning-datatable/documentation).

#### Asynchronous Loading of Nested Items

If you have a large number of nested items that would delay the loading of
your data, consider loading your nested items asynchronously. The nested items
are displayed only when you expand the particular row. To do so, initialize
your data without nested items, then add the nested items separately when the row
is expanded.

Handle asynchronous loading of nested items when a row is expanded using the
`ontoggle` action. Find the name of the row being expanded and check if data
for the nested items is already available before retrieving and displaying the
nested items.

```javascript

function getNewDataWithChildren (rowName, data, children) {

    return data.map(function(row) {
        let hasChildrenContent = false;
        if (row.hasOwnProperty('_children') && Array.isArray(row._children) && row._children.length > 0) {
            hasChildrenContent = true;
        }

        if (row.name === rowName) {
            row._children = children;
        } else if (hasChildrenContent) {
            getNewDataWithChildren(rowName, row._children, children);
        }

        return row;
    });
}

handleRowToggle(event) {

        const newChildren = [
            {
                "name": "123555-A",
                "accountName": "Rewis Inc (Oakland)",
                "employees": 345,
                "phone": "837-555-1212",
                "accountOwner": "http://example.com/john-doe",
                "accountOwnerName": "John Doe"
            },
            {
                "name": "123555-B",
                "accountName": "Rewis Inc (San Francisco)",
                "employees": 435,
                "phone": "837-555-1212",
                "accountOwner": "http://example.com/jane-doe",
                "accountOwnerName": "Jane Doe"
            }
        ];

        const rowName = event.detail.name;
        const hasChildrenContent = event.detail.hasChildrenContent;

        if (!hasChildrenContent) {
            this.data = getNewDataWithChildren(rowName, this.data, newChildren);
        }
    }
```

#### Text Wrapping and Clipping

You can wrap or clip text within columns, which either expands the rows to
reveal more content or truncate the content to a single line within the
column.

To toggle between the two views, select **Wrap text** or **Clip text** from
the dropdown menu on the column header.

If the number of characters is more than what the column width can hold,
content is clipped by default. Text wrapping is supported only for the
following data types.

  * currency
  * date
  * email
  * location
  * number
  * percent
  * phone
  * text
  * url

#### Accessibility

This component supports navigation mode and action mode using the keyboard. To
enter navigation mode, tab into the table, which triggers focus on the first
data cell in the table body. Use the arrow keys to move around the table.

To enter action mode, press the Enter key or Space Bar. Columns can be resized
in action mode. To resize a column, navigate to the header by pressing the Up
Arrow key. Then, press the Tab key to activate the column divider, and resize
the column using the Left Arrow and Right Arrow key. To finish resizing the
column and return to navigation mode, press the Tab key.

When focus is on a cell that contains a link, pressing enter to navigate to
the link is currently not supported. This limitation applies to cells that
contain data of type url, phone, and email.

#### Custom Events

**`toggle`**

The event fired when a row is expanded or collapsed.

The `toggle` event returns the following parameters.

Parameter|Type|Description
-----|-----|----------
name|string|The unique ID for the row that's toggled.
isExpanded|boolean|Specifies whether the row is expanded or not.
hasChildrenContent|boolean|Specifies whether any data is available for the nested items of this row. When value is false, `_children` is null, undefined, or an empty array. When value is true, `_children` has a non-empty array.
row|object|The toggled row data.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`toggleall`**

The event fired when all rows are expanded or collapsed.

The `toggleall` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
isExpanded|boolean|Specifies whether the row is expanded or not.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`rowselection`**

The event fired when a row is selected.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`headeraction`**

The event fired when a header-level action is run.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`rowaction`**

The event fired when a row-level action is run.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.
