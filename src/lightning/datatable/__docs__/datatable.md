---
examples:
 - name: basic
   label: Basic Data Table
   description: A basic data table that fetches data during initialization. Set the server data on the data attribute. Display data based on the data type by defining the columns object.
 - name: withRowNumbers
   label: Data Table with Row Numbers
   description: Specify show-row-number-column to show row numbers in the data table.
 - name: withRowActions
   label: Data Table with Row Actions
   description: A data table with actions that can be performed on table rows. Use onrowaction to call a handler that defines the actions.
 - name: withInlineEdit
   label: Data Table with Inline Edit
   description: A data table with inline edit enabled, simulating server requests.
---
A `lightning-datatable` component displays tabular data where each column can
be displayed based on the data type. For example, an email address is
displayed as a hyperlink with the `mailto:` URL scheme by specifying the
`email` type. The default type is `text`.

This component inherits styling from [data
tables](https://www.lightningdesignsystem.com/components/data-tables/) in the
Lightning Design System.

`lightning-datatable` is not supported on mobile devices. Supported features
include:

  * Displaying and formatting of columns with appropriate data types
  * Infinite scrolling of rows
  * Inline editing for some data types
  * Header-level actions
  * Row-level actions
  * Resizing of columns
  * Selecting of rows
  * Sorting of columns by ascending and descending order
  * Text wrapping and clipping
  * Row numbering column
  * Cell content alignment

Tables can be populated during initialization using the `data`, `columns`, and
`key-field` attributes. The `key-field` attribute is required for correct table behavior.
It associates each row with a unique identifier.

This example creates a table whose first column displays a checkbox for row selection.
The checkbox column is displayed by default, and you can hide it by using the `hideCheckboxColumn` attribute.
Selecting the checkbox selects the entire row of data and triggers the `onrowselection` event handler.

```html
<template>
    <lightning-datatable
            data={data}
            columns={columns}
            key-field="id"
            onrowselection={getSelectedName}>
    </lightning-datatable>
</template>
````

Here's the JavaScript that creates selectable rows and the
`columns` object to their corresponding column data. The Confidence column
displays percentages with an icon that denotes the increasing or decreasing
confidence trend.

This example defines five columns by setting properties and attributes for the `columns` object. The
Confidence column displays percentages and an icon that denotes the increasing
or decreasing confidence trend. The icon is specified with the `cellAttributes`
property. See Working with Column Properties for more information about the
properties for columns.

The JavaScript also loads two rows of data in the table. The id for each
table row is used as the `key-field`.

```javascript
import { LightningElement, track } from 'lwc';

const columns = [
     {label: 'Opportunity name', fieldName: 'opportunityName', type: 'text'},
     {label: 'Confidence', fieldName: 'confidence', type: 'percent', cellAttributes:
     { iconName: { fieldName: 'trendIcon' }, iconPosition: 'right' }},
     {label: 'Amount', fieldName: 'amount', type: 'currency', typeAttributes: { currencyCode: 'EUR'}},
     {label: 'Contact Email', fieldName: 'contact', type: 'email'},
     {label: 'Contact Phone', fieldName: 'phone', type: 'phone'},
];

const data = [{
                    id: 'a',
                    opportunityName: 'Cloudhub',
                    confidence: 0.2,
                    amount: 25000,
                    contact: 'jrogers@cloudhub.com',
                    phone: '2352235235',
                    trendIcon: 'utility:down'
                },
                {
                    id: 'b',
                    opportunityName: 'Quip',
                    confidence: 0.78,
                    amount: 740000,
                    contact: 'quipy@quip.com',
                    phone: '2352235235',
                    trendIcon: 'utility:up'
                }];

export default class DatatableExample extends LightningElement {
    @track data = data;
    @track columns = columns;

    getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            alert("You selected: " + selectedRows[i].opportunityName);
        }
    }
}
```
When the data table is rendered, each row displays a checkbox in the first
column. The first row shows columns with the following data: Cloudhub, 20%,
$25,000.00, jrogers@cloudhub.com, and (235) 223-5235. The last two columns are
displayed as hyperlinks to represent an email address and telephone number.

#### Working with Column Properties

Use the following column properties to customize the behavior and visual
aspects of your columns.

Property|Type|Description
-----|-----|-----
actions|object|Appends a dropdown menu of actions to a column. You must pass in a list of label-name pairs.
cellAttributes|object|Provides additional customization, such as appending an icon to the output. For more information, see Appending an Icon to Column Data
editable|boolean|Specifies whether a column supports inline editing. The default is false.
fieldName|string|Required. The name that binds the columns attributes to the associated data. Each columns attribute must correspond to an item in the data array.
fixedWidth|integer|Specifies the width of a column in pixels and makes the column non-resizable.
iconName|string|The Lightning Design System name of the icon. Names are written in the format standard:opportunity. The icon is appended to the left of the header label.
initialWidth|integer|The width of the column when it's initialized, which must be within the min-column-width and max-column-width values, or within 50px and 1000px if they are not provided.
label|string|Required. The text label displayed in the column header.
sortable|boolean|Specifies whether the column can be sorted. The default is false.
type|string|Required. The data type to be used for data formatting. For more information, see Formatting with Data Types.
typeAttributes|object|Provides custom formatting with component attributes for the data type. For example, currency-code for the currency type. For more information, see Formatting with Data Types.

#### Formatting with Data Types

The data table formats the data cells of a column based on the type you
specify for the column. Each data
type is associated with a base Lightning component. For example, specifying the
`text` type renders the associated data using a `lightning-formatted-text`
component. Some of these types allow you to pass in the attributes via the
`typeAttributes` attribute to customize your output.

The properties you pass with `typeAttributes` must be specified using the format shown here,
not the format that's used for Lightning web component attributes in your HTML template. For example,
although `lightning-formatted-number` recognizes a `currency-code` attribute, you must specify it as
`currencyCode` with the `typeAttributes` property. For supported attribute
values, refer to the component's documentation.

Type|Description|Supported Type Attributes
-----|-----|-----
action|Displays a dropdown menu using `lightning-button-menu` with actions as menu items. The default dropdown menu alignment, denoted by `menuAlignment`, is `right`. Valid options for `menuAlignment` are `right`, `left`, `auto`, `center`, `bottom-left`, `bottom-center`, and `bottom-right`. See Creating Static Row-Level Actions.|rowActions (required), menuAlignment (defaults to right)
boolean|Displays the icon utility:check if the value is true, and a blank value otherwise.|N/A
button|Displays a button using `lightning-button`|disabled, iconName, iconPosition, label, name, title, variant
button-icon|Displays a button icon using `lightning-button-icon`|alternativeText, class, disabled, iconClass, iconName, name, title, variant
currency|Displays a currency using `lightning-formatted-number`|currencyCode, currencyDisplayAs, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits
date|Displays a date and time based on the locale using `lightning-formatted-date-time`. See Displaying Date and Time Using Type Attributes.|day, era, hour, hour12, minute, month, second, timeZone, timeZoneName, weekday, year
date-local|Displays a date that is formatted based on the locale using `lightning-formatted-date-time`. To include a time value, use the `date` type instead. The value passed is assumed to be in the browser local time zone and there is no time zone transformation.  See Displaying Date and Time Using Type Attributes.|day, month, year
email|Displays an email address using `lightning-formatted-email`|N/A
location|Displays a latitude and longitude of a location using `lightning-formatted-location`|latitude, longitude
number|Displays a number using `lightning-formatted-number`|minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, minimumSignificantDigits, maximumSignificantDigits
percent|Displays a percentage using `lightning-formatted-number`|Same as number type
phone|Displays a phone number using `lightning-formatted-phone`|N/A
text|Displays text using `lightning-formatted-text`|N/A
url|Displays a URL using `lightning-formatted-url`|label, target, tooltip

To customize the formatting based on the data type, pass in the attributes for
the corresponding base Lightning component. For example, pass in a custom
`currencyCode` value to override the default currency code.

```javascript
    const columns = [
        {label: 'Amount', fieldName: 'amount', type: 'currency', typeAttributes: { currencyCode: 'EUR' }}
        // other column data
    ]
