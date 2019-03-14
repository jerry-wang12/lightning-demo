---
examples:
 - name: basic
   label: Formatted Location
   description: Displays a geolocation in the Decimal degrees (DD) format [latitude, longitude]. Only latitudes within the range of [-90.0, 90.0] and longitudes within the range of [-180.0, 180.0] are allowed.
---
A `lightning-formatted-location` component displays a read-only representation
of a latitude and longitude value. Latitude and longitude are geographic
coordinates specified in decimal degrees. If one of the values is invalid or
outside the allowed range, this component doesn't display anything.

Here are a few examples of latitudes: -30, 45, 37.12345678, -10.0. Values such
as 90.5 or -90.5 are not valid latitudes. Here are a few examples of
longitudes: -100, -120.9762, 115.84. Values such as 180.5 or -180.5 are not
valid longitudes.

This example displays a geolocation with a latitude of 37.7938460 and a
longitude of -122.3948370.

```html
<template>
    <lightning-formatted-location
            latitude="37.7938460"
            longitude="-122.3948370">
    </lightning-formatted-location>
</template>
```
