# Map

```HTML
<lightning-map
    map-markers={mapMarkers}
</lightning-map>
```

## Summary

 * A map component is used to find a location
 * Map component has dependency on core and further details in Implementation section. Also see [Spec](https://salesforce.quip.com/ye8QA639Ookq) for technical details.

## Prior Art

 * [SLDS mockups](https://latest-214.lightningdesignsystem.com/components/map/)
 * [Map Component Definition](https://quip.com/smd2ArGaIkPb)

## Markup

 * This component is based on the markup defined in SLDS:
http://www.lightningdesignsystem.com/components/map/

## Usage

```html
<lightning-map
    map-markers = [ marker1[, marker2[, ...markerN]],]
    center = marker
    zoom-level = zoomValue
    show-footer = true | false ></lightning-map>
```

#### Parameters

_marker_
 * { 
    location: { Latitude, Longitude } | { Street, PostalCode, City, State, Country },
    title, description, icon
   }
 If Street is specified, at least one of PostalCode, City, State or Country must be specified.

_zoomValue_
 * Corresponds to Google Maps zoom levels. Currently 0 (whole world) - 22 (maximum zoom) but subject to change. Also varies based on map viewport.

## Implementation Details

lightning-map does not make the call directly to Google Maps due to security concerns. Due to this it has a dependency on core. The following parts have been added to fulfil this security dependency:

#### Servlet

In core a servlet exists `LightningMapsServlet` that serves static assets.
This servlet is unauthenticated to permit map to work in off-core scenarios.

#### Core Application Initializer

The servlet is served from random subdomain of untrusted content domain.
To find the random part we calculate guid when the component is initialized.
To find the untrusted domain, we added a config provider in core `CoreInfoModelFactory`. This config provider is generic for any core related information that any future lwc component might require. Currently we are exposing the following info for map:
 * Untrusted Content Domain - This value is defined in `path.xml` as `untrustedContentDomain`. It is the endpoint from which assets are served that does not expose any personally identifiable information (PII) about the org, user or entity.
 * Localhost Port - This is the http port that the appserver is listening on.
The initializer takes a list of applications for which it is loaded. Currently it only supports one.app but we have requested support for custom apps too.

#### Initializer fallback

When map is running outside one.app or standalone, values from initializer are not available. In that case we have defined fallback values in `config-provider.js`. All such requests will redirect to na1 or any appserver we choose.

#### Container

`container.html` is defined in core and served by the servlet.
It references `primitive-map` in an iframe via the servlet again.
Container is a forwarding proxy. It receives JS objects via window.postMessage() and forwards these objects as-is to `primitive-map`.

#### Primitive Map

`primitive-map.html` is defined in core and served by the servlet. It is requested by container.
Primitive map validates the requestor domain to ensure itself and container are served from same domain.
It fetches the script from Google Maps and initializes the map. Once initialized it starts listening for incoming postMessage objects. Supported incoming objects are array of markers, center and zoom.
Incoming objects are validated and then passed to the map.
Google Maps JS API accepts only Lat,Lng pairs. So markers and center are geocoded if address components are provided.
If center is not specified it assumes center as geographic midpoint of provided markers.
If zoom level is not specified it calculates an appropriate zoom so all markers are visible on map.
