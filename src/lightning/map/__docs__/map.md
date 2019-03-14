---
examples:
 - name: singleMarker
   label: Map with a Single Marker
   description: A map can display a single marker with default centering and zoom.
 - name: multipleMarkers
   label: Map with Multiple Markers
   description: A map with multiple markers includes the list of locations next to the map.
 - name: complexExample
   label: Map with Manual Centering and Zoom
   description: A map can include custom configurations such as optional icons, and manual centering and zoom.
---
A `lightning-map` component displays a map of one or more locations.

This component inherits styling from [map](https://www.lightningdesignsystem.com/components/map/) in the
Lightning Design System.

Pass the location to be displayed via the component's `map-markers` property.

For example:

```
<template>
    <lightning-map
	    map-markers={mapMarkers}>
    </lightning-map>
</template>
```

`map-markers` is an array of markers that indicate location.
A marker contains
- Location Information: This can be a coordinate pair of latitude and longitude, or an address composed of address elements.
- Descriptive Information: This is information like title, description and an icon which is information relevant to the marker but not specifically related to location.

#### Marker Properties

Use the following marker properties to customize the map display.

Property|Type|Description
-----|-----|-----
location|object|Address elements (City, Country, PostalCode, State, and Street) or a set of latitude and longitude coordinates. If you specify address elements and coordinates for one location, the map uses the coordinates. To support reliable geocoding of addresses, if you specify Street, you must also specify at least one of City, Country, PostalCode or State.
title|string|The heading displayed in the info window that's shown when you click a marker.
description|string|The information displayed in the info window that's shown when you click a marker.
icon|string|The icon that's displayed next to the location title and address. Only Lightning Design System icons are supported. Custom marker icons are currently not supported. The default is standard:location. For more information, see Displaying Multiple Addresses.


#### Displaying a Single Marker

Here's an example of a marker that uses address elements.

```
mapMarkers = [{
    location: {
        'City': 'San Francisco',
        'Country': 'USA',
        'PostalCode': '94105',
        'State': 'CA',
        'Street': 'The Landmark @ One Market, Suite 300'
    },
    title: 'The Landmark Building',
    description: 'The Landmark is considered to be one of the city's most architecturally distinct and historic properties',
    icon: 'standard:account'
}]
```

Here's an example of a marker that uses coordinates for latitude and longitude.

```
mapMarkers = [{
    location: {
        'Latitude': '37.790197',
        'Longitude': '-122.396879'
    }
}]
```
For each map marker in the array of map markers, provide either latitude and longitude coordinates or address elements. If you specify both in a single marker, latitude and longitude gets precedence.

#### Displaying Multiple Addresses

When displaying a list of addresses, you must pass in the `markers-title` property, which displays a heading for your locations. Optional properties are discussed below.

```
<lightning-map
	map-markers={mapMarkers}
	markers-title="My favorite places for lunch">
</lightning-map>
```

When you specify multiple markers in an array, the `lightning-map` component renders a list of tiles with location titles and addresses next to the map with the required `markers-title` displayed above the list. Each location tile contains an icon, a title, and an address.

To customize each location tile, you can specify the optional `icon`, `title`, and `description` properties. The `lightning-map` component displays the icon next to the address. The description is displayed in an info window when the user clicks the marker.

```
mapMarkers = [
    {
        location: {
            // Location Information
            City: 'San Francisco',
            Country: 'USA',
            PostalCode: '94105',
            State: 'CA',
            Street: '50 Fremont St',
        },

        // Extra info for tile in sidebar & infoWindow
        icon: 'standard:account',
        title: 'Julies Kitchen', // e.g. Account.Name
        description: 'This is a long description'
    },
    {
        location: {
            // Location Information
            City: 'San Francisco',
            Country: 'USA',
            PostalCode: '94105',
            State: 'CA',
            Street: '30 Fremont St.',
        },

        // Extra info for tile in sidebar
        icon: 'standard:account',
        title: 'Tender Greens', // e.g. Account.Name
    }
]
```

#### Usage Considerations

All latitude and longitude values must be valid. If you pass in an invalid latitude or longitude, the markers are not plotted on the map. Latitude values fall within -90 and 90, and longitude values fall within -180 and 180.
Additionally, consider the following:
* If you specify an address, you must provide at least one of the following values: City, PostalCode, State or Country.
* If you pass in both an address and a latitude and longitude, the map plots the marker according to the latitude and longitude values.
* If a marker in the `map-markers` array is invalid, no markers are plotted on the map.


