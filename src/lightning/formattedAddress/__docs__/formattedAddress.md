A `lightning-formatted-address` component displays formatted addresses in a
given format and order. The locale set in the app's user preferences
determines how addresses are formatted and the order they are presented. A
valid address that includes the street, city, country, province, and postal
code must be used.

This example displays an address.

```html
<template>
     <lightning-formatted-address
            street="1 Market St."
            city="San Francisco"
            country="US"
            province="CA"
            postal-code="94105">
    </lightning-formatted-address>
</template>
```

The output looks like this. By default, the address is displayed as a link,
which takes you to the given location on Google Maps in a new tab.

1 Market St.\
San Francisco, CA 94105\
US

If the latitude and longitude are provided, the address is displayed as the
link label, and the link directs you to the given location provided by the
latitude and longitude on Google Maps. The link follows the format `https://www.google.com/maps/?q=your+address`.

#### Showing a Static Map

Use the `show-static-map` attribute to display a map with your address.

```html
<template>
     <lightning-formatted-address
            street="1 Market St."
            city="San Francisco"
            country="US"
            province="CA"
            postal-code="94105"
            show-static-map>
    </lightning-formatted-address>
</template>
```