```

When using currency or date and time types, the default user locale is used
when no locale formatting is provided.

For more information on attributes and their supported values, see the
corresponding base component documentation.

For more information on creating your own data types, see [Creating Custom Data Types](#creating-custom-data-types).

#### Displaying Date and Time Using Type Attributes

The data table supports dates in the format of a timestamp, a date object, or an ISO8601 formatted string.
These date formats can be displayed differently in a column. The default format is `September 26, 2018`,
which corresponds to `type: "date"` or `type: "date-local"` and an empty `typeAttributes` property.

While the `date` type can be used to display date and time, the `date-local` type displays only the date. Here's how you can display Salesforce date and time data types in `lightning-datatable`.
Salesforce Data Type|Datatable Data Type|Description
-----|-----|-----
DateTime|date|Expects date and time as input, and formats it according  to the user's locale.
Date|date-local|Expects date as input, and formats it according to the user's locale. Does not include time conversion.

Here are several ways to display date and time in a column.

09/26/2018

```javascript
    {
        label: "Date",
        fieldName: "DueDate",
        type: "date-local",
        typeAttributes:{
            month: "2-digit",
            day: "2-digit"
        }
    }
```

Wednesday, September 26, 2018

```javascript
    {
        label: "Closed Date",
        fieldName: "ClosedDate",
        type: "date",
        typeAttributes:{
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "2-digit"
        }
    }
