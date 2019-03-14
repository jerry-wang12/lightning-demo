A `lightning-record-edit-form` component is a wrapper component that accepts a
record ID and is used to display one or more fields and labels associated with
that record. The `lightning-input-field` component is used inside the
`lightning-record-edit-form` to create editable fields.

The `lightning-output-field` component and other display components such as
`lightning-formatted-name` can be used to display read-only information in your
form.

`lightning-record-edit-form` requires a record ID to display the fields on the
record. It doesn't require additional Apex controllers or Lightning Data
Service to display record data. This component also takes care of field-level
security and sharing for you, so users see only the data they have access to.

`lightning-record-edit-form` and `lightning-input-field` support the following
features.

  * Display a record edit layout for editing a specified record
  * Display a record create layout for creating a new record

#### Supported Objects

This component doesn't support all Salesforce standard objects. For example,
the Event and Task objects are not supported.

For a list of supported objects, see the
[User Interface API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_get_started_supported_objects.htm).

#### Error Handling

You must include `lightning-messages` to support error handling and displaying
of error messages.

If the record edit layout includes a `lightning-button` component with `type="submit"`,
when the button is clicked the `lightning-record-edit-form` component automatically performs
error handling and saves any changes in the input fields. Similarly, if the
record create layout provides a submit button, when the button is clicked error
handling is automatically performed and a new record is created with the input
data you provide.

Additionally, the `lightning-record-edit-form` component provides basic input
validation. For example, entering an invalid email format for the Email field
results in an error message when you try to submit the change. Similarly, a
required field like the Last Name field displays an error message when you try
to submit the change and the field is blank.

#### Editing a Record

To enable record editing, pass in the ID of the record and the corresponding
object API name to be edited. Specify the fields you want to include in the
record edit layout using `lightning-input-field`. For more information, see the
[`lightning-input-field`](bundle/lightning-input-field/documentation) documentation.


```html
<template>
    <lightning-record-edit-form record-id="003XXXXXXXXXXXXXXX"
                                object-api-name="Contact">
        <lightning-messages>
        </lightning-messages>
        <lightning-output-field field-name="AccountId">
        </lightning-output-field>
        <lightning-input-field field-name="FirstName">
        </lightning-input-field>
        <lightning-input-field field-name="LastName">
        </lightning-input-field>
        <lightning-input-field field-name="Email">
        </lightning-input-field>
        <lightning-button
            class="slds-m-top_small"
            variant="brand"
            type="submit"
            name="update"
            label="Update">
        </lightning-button>
    </lightning-record-edit-form>
</template>
```

#### Creating a Record

To enable record creation, pass in the object API name for the record to be
created. Specify the fields you want to include in the record create layout
using `lightning-input-field` components. For more information, see the
[`lightning-input-field`](bundle/lightning-input-field/documentation) documentation.

```html
<template>
    <lightning-record-edit-form object-api-name="Contact">
        <lightning-messages>
        </lightning-messages>
        <lightning-input-field field-name="Name">
        </lightning-input-field>
            <lightning-button
                class="slds-m-top_small"
                type="submit"
                label="Create new">
            </lightning-button>
    </lightning-record-edit-form>
</template>
```

#### Returning the Record Id

A record Id is generated when a record is created successfully. To return the Id, use the `onsuccess` handler.
This example shows an Id field that's populated when you create an account by providing an account name and pressing the __Create Account__ button.

```html
<template>
    <lightning-record-edit-form object-api-name="Account" onsuccess={handleSuccess}>
        <lightning-messages></lightning-messages>
        <div class="slds-m-around_medium">
            <lightning-input-field field-name='Id' value={accountId}></lightning-input-field>
            <lightning-input-field field-name='Name'></lightning-input-field>
            <div class="slds-m-top_medium">
                <lightning-button variant="brand" type="submit" name="save" label="Create Account">
                </lightning-button>
           </div>
       </div>
    </lightning-record-edit-form>
</template>
```

The `accountId` property is annotated with `@track` so that if its value changes, the component rerenders.

```javascript
import { LightningElement, track } from 'lwc';

export default class createRecordForm extends LightningElement {
   @track accountId;
   handleSuccess(event) {
       this.accountId = event.detail.id;
   }
}
```

