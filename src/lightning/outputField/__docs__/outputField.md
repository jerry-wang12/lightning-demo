A `lightning-output-field` component displays the field value in the correct
format based on the field type. You must provide the record ID in the wrapper
`lightning-record-view-form` component, and specify the field name on
`lightning-output-field`. For example, if `field-name` references a date and
time value, then the default output value contains the date and time in the
user's locale. If `field-name` references an email address, phone number, or
URL, then a clickable link is displayed.

In orgs that support multiple languages, `lightning-output-field` automatically
shows the translated labels and picklist values.

This component inherits styling from
[input](https://www.lightningdesignsystem.com/components/input/) (readonly
state) in the Lightning Design System.

To create a record detail layout, wrap the fields with
`lightning-record-view-form` and provide the record ID. You don't need
additional Apex controllers or Lightning Data Service as data refresh happens
automatically.

For more information, see the [lightning-record-view-form](bundle/lightning-record-view-form/documentation) documentation.

```html
<template>
    <!-- Replace the record ID with your own -->
    <lightning-record-view-form
                record-id="001XXXXXXXXXXXXXXX"
                object-api-name="Contact">
        <div class="slds-box slds-theme_default">
            <lightning-output-field field-name="Name">
            </lightning-output-field>
            <lightning-output-field field-name="Phone">
            </lightning-output-field>
            <lightning-output-field field-name="Email">
            </lightning-output-field>
            <lightning-output-field field-name="Birthdate">
            </lightning-output-field>
            <lightning-output-field field-name="LeadSource">
            </lightning-output-field>
        </div>
    </lightning-record-view-form>
</template>
```

The user's locale settings determine the display formats for numbers,
percentages, and date and time. Locales are currently not supported for
currency. Besides field values, `lightning-output-field` displays the localized
labels and help text for the fields based on their metadata, which are defined
by your Salesforce admin. Additionally, no output label or value is rendered
if you reference an invalid field.

#### Usage Considerations

`lightning-output-field` must be a child of `lightning-record-view-form`. You can't nest it in another component like `lightning-layout` though you can nest it in a `<div>` container within `lightning-record-view-form`.

The following fields are supported.
  * Address: Displays the formatted address without a link to Google Maps.
  * Auto Number: Displays a string that represents the unique number of the record.
  * Checkbox: Displays a disabled checkbox that's either selected or not.
  * Currency: Displays the formatted currency based on the user's locale. Locales are currently not supported for currency.
  * Date: Displays the formatted date based on the user's locale.
  * Date/Time: Displays the formatted date and time based on the user's locale.
  * Email: Displays the email address prepended with the `mailto:` URL scheme.
  * Encrypted String: Displays masking characters to represent an encrypted string such as a password.
  * Formula: Displays the result of the formula based on its data type.
  * Geolocation: Displays latitude and longitude in decimal degrees format: 90.0000, 180.0000.
  * Lookup: Displays a relationship between two records, for example, the account ID associated to a contact record. Lookups render as text only. Linking and hover overlays on lookup values are not supported.
  * Name: Displays the formatted name.
  * Number: Displays the integer or double.
  * Percent: Displays the percentage number.
  * Phone: Displays the phone number prepended with the `tel:` URL scheme.
  * Picklist and multi-select picklist: Displays picklist values separated by a semi-colon.
  * Text: Displays text up to 255 characters.
  * Text (Encrypted): Displays the encrypted text.
  * Text Area: Displays multi-line text up to 255 characters.
  * Text Area (Long): Displays multi-line text up to 131,072 characters.
  * Text Area (Rich): Displays rich text such as bold or underline text, lists, and images. Unsupported tags and attributes are removed and only their text content is displayed. For more information on supported tags, see [Rich Text Editor in Salesforce Help](https://help.salesforce.com/articleView?id=fields_using_html_editor.htm).
  * URL: Displays a link that opens in the same browser window when it's clicked.

For supported objects, see the [User Interface API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_get_started_supported_objects.htm).