```

September 26, 2018, 12:00 PM

```javascript
    {
        label: "Arrival Time",
        fieldName: "ArrivalTime",
        type: "date",
        typeAttributes:{
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    }
```

Wednesday, September 26, 2018, 12:00 PM

```javascript
    {
        label: "Event Time",
        fieldName: "EventTime",
        type: "date",
        typeAttributes:{
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    }
```

The locale set in the app's user preferences determines the formatting.
For more information, see the [lightning-formatted-date-time](../../bundle/lightning-formatted-date-time/) documentation.

#### Aligning Data in a Column

To horizontally align data in a column, use the `cellAttributes` property to pass in the `alignment` attribute and its setting, which can be `left`, `right`, or `center`.

```javascript
const columns = [
        { label: 'Amount', fieldName: 'amount', type: 'currency', cellAttributes: { alignment: 'left' }}
    // other column data
];
```

By default, number types align to the right. Number types include the `currency`, `number`, `percent` types.

The `action` type aligns to the center and cannot be overridden by the `alignment` attribute. All other types align to the left.

To override the alignment of the `action` type, consider using custom types and provide your own markup. See **Creating Custom Data Types**.


#### Appending an Icon to Column Data

To append an icon to your data output, use `cellAttributes` and pass in these
attributes.

Attribute|Description
-----|-----
iconName|Required. The Lightning Design System name of the icon, for example, utility:down.
iconLabel|The label for the icon to be displayed on the right of the icon.
iconPosition|The position of the icon relative to the data. Valid options include `left` and `right`. This value defaults to `left`.
iconAlternativeText|Descriptive text for the icon.


You can add an icon in several ways.

```javascript
    const columns = [
       // simple icon
        { label: 'Close date', fieldName: 'closeDate', type: 'date', sortable: true, cellAttributes: { iconName: 'utility:event', iconAlternativeText: 'Close Date' }},
       // icon appended with a label
        { label: 'Confidence', fieldName: 'confidence', type: 'percent', cellAttributes:
               { iconName: { fieldName: 'confidenceDeltaIcon' }, iconLabel: { fieldName: 'confidenceDelta' }, iconPosition: 'right', iconAlternativeText: 'Percentage Confidence' }}
        // other column data
        ];
```

#### Using Infinite Scrolling to Load More Rows

Infinite scrolling enables you to load a subset of data and then display more
when users scroll to the end of the table. To enable infinite scrolling, specify
`enable-infinite-loading` and provide an event handler using
`onloadmore`. By default, data loading is triggered when you scroll down to
20px from the bottom of the table, but the offset can be changed using the
`load-more-offset` attribute.

This example loads 50 more rows from the database when you reach the end of
the table until there are no more data to load.

```html
    <template>
        <div style="height: 500px">
            <lightning-datatable
                    columns={columns}
                    data={data}
                    key-field="id"
                    enable-infinite-loading
                    onloadmore={loadMoreData}>
            </lightning-datatable>
        </div>
        {loadMoreStatus}
    </template>
```

The `onloadmore` event handler retrieves more data when you scroll to the
bottom of the table until there are no more data to load. To display a spinner
while data is being loaded, include the `is-loading` attribute.

```javascript
import { LightningElement } from 'lwc';

export default class DatatableExample extends LightningElement {
    @track data = [];
    @track columns = columnsDefs;
    @track loadMoreStatus;
    @api totalNumberOfRows;

    loadMoreData: function (event) {
            //Display a spinner to signal that data is being loaded
            event.target.isLoading = true;
            //Display "Loading" when more data is being loaded
            this.loadMoreStatus = 'Loading';
            fetchData(50)
                .then((data) => {
                    if (data.length >= this.totalNumberOfRows) {
                        event.target.enableInfiniteLoading = false;
                        this.loadMoreStatus = 'No more data to load';
                    } else {
                        const currentData = this.data;
                        //Appends new data to the end of the table
                        const newData = currentData.concat(data);
                        this.data = newData;
                        this.loadMoreStatus = '';
                    }
                    event.target.isLoading = false;
                }));
        }
}
```

While this example uses a fixed number to denote the total number of rows, you
can also use the SOQL SELECT syntax with the `COUNT()` function to return the
number of rows in the object in your Apex controller. Then, set the result on
the `totalNumberOfRows` attribute during initialization.
```
    SELECT COUNT(Id) FROM Contact
```
#### Creating Header-Level Actions

Header-level actions refer to tasks you can perform on a column of data, such
as displaying only rows that meet a criteria provided by the column. You can
perform actions on a column and handle them using the `onheaderaction` event
handler.

Supported attributes for the header actions are as follows.

Attribute|Description
-----|-----
label|Required. The label that's displayed for the action.
name|Required. The name of the action, which identifies the selected action.
checked|Specifies whether a check mark is shown to the left of the action label. If true, a check mark is shown to the left of the menu item. If false, a check mark is not shown but there is space to accommodate one.
disabled|Specifies whether the action can be selected. If true, the action item is shown as disabled. This value defaults to false.
iconName|The name of the icon to be displayed to the right of the action item.

For example, suppose you want to create a filter that displays only rows where the
Publishing State column matches either the Published or Unpublished state.

```html
 <template>
    <lightning-datatable
        columns={mycolumns}
        data={mydata}
        key-field="id"
        onheaderaction={handleHeaderAction}>
    </lightning-datatable>
 </template>
```

Bind the header actions to the `actions` column attribute, which can be done
during initialization.

```javascript
const columns = [
    // other column data
    {
        label: 'Publishing State',
        fieldName: 'published',
        type: 'text',
        actions: [
            { label: 'All', checked: true, name:'all' },
            { label: 'Published', checked: false, name:'show_published' },
            { label: 'Unpublished', checked: false, name:'show_unpublished' }
        ]
    }
];
```
```javascript
handleHeaderAction: (event) {
    // Retrieves the name of the selected filter
    const actionName = event.detail.action.name;
    // Retrieves the current column definition
    // based on the selected filter
    const colDef = event.detail.columnDefinition;
    const columns = this.columns;
    const activeFilter = this.activeFilter;

    if (actionName !== activeFilter) {
        var idx = columns.indexOf(colDef);
        // Update the column definition with the updated actions data
        var actions = columns[idx].actions;
        actions.forEach((action) => {
            action.checked = action.name === actionName;
        });
        this.activeFilter = actionName;
        this.updateBooks();
        this.columns = columns;
    }
}
```

Finally, display the rows to match the selected filter, which is performed by
`this.updateBooks()`.

```javascript
updateBooks: function (cmp) {
    const rows = this.rawData;
    const activeFilter = this.activeFilter;
    const filteredRows = rows;
    if (activeFilter !== 'all') {
        filteredRows = rows.filter(function (row) {
            return (activeFilter === 'show_published' ||
              (activeFilter === 'show_unpublished');
        });
    }
    this.data = filteredRows;
}
```

#### Creating Static Row-Level Actions

Row-level actions refer to tasks you can perform on a row of data, such as
updating or deleting the row. Static actions apply to all rows on the table.
You can perform actions on each row and handle them using the `onrowaction`
event handler.

Supported attributes for the header actions are as follows.

Attribute|Description
-----|-----
label|Required. The label that's displayed for the action.
name|Required. The name of the action, which identifies the selected action.
disabled|Specifies whether the action can be selected. If true, the action item is shown as disabled. This value defaults to false.
iconName|The name of the icon to be displayed to the right of the action item.

```html
 <template>
    <lightning-datatable
                columns={mycolumns}
                data={mydata}
                key-field="id"
                onrowaction={handleRowAction}>
    </lightning-datatable>
</template>
```

You must provide a list of actions to the columns data, which can be done
during initialization. This JavaScript initializes the actions
column and handles the actions on each row, displaying the row details and
deleting the row when the action is clicked.

```javascript
import { LightningElement, track } from 'lwc';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    // Other column data here
    { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'left' } }
];

