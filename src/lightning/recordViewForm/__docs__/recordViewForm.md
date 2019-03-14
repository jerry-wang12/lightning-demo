A `lightning-record-view-form` component is a wrapper component that accepts a
record ID and is used to display one or more fields and labels associated with
that record using `lightning-output-field`.

`lightning-record-view-form` requires
a record ID to display the fields on the record. It doesn't require additional
Apex controllers or Lightning Data Service to display record data. This
component also takes care of field-level security and sharing for you, so
users see only the data they have access to.

#### Supported Objects

This component doesn't support all Salesforce standard objects. For example,
the Event and Task objects are not supported.

For a list of supported objects, see the
[User Interface API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_get_started_supported_objects.htm).

#### Displaying Record Fields

To display the fields on a record, specify the fields using
`lightning-output-field`.

```html
<template>
    <lightning-record-view-form
            record-id="001XXXXXXXXXXXXXXX"
            object-api-name="My_Contact__c">
        <div class="slds-box">
            <lightning-output-field field-name="Name">
            </lightning-output-field>
            <lightning-output-field field-name="Email__c">
            </lightning-output-field>
            </div>
    </lightning-record-view-form>
</template>
```
For more information, see the [`lightning-output-field`](bundle/lightning-output-field/documentation) documentation.

#### Working with the View Layout

To create a multi-column layout for your record view, use the [Grid utility
classes](https://www.lightningdesignsystem.com/utilities/grid/) in Lightning Design System.
This example creates a two-column layout.

```html
<template>
    <lightning-record-view-form
            record-id="001XXXXXXXXXXXXXXX"
            object-api-name="My_Contact__c">
        <div class="slds-grid">
            <div class="slds-col slds-size_1-of-2">
                <!-- Your lightning-output-field components here -->
            </div>
            <div class="slds-col slds-size_1-of-2">
                <!-- More lightning-output-field components here -->
            </div>
        </div>
    </lightning-record-view-form>
</template>
```

#### Usage Considerations

Consider using the [`lightning-record-form`](bundle/lightning-record-form/documentation)
component to create record forms more easily.

#### Custom Events

**`load`**

The event fired when the record view form loads record data.

The `load` event returns the following parameters.

Parameter|Type|Description
-----|-----|----------
data|Object|Record data

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

#### See Also

[Create a Form To Work with Records](docs/component-library/documentation/lwc/lwc.data_get_user_input)
for more information and guidance about the record components.

