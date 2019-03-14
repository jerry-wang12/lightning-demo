When you provide a timestamp or JavaScript Date object,
`lightning-relative-date-time` displays a string that describes the relative
time between the current time and the provided time. The relative time is formatted based on the current locale using Unicode CLDR.

The unit of time that's used corresponds to how much time has passed since the
provided time, for example, "a few seconds ago" or "5 minutes ago". A given
time in the future returns the relative time, for example, "in 7 months" or
"in 5 years".

This example returns the relative time between the current time and a given
time in the past and future.

```html
<template>
    <div>
        <lightning-relative-date-time
            value={past}>
        </lightning-relative-date-time>
    </div>
    <div>
        <lightning-relative-date-time
            value={future}>
        </lightning-relative-date-time>
    </div>
</template>
```

The `past` and `future` attributes return:

  * 2 hours ago
  * in 2 days

```javascript
import { LightningElement } from 'lwc';
export default class MyComponentName extends LightningElement {
    get past() {
        return Date.now() - (2*60*60*1000);
    }
    get future() {
        return Date.now() + (2*60*60*1000);
    }
}

```

Other sample output includes:

  * Relative past: a few seconds ago, a minute ago, 2 minutes ago, an hour ago, 2 hours ago, 2 days ago, 2 months ago, 2 years ago
  * Relative future: in a few seconds, in a minute, in 2 minutes, in an hour, in 2 hours, in 2 days, in 2 months, in 2 years in 2 days, in 2 months

The units of time are localized using the user's locale, which returns a
language code such as en-US. Supported units of time include:

  * seconds
  * minutes
  * hours
  * days
  * months
  * years