export default class DatatableExample extends from LightningElement {
    @track data = [];
    @track columns = columns;

    handleRowAction: function (event) {
            const action = event.detail.action;
            const row = event.detail.row;
            switch (action.name) {
                case 'show_details':
                    alert('Showing Details: ' + JSON.stringify(row));
                    break;
                case 'delete':
                    const rows = this.data;
                    const rowIndex = rows.indexOf(row);
                    rows.splice(rowIndex, 1);
                    this.data = rows;
                    break;
     }
}
```

#### Creating Dynamic Row-Level Actions

Dynamic actions are created based on the content of each row. When you click
the dropdown menu, an asynchronous call is made to determine which actions to
display for the particular row. The logic that determines which action to
display can be created on initialization. In this example, the action and its
label is evaluated when the dropdown menu is activated. Assume that we have an
`active` column that displays the status of a contact (Active or Inactive),
which determines which action to display (Deactivate or Activate).

```javascript
import { LightningElement, track } from 'lwc';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' }
];

const columns = [

];

export default class DatatableExample extends from LightningElement {
    @track data = [];
    @track columns = [];

    constructor() {
        super();
        this.columns = [
            // Other column data here
            { type: 'action', typeAttributes: { rowActions: this.getRowActions } },
        ]
    }

    getRowActions(row, doneCallback) {
        const actions = [];
            if (row['isActive']) {
                actions.push({
                    'label': 'Deactivate',
                    'iconName': 'utility:block_visitor',
                    'name': 'deactivate'
                });
            } else {
                actions.push({
                    'label': 'Activate',
                    'iconName': 'utility:adduser',
                    'name': 'activate'
                });
            }
            // simulate a trip to the server
            setTimeout(() => {
                doneCallback(actions);
            }), 200);
    }
}
```

The previous example illustrates how to create and handle dynamic actions on
the client-side only. You can make server calls and persist your record data
changes via an Apex controller.

#### Resizing Tables and Columns

The width and height of the datatable is determined by the container element.
A scroller is appended to the table body if there are more rows to display.
For example, you can restrict the height to 300px by applying CSS styling to
the container element.

```html
    <div style="height: 300px;">
        <!-- lightning-datatable goes here -->
    </div>
