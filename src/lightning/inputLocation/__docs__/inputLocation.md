---
examples:
 - name: base
   label: Basic Geolocation Fields
   description: Geolocation fields include a latitude and longitude field.
 - name: defaultValues
   label: Default Coordinates
   description: Geolocation fields can include predefined coordinates.
 - name: required
   label: Required Geolocation Fields
   description: When geolocation fields are marked as required, a field-level error is thrown if you don't enter a latitude or longitude.
 - name: disabled
   label: Disabled Geolocation Fields
   description: Disabled geolocation fields are grayed out and you cannot interact with them.
 - name: readOnly
   label: Read-Only Geolocation Fields
   description: Read-only geolocation fields are not editable.
 - name: fieldLevelHelp
   label: Geolocation Fields with Field-Level Help
   description: Field-level help guides users with information about the geolocation fields.
---

A `lightning-input-location` component represents a geolocation compound field
that accepts user input for a latitude and longitude value. Latitude and
longitude are geographic coordinates specified in decimal degrees. The
geolocation compound field allows you to identify locations by their latitude
and longitude. The latitude field accepts values within -90 and 90, and the
longitude field accepts values within -180 and 180. An error message is
displayed when you enter a value outside of the accepted range.

Here are a few examples of latitudes: -30, 45, 37.12345678, -10.0. Values such
as 90.5 or -90.5 are not valid latitudes.

Here are a few examples of
longitudes: -100, -120.9762, 115.84. Values such as 180.5 or -180.5 are not
valid longitudes.

This example displays a geolocation compound field with a latitude of
37.7938460 and a longitude of -122.3948370.

```html
<template>
        <lightning-input-location
                label="My Coordinates"
                latitude="37.7938460"
                longitude="-122.3948370">
        </lightning-input-location>
</template>
```
#### Input Validation

Client-side input validation is available for this component. You can require
the user to make a selection by including the `required` attribute. An error message
is automatically displayed when an item is not selected.

To check the validity states of an input, use the `validity` attribute, which
is based on the `ValidityState` object. You can access the validity states in
your JavaScript. This `validity` attribute returns an object with
`boolean` properties. For more information, see the
[`lightning-input`](bundle/lightning-input/documentation) documentation.


#### Custom Events

**`change`**

The event fired when a value is changed in the `lightning-input-location` component.

The `change` event returns the following parameters.

Parameter|Type|Description
-----|-----|----------
latitude|string|The latitude of the location.
longitude|string|The longitude of the location.


The `change` event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|true|This event bubbles up through the DOM.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|true|This event propagates outside of the component in which it was dispatched.
