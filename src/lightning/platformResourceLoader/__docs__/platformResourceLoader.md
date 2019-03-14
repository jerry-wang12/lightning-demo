To import a third-party JavaScript or CSS library, use the `platformResourceLoader` module.

1. Download the JavaScript or CSS files from the third-party library's site.
2. Upload the library to your Salesforce organization as a static resource, which is a Lightning security requirement.
3. In a component's JavaScript file:
    * Import the static resource.
        `import myResourceName from '@salesforce/resourceUrl/myResourceName';`
    * Import methods from the `platformResourceLoader` module.
        `import { loadStyle, loadScript } from 'lightning/platformResourceLoader';`


This example shows how to use `platformResourceLoader` with the Leaflet library to create an interactive map.

```javascript
import { LightningElement } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

import leaflet from '@salesforce/resourceUrl/leaflet'

export default class MyMap extends LightningElement {
    // invoke the loaders in connectedCallback() to ensure that
    // the page loads and renders the container before the map is created

  connectedCallback() {

    Promise.all([
      loadStyle(this, leaflet + '/leaflet.css'),
      loadScript(this, leaflet + '/leaflet.js')
    ]).then(() => {

// initialize the library using a reference to the container element obtained from the DOM
      const el = this.template.querySelector('div');
      const mymap = L.map(el).setView([51.505, -0.09], 13);

// Load and display tile layers with your access token
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: 'your.mapbox.access.token'
      }).addTo(mymap);
    });
  }
}
```

#### Methods

The `platformResourceLoader` module has two methods, `loadScript` and `loadStyle`. Both methods create and return promises, which can be chained or used in parallel. You control the load sequence of your scripts or styles.

`loadScript(self, fileUrl): Promise`

Accesses a .js file in a static resource. Returns a promise that resolves when the file has loaded.
* `self` — A reference to the component. The value must be `this`.
* `fileUrl` — A string that contains the path to the JavaScript file. To build the string, concatenate the resourceName and the path to the file within the static resource archive.

`loadStyle(self, fileUrl): Promise`

Accesses a .css file in a static resource. Returns a promise that resolves when the file has loaded.
* `self` — A reference to the component. The value must be `this`.
* `fileUrl` — A string that contains the path to the CSS file. To build the string, concatenate the resourceName and the path to the file within the static resource archive.

#### See Also

[Import a Third-Party JavaScript Library](docs/component-library/documentation/lwc/lwc.create_third_party_library)