```

By default, columns are resizable. Users can click and drag the width to a
minimum of 50px and a maximum of 1000px, unless the default values are
changed. To change the minimum and maximum width column, use the
`min-column-width` and `max-column-width` attributes.

You can disable column resizing for all columns using
`resize-column-disabled`. Disable column resizing
for a specific column by setting the `fixedWidth` column property in the
column definition in JavaScript.

#### Selecting Rows Programmatically

The `selected-rows` attribute enables programmatic selection of rows, which is
useful when you want to preselect rows.

```html
        <lightning-datatable
            columns={columns}
            data={data}
            key-field="id"
            selected-rows={selectedRows}>
        </lightning-datatable>
        <lightning-button
            label="Select"
            onclick={handleSelect}>
        </lightning-button>
```

To select a row programmatically, pass in the row `key-field` value.

```javascript
    // Load data via init handler first
    // then handle programmatic selection
    handleSelect() {
        const rows = ['a'];
        this.selectedRows = rows;
    }
```

If `max-row-selection` is set to a value less than the number of selected rows,
only the specified number of rows will be selected. For example, if you set
`max-row-selection` to 2 and pass in `['a', 'b', 'c']` to `selected-rows`, only
rows a and b will be selected.

#### Sorting Data By Column

To enable sorting of row data by a column label, set `sortable` to `true` for
the column on which you want to enable sorting. Set `sortedBy` to match the
`fieldName` attribute on the column. Clicking a column header sorts rows by
ascending order unless the `defaultSortDirection` is changed, and clicking it
subsequently reverses the order. Handle the `onsort` event handler to update
the table with the new column index and sort direction.

Here's an example of the method that's called by the `onsort`
event handler.

```javascript
        // The method onsort event handler
        updateColumnSorting(event) {
            var fieldName = event.detail.fieldName;
            var sortDirection = event.detail.sortDirection;
            // assign the latest attribute with the sorted column fieldName and sorted direction
            this.sortedBy = fieldName;
            this.sortedDirection = sortDirection;
            this.data = this.sortData(fieldName, sortDirection);
       }
