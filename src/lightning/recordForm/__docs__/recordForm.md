A `lightning-record-form` component enables you to quickly create forms to add,
view, or update a record. Using this component to create record forms is
easier than building forms manually with `lightning-record-edit-form` and
`lightning-record-view-form`. However, `lightning-record-form` does not support
client-side validation quite the same as `lightning-record-edit-form`.
See **Client-Side Validation** for more information.

The `object-api-name` attribute is always required, and the `record-id` is
required unless you're creating a record.

#### Modes

The component accepts a `mode` value that determines the user interaction
allowed for the form. The value for `mode` can be one of the following:

  * `edit` - Creates an editable form to add a record or update an existing one. When updating an existing record, specify the recordId. Edit mode is the default, and as such, can be omitted.
  * `view` - Creates a form to display a record that the user can also edit. The record fields each have an edit button.
  * `readonly` - Creates a form to display a record without enabling edits. The form doesn't display any buttons.

#### Specifying Record Fields

For all modes, the component expects the `fields` attribute, the `layout-type`
attribute, or both. Use the `fields` attribute to specify a comma-separated
list of record fields to load into the form. The fields load in the order
you list them. Use the `layout-type` attribute to
specify a `Full` or `Compact` layout.

All fields that have been assigned to the
layout are loaded into the form. This is the same behavior as the Lightning
Data Service's `force:recordData` object.

Layouts are typically created or
modified by administrators. Loading record data using `layout-type` allows the
form to adapt to those layout definitions. If you provide the `fields`
attribute and the `layout-type` attribute, the fields specified in the `fields`
attribute are loaded before the layout fields.

This component takes care of field-level security and sharing for you, so
users see only the data that they have access to.

#### Viewing a Record with Option to Edit Fields

Use `mode="view"` and pass the ID of the record and the corresponding object
API name to be displayed. Specify the fields using the `fields` attribute, or
`layout-type` attribute to display all the fields defined on the Full or Compact
layout.

The view mode loads the form using output fields with inline editing enabled,
indicated by the edit icons near each field. If the user clicks an edit icon,
all fields in the form become editable, and the form displays Submit and
Cancel buttons.

This example creates a view mode form with fields from a Full layout.

```html
<lightning-record-form
    record-id="001XXXXXXXXXXXXXXX"
    object-api-name="My_Contact__c"
    layout-type="Full"
    mode="view">
</lightning-record-form>
```

#### Viewing a Record Read-Only

Use `mode="readonly"` and pass the ID of the record and the corresponding
object API name to be displayed. Specify the fields using the `fields`
attribute, or `layout-type` attribute to display all the fields defined on the
Full or Compact layout.

The readonly mode loads the form with output fields only, and without Submit
or Cancel buttons.

This example creates a readonly mode form with a single column and fields from
a compact layout.

```html
<lightning-record-form
    record-id="001XXXXXXXXXXXXXXX"
    object-api-name="My_Contact__c"
    layout-type="Compact"
    columns="1"
    mode="readonly">
</lightning-record-form>
```

#### Editing a Record

If you do not specify the `mode` attribute, its default value is `edit`.

To edit a record, pass the ID of the record and the corresponding object
API name to be edited. Specify the fields using the `fields` attribute, or
`layout-type` attribute to load all the fields defined on the Full or Compact layout.

When `record-id` is passed, edit mode loads the form with input fields
displaying the specified record's field values. The form also displays Submit
and Cancel buttons.

This example creates an editable two-column form with the compact layout and
additional fields. The form is used for editing records in a Broker custom
object. The `onsubmit` attribute specifies an action to override the handler
for the submit.

```html
<lightning-record-form
        record-id={recordId}
        object-api-name="Broker__c"
        layout-type="Compact"
        fields="Name,Email__c,Phone__c,Mobile_Phone__c"
        columns="2"
        mode="edit"
        onsubmit={handleSubmit}>
</lightning-record-form>
 ```

#### Creating a Record

Use `mode="edit"` and pass in the object API name for the record to be
created. Do not specify a recordId. Specify the fields using the
`fields` attribute, or `layout-type="Full"` attribute to load all the
fields defined on the full layout.

The compact layout cannot be used for creating records. If you specify `layout-type="Compact"`,
the full layout is shown. If you specify the `fields` attribute, be sure
to include any fields that are designated as required for the object's records.

Because no recordId is passed, edit mode loads the form with input fields that
aren't populated with field data. The form displays Submit and Cancel buttons.

This example creates an editable two-column form with the full layout and
additional fields. The form is used for creating records in a Broker custom
object. The `onsubmit` attribute specifies an action to override the handler
for the submit.

```html
<lightning-record-form
        object-api-name="Broker__c"
        layout-type="Full"
        fields={newBroker}
        columns="2"
        mode="edit"
        onsubmit={handleSubmit}>
</lightning-record-form>
 ```

```javascript
import {LightningElement, api} from 'lwc';
export default class MyNewRecord extends LightningElement {

   newBroker = ['Name','Email__c','Phone__c','Mobile_Phone__c'];

    handleSubmit(event) {

        // INSERT YOUR CODE HERE
    }
}
```
#### Displaying Forms Based on a Record Type

If your org uses record types, picklist fields display values according to
your record types. You must provide a record type ID using the `record-type-id`
attribute if you have multiple record types on an object and you don't have a
default record type. Otherwise, the default record type ID is used.

To retrieve a list of record type IDs in your org, use the `getObjectInfo` wire adapter. For more information, see the [getObjectInfo documentation](docs/component-library/documentation/lwc/lwc.reference_wire_adapters_object_info).

#### Client-Side Validation

The `lightning-record-form` component performs client-side validation on record fields only if you interact with them. For example, if you edit a record that includes a required field and submit the form without interacting with that required field, you see only that an error occurred. The form does not flag the required field as incorrect.

In contrast, the `lighting-record-edit-form` component flags fields that have incorrect values even if you did not interact with the fields.


#### Overriding Default Behaviors

To customize the behavior of your form when it loads or when data is
submitted, use the `onload` and `onsubmit` attributes to specify event
handlers.

Errors are automatically handled. To customize the behavior of the form when
it encounters an error on submission or when data is submitted successfully,
use the `onerror` and `onsuccess` attributes to specify event handlers.

For examples of event handlers, see the documentation
for [`lightning-record-edit-form`](bundle/lightning-record-edit-form/documentation).


#### Custom Events

**`load`**

The event fired when the record form loads record data.

The `load` event returns the following parameters.

Parameter|Type|Description
-----|-----|----------
e.detail|Object|Record data

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call preventDefault() on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`error`**

The event fired when the record form encounters an error.

The `error` event returns the following parameters.

Parameter|Type|Description
-----|-----|----------
e.detail|Object|Error details.

 The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call preventDefault() on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`success`**

The event fired when the record form submits successfully.

The `success` event returns the following parameters.

Parameter|Type|Description
-----|-----|----------
e.detail|string|The details of the submitted record.

 The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call preventDefault() on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.

**`cancel`**

The event fired when the user cancels the form.

The `cancel` event returns no parameters.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call preventDefault() on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.


#### See Also

[`lightning-record-edit-form` Documentation](bundle/lightning-record-edit-form/documentation)

[`lightning-record-view-form` Documentation](bundle/lightning-record-view-form/documentation)

[Create a Form To Work with Records](docs/component-library/documentation/lwc/lwc.data_get_user_input)
for more information and guidance about the record components.
