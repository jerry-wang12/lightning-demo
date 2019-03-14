A `lightning-input-field` component displays an editable field based on the
field type. For example, if `field-name` references a date value, then a date
field with a date picker is rendered. If `field-name` references a picklist,
then a dropdown menu displays values based on your record types.

In orgs that support multiple languages, `lightning-input-field` automatically shows the translated labels and picklist values.

This component inherits styling from [form layout](https://www.lightningdesignsystem.com/components/form-layout/) in the
Lightning Design System.

To create a record edit layout, use this component with
`lightning-record-edit-form` and pass in a record ID and object API name.

To create a record create layout, use this component with
`lightning-record-edit-form` and pass in the object API name of the record
you're creating. You don't need additional Apex controllers or Lightning Data
Service as data refresh happens automatically.

To support error handling, include the `lightning-messages` component.

To support record edit and create, include a `lightning-button` with `type="submit"`.

You must provide a record
type ID using the `record-type-id` attribute on `lightning-record-edit-form` if
you have multiple record types on an object and you don't have a default
record type.

If a user enters anything in an input field, you can no longer programmatically set the value of the field. The assumption is that there
are unsaved changes that should not be overwritten. If you want to be able to overwrite user changes, you can use `lightning-input` instead.

Here's an example that displays a record edit layout and a record view layout
for a contact record. The record view is automatically updated when you make
edits and press the **Update record** button.

```html
<template>
    <div class="slds-p-bottom_large slds-p-left_large" style="width:500px">
        <lightning-record-edit-form
                    id="recordViewForm"
                    record-id="003R00000000000000"
                    record-type-id="012R00000000000000"
                    object-api-name="Contact">
            <lightning-messages></lightning-messages>
            <lightning-input-field field-name="FirstName">
            </lightning-input-field>
            <lightning-input-field field-name="LastName">
            </lightning-input-field>
            <lightning-input-field field-name="Birthdate">
            </lightning-input-field>
            <lightning-input-field field-name="Phone">
            </lightning-input-field>
            <!--Picklist-->
            <lightning-input-field field-name="Level__c">
            </lightning-input-field>
            <lightning-button type="submit"
                        label="Update record"
                        class="slds-m-top_medium">
            </lightning-button>
        </lightning-record-edit-form>
    </div>
        <!-- Record Display -->
    <div class="slds-p-bottom_large slds-p-left_large" style="width:500px">
        <lightning-record-view-form
                record-id="003R00000000000000"
                object-api-name="Contact">
        <div class="slds-box">
            <lightning-output-field field-name="Name">
            </lightning-output-field>
            <lightning-output-field field-name="Birthdate">
            </lightning-output-field>
            <lightning-output-field field-name="Phone">
            </lightning-output-field>
            <lightning-output-field field-name="Level__c">
            </lightning-output-field>
        </div>
        </lightning-record-view-form>
        </div>
</template>
```

For more information, see the [lightning-record-edit-form](bundle/lightning-record-edit-form/documentation) documentation.

#### Usage Considerations

`lightning-input-field` must be a child of `lightning-record-edit-form`. You can't nest it in another component like `lightning-layout` though you can nest it in a `<div>` container within `lightning-record-edit-form`.

`lightning-input-field` is supported for objects that are UI API compliant. For supported objects, see the
[User Interface API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_get_started_supported_objects.htm).

To persist requiredness on a field, select the **Required** checkbox when defining the custom field in Setup. A required field is displayed with a red asterisk next to the field label. An error message is displayed below a required field if you try to submit the form before entering a value.

The following field types are supported.

  * Address: Displays the input address fields, without Google address search capability.
  * Checkbox: Displays a checkbox input.
  * Currency: Displays an input field for entering monetary data. The user's Salesforce locale determines the currency symbol and separator characters used to format the number. Specifying a different locale is currently not supported for currency.
  * Date: Displays an input field for entering a date. The date format is automatically validated against the user's Salesforce locale format. On mobile devices, fields of type `date` use native mobile date pickers.
  * Date/Time: Displays input fields for entering a date and time. The date and time formats are automatically validated against the user's Salesforce locale format. On mobile devices, fields of type `datetime` use native mobile date and time pickers.
  * Email: Displays an input field for entering an email address. The email pattern is automatically validated.
  * Geolocation: Displays input fields for entering latitude and longitude in decimal degrees. The latitude field accepts values within -90 and 90, and the longitude field accepts values within -180 and 180.
  * Lookup: Displays an input field for creating a relationship between two objects, for example, the account associated to a contact record. The lookup type is supported in Lightning Experience only. Mobile lookups are not supported. When used in the mobile app, the lookup type is rendered as an input text field. The Owner, CreatedBy, and LastModifiedBy fields are not supported for lookups. See the Lookup Field Example below.
  * Name: Displays one or more input fields for setting the name of a record. Input fields can include a single name field or multiple fields. For example, accounts might have a single name while contacts might have a salutation, first name, and last name.
  * Number: Displays an input field for entering a number and formats it based on the user's locale.
  * Password: Displays an input field for entering a password. Characters you enter are masked.
  * Percent: Displays an input field for entering a percentage.
  * Phone: Displays an input field for entering a phone number.
  * Picklist and multi-select picklist: Displays a picklist or multi-select picklist. Dependent picklists must be defined in your org before you can use them with `lightning-input-field`. Both controlling and dependent fields must be included in your component. See the Dependent Fields Example below.
  * Text: Displays text input, accepts up to 255 characters.
  * Text (Encrypted): Displays the encrypted text input for up to 175 characters.
  * Text Area: Displays multi-line text input for up to 255 characters.
  * Text Area (Long): Displays multi-line text input for up to 131,072 characters.
  * Text Area (Rich): Displays rich text input for bold or underline text, lists, and images for up to 131,072 characters including the formatting and HTML tags. Unsupported tags and attributes are removed and only their text content is displayed. For more information on supported tags, see [Rich Text Editor in Salesforce Help](https://help.salesforce.com/articleView?id=fields_using_html_editor.htm).
  * URL: Displays a URL input field which checks for a protocol such as http:// or ftp:// .

#### Lookup Field Example

This example creates a new case using several text fields and a contact lookup field. The lookup field uses the `onchange` event handler to return the selected contact Id.

```html
<template>
 <lightning-record-edit-form object-api-name="Case" onsuccess={handleSuccess} >
  <div class="slds-m-around_medium">
   <lightning-input-field field-name='SuppliedName'></lightning-input-field>
   <lightning-input-field field-name='ContactId' onchange={handleChange}></lightning-input-field>
   <lightning-input-field field-name='Description'></lightning-input-field>
   <div class="slds-m-top_medium">
    <lightning-button variant="brand" type="submit" name="save" label="Create Case"></lightning-button>
   </div>
  </div>
 </lightning-record-edit-form>
</template>
```

Use the `event.detail.value` property to retrieve the Id of the selected contact record on the lookup field. Although the Id is returned in an array, multiselect lookups are currently not supported. This example also uses the `success` event to return the saved record. For more information on the `success` event, see the [lightning-record-edit-form](bundle/lightning-record-edit-form/documentation) documentation.

```javascript
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LookupExample extends LightningElement {

    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: event.detail.apiName + ' created.',
                variant: 'success',
            }),
        );
    }

    handleChange(event) {
        console.log("You selected an account: " + event.detail.value[0]);
    }

}
```

#### Dependent Fields Example

This example uses `LeadSource` as the controlling field and `Level__c` as the
dependent field for a dependent picklist.
```html
<template>
    <lightning-record-edit-form
                id="recordViewForm"
                record-id="003R00000000000000"
                record-type-id="012R00000000000000"
                object-api-name="Contact">
        <lightning-messages></lightning-messages>
        <!--Other fields here-->
        <lightning-input-field field-name="LeadSource">
        </lightning-input-field>
        <lightning-input-field field-name="Level__c">
        </lightning-input-field>
        <lightning-button id="submit"
                          type="submit"
                          label="Update record"
                          class="slds-m-top_medium">
        </lightning-button>
    </lightning-record-edit-form>
</template>
```

For more information, see
[Define Dependent Picklists](https://help.salesforce.com/articleView?id=fields_defining_field_dependencies.htm) in Salesforce
Help.