```

#### Working with Inline Editing

When you make a column editable, a pencil icon appears when you hover over the
cells in that column. Clicking the icon or pressing the Enter key triggers
inline editing. Inline editing is not supported for date and location fields.

Make a column editable by setting `editable` to true when you are defining
your columns.

```javascript
    {label: 'Amount', fieldName: 'amount', type: 'currency', typeAttributes: { currencyCode: 'EUR'}, editable : 'true'},
    {label: 'Contact Email', editable : 'true', fieldName: 'contact', type: 'email', editable : 'true'}
```

You can handle the `oncancel`, `oncellchange`, and `onsave` actions when the
cell value changes or is saved. When the `onsave` action is used, the
**Cancel** and **Save** button appears after a value cell changes and you
press the Enter or Tab key, or move away from the cell.

```html
    <template>
        <lightning-datatable
            key-field="id"
            data={data}
            columns={columns}
            onsave={handleSave}>
        </lightning-datatable>
    </template>
```

Retrieve the new value using `event.detail.draftValues`.

```javascript
handleSave(event) {
    this.saveDraftValues = event.detail.draftValues;
}
```

#### Displaying Errors

You can trigger an error on a cell or multiple cells, which then turns the
cell border red and displays a tooltip on the number column. The error
messages appear when you hover over the tooltip. You must make the column
editable. By making a column editable, the `show-row-number-column` attribute is
always true and the number column is displayed.

Based on the first example on this page, add the `errors` attribute to your
component.

Your `lightning-datatable` component should look like this.

```html
<template>
    <lightning-datatable
        key-field="id"
        data={data}
        columns={columns}
        errors={errors}>
    </lightning-datatable>
    <lightning-button
        label="Trigger error"
        onclick={triggerError}>
    </lightning-button>