#### Displaying Forms Based on a Record Type

If your org uses record types, picklist fields display values according to
your record types. You must provide a record type ID using the `record-type-id`
attribute if you have multiple record types on an object and you don't have a
default record type. Otherwise, the default record type ID is used.

To retrieve a list of record type IDs in your org, use the `getObjectInfo` wire adapter. For more information, see the [getObjectInfo documentation](docs/component-library/documentation/lwc/lwc.reference_wire_adapters_object_info).

#### Working with the Edit Layout

To create a multi-column layout for your record edit layout, use the Grid
utility classes in Lightning Design System. This example creates a two-column
layout.

```html
<template>
    <lightning-record-edit-form
            record-id="003XXXXXXXXXXXXXXX"
            object-api-name="Contact">
        <div class="slds-grid">
            <div class="slds-col slds-size_1-of-2">
                <!-- Your lightning-input-field components here -->
            </div>
            <div class="slds-col slds-size_1-of-2">
                    <!-- More lightning-input-field components here -->
            </div>
        </div>
    </lightning-record-edit-form>
</template>
```

#### Overriding Default Behaviors

To customize the behavior of your form when it loads or when data is
submitted, use the `onload` and `onsubmit` attributes to specify event
handlers. If you capture the submit event and submit the form
programmatically, use `event.preventDefault()` to cancel the default behavior
of the event. This prevents a duplicate form submission.

Errors are automatically handled. To customize the behavior of the form when
it encounters an error on submission or when data is submitted successfully,
use the `onerror` and `onsuccess` attributes to specify event handlers.

Here are some example event handlers for `onsubmit` and `onsuccess`.

 ```javascript
handleSubmit(event){
    event.preventDefault();       // stop the form from submitting
    const fields = event.detail.fields;
    fields.Street = '32 Prince Street';
    this.template.querySelector('lightning-record-edit-form').submit(fields);
}
handleSucess(event){
    const updatedRecord = event.detail.id;
    console.log('onsuccess: ', updatedRecord);
}
```

To see all the response data:

```javascript
handleSuccess(event){
    const payload = event.detail;
    console.log(JSON.stringify(payload));
}
```

The same event handlers can be used with [`lightning-record-form`](bundle/lightning-record-form/documentation).

#### Usage Considerations

The lookup type is supported in Lightning Experience only. When used in the
mobile app, the lookup type is rendered as an input text field. Read-only fields are displayed as
input fields that are disabled.

When using `lightning-input-field`, rich text fields can't be used for image
uploads.

For more information about supported field types, see the
[`lightning-input-field`](bundle/lightning-input-field/documentation) documentation.

Consider using the [`lightning-record-form`](bundle/lightning-record-form/documentation)
component to create record forms more easily.

#### Custom Events

**`load`**

The event fired when the record edit form loads record data.

The `load` event returns the following parameters.

 Parameter|Type|Description
-----|-----|----------
data|Object|The record data and object metadata. For more information, see the [User Interface API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_record_ui.htm).
picklistValues|Object|Values of picklists in record, if any.

 The event properties are as follows.

 Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call preventDefault() on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`submit`**

The event fired when the record edit form submits changed record data.

The `submit` event returns the following parameters.

 Parameter|Type|Description
-----|-----|----------
fields|Object|The fields that are provided for submission during a record create. For example, if you include a `lightning-input-field` component with the `Name` field, `fields` returns `FirstName`, `LastName`, and `Salutation`.

The event properties are as follows.

 Property|Value|Description
-----|-----|----------
bubbles|true|This event bubbles up through the DOM.
cancelable|true|This event can be canceled. You can call `preventDefault()` on this event.
composed|true|This event propagates outside of the component in which it was dispatched.

**`success`**

The event fired when the record edit form submits changed record data.

Use the `event.detail` property to return the saved record. For more information, see the [User Interface API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_record.htm).

 The event properties are as follows.

 Property|Value|Description
-----|-----|----------
bubbles|true|This event bubbles up through the DOM.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|true|This event propagates outside of the component in which it was dispatched.

#### See Also

[Create a Form To Work with Records](docs/component-library/documentation/lwc/lwc.data_get_user_input)
for more information and guidance about the record components.