</template>
```

In this example, we are triggering the error with a `lightning-button`
component.

Finally, define the errors and map them to `fieldNames`. When the error is
triggered, the borders for the `amount` and `contact` cells turn red to
represent the error state.

```javascript
    triggerError(event) {
           this.errors = {
                rows: {
                    b: {
                        title: 'We found 2 errors.',
                        messages: [
                            'Enter a valid amount.',
                            'Verify the email address and try again.'
                        ],
                        fieldNames: ['amount', 'contact']
                    }
                },
                table: {
                    title: 'Your entry cannot be saved. Fix the errors and try again.',
                    messages: [
                        'Row 2 amount must be number',
                        'Row 2 email is invalid'
                    ]
                }
            };
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

#### Creating Custom Data Types
Create your own data types if you want to implement a custom cell, such as a
delete row button or an image, or even a custom number display.
Here's how you can create custom data types.
  * Extend the `LightningDatatable` class and define your custom types.
  * Create your templates to override the default.

Let's take a look at how we create a delete row button that appears on a column on each row.
This button deletes the row and dispatch a custom event to signal the delete.

Your class extends `LightningDatatable` and overrides the template with `deleteRow`,
 which is the custom type you are creating.

 ```javascript
 /* myDatatable.js */
import LightningDatatable from 'lightning/datatable';
import deleteRow from './deleteRow.html';

export default class MyDatatable extends LightningDatatable {
    static customTypes = {
        deleteRowButton: {
            template: deleteRow,
            // Provide template data here if needed
            typeAttributes: ['attrA', 'attrB'],
        }
       //more custom types here
    };
}
```
Pass in the following properties.
  * `template` — The name of your template resource
  * `typeAttributes` — An object with your custom type data, which is defined in the child component.
Access your data using the `typeAttributes.attrA` syntax.

##### Creating A Template

The `deleteRow` file lives in the same directory as the `MyDatatable` class. It references a child component,
`demo-datatable-delete-row-btn`, that does all the heavy-lifting. This template is used to render every cell in the column that matches the custom type.

If you have HTML markup only, you don't need to use a child component as a template. Put your markup in the same directory as the `MyDatatable` class.

```html
<!-- deleteRow.html -->
<template>
    <demo-datatable-delete-row-btn
        data-navigation="enable"
        row-id={value}
        attr-a={typeAttributes.attrA}
        attr-b={typeAttributes.attrB}>
    </demo-datatable-delete-row-btn>
</template>
```

The `value` property binds the value that's computed for the cell. `data-navigation="enable"` enables accessibility and keyboard navigation using the accessibility modules.

The child component uses a base component, `lightning-button-icon`, and defines an event handler for the `onclick` event.

```html
<!-- datatableDeleteRowBtn.html -->
<template>
    <div style="text-align: center;">
        <lightning-button-icon
            icon-name="utility:delete"
            onclick={fireDeleteRow}>
        </lightning-button-icon>
    </div>
</template>
```

##### Dispatching A Custom Event

Create a custom event if you want to handle user interaction on the custom cell.
The child component dispatches a custom event, `deleterow`, which signals to the datatable that a row has been deleted.

```javascript
/* datatableDeleteRowBtn.js */
import { LightningElement, api } from 'lwc';
// Accessibility module
import { baseNavigation } from 'lightning/datatableKeyboardMixins';
// For the render() method
import template from './datatableDeleteRowBtn.html';

export default class DatatableDeleteRowBtn extends baseNavigation(LightningElement) {
    @api rowId;
    @api attrA;
    @api attrB;

    // Required for mixins
    render() {
        return template;
    }

    fireDeleteRow() {
        const event = CustomEvent('deleterow', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                rowId: this.rowId,
            },
        });
        this.dispatchEvent(event);
    }
}
```

The wrapper component displays your custom datatable component.

```html
<template>
    <demo-my-datatable
        key-field="id"
        data={data}
        columns={columns}
        ondeleterow={deleteRow}
        hide-checkbox-column>
    </demo-my-datatable>
</template>
```

Finally, fetch the column data and handle the `deleterow` event in your JS file. This example removes the row from the UI. You must also persist the deletion on the server.

```javascript
import { LightningElement, track } from 'lwc';
/* Import module that fetches data */
import fetchRecords from './fetchData';

const columns = [
    // Your column data here
    {
        label: '',
        type: 'deleteRowButton',
        fieldName: 'id',
        fixedWidth: 70,
        typeAttributes: {
          attrA: { fieldName: 'attrA' },
          attrB: { fieldName: 'attrB' },
        },
    },
];

export default class DatatableAppExExample extends LightningElement {
    @track data = [];
    @track columns = columns;

    connectedCallback() {
        fetchRecords(10).then(
          // Display your data
          // Set your attribute values (attrA, attrB, ...) here
        );
    }

    deleteRow(event) {
        const { rowId } = event.detail;
        // Remove the row
    }
}
```

#### Accessibility

You can use data tables in navigation mode and action mode using the keyboard.
To enter navigation mode, tab into the data table, which triggers focus on the
first data cell in the table body. Use the arrow keys to move around the
table.

To enter action mode, press the Enter key or Space Bar. Columns can be resized
in action mode. To resize a column, navigate to the header by pressing the Up
Arrow key. Then, press the Tab key to activate the column divider, and resize
the column using the Left Arrow and Right Arrow key. To finish resizing the
column and return to navigation mode, press the Tab key. Additionally, the following actions are supported.
 * Move around the table using arrow keys
 * Navigate to to each actionable element in the table using the Tab key

When focus is on a cell that contains a link, pressing enter to navigate to
the link is currently not supported. This limitation applies to cells that
contain data of type url, phone, and email.

##### Accessibility for Custom Data Types

To support accessibility and keyboard navigation on your custom data types,
import `baseNavigation` from the `lightning/datatableKeyboardMixins` module.
`baseNavigation` queries all focusable elements, such as buttons, anchors, and input fields.
Use `data-navigation="enable"` in your custom component as a marker for focusable elements.

`lightning/datatableKeyboardMixins` has the `keyboard-mode` attribute, which determines if the user is in navigation mode or action mode. Valid options are `NAVIGATION` and `ACTION`. The default is `NAVIGATION`. Action mode triggers the actionable element in that cell, such as an edit icon. This example shows how you can apply the action mode to your custom data type.

```html
<template>
    <demo-datatable-my-custom-type
        row-id={value}
        keyboard-mode="ACTION"
        data-navigation="enable">
    </demo-datatable-my-custom-type>
</template>
```

#### Custom Events

**`cancel`**

The event fired when the cancel button is pressed during inline editing.

The `cancel` event does not return any parameter.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|true|This event can be canceled. You can call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`resize`**

The event fired when the table is rendered or when a column is resized.

The `resize` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
columnWidths|object|The width of all columns in pixels.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`rowselection`**

The event fired when the row is selected.

The `rowselection` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
selectedRows|object|The data in the rows that are selected.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`save`**

The event fired when data is saved during inline editing.

The `save` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
draftValues|object|The current value that's provided during inline editing.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`sort`**

The event fired when a column is sorted.

The `sort` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
fieldName|string| The fieldName that controls the sorting.
sortDirection|string| The sorting direction. Valid options include 'asc' and 'desc'.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You cannot call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.
