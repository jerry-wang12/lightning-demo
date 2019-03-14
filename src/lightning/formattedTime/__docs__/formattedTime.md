---
examples:
 - name: basic
   label: Formatted Time
   description: Time value displayed in the user's locale format. Include a Z suffix in the time value to indicate Universal Time.
---
A `lightning-formatted-time` component displays a read-only representation of
time in the user's locale format. A valid ISO8601 formatted time string must
be used.

An ISO8601 formatted time string matches one of the following patterns.

  * HH:mm
  * HH:mm:ss
  * HH:mm:ss.SSS
  * HH:mmZ
  * HH:mm:ssZ
  * HH:mm:ss.SSSZ

`HH` is the number of hours that have passed since midnight, and `mm` is the
number of minutes that have passed since the start of the hour, and `ss` is
the number of seconds since the start of the minute. To indicate that a time
is measured in Universal Time (UTC), append a `Z` to a time.

The following example returns `10:12:30 PM`.

```html
<template>
    <lightning-formatted-time value="22:12:30.999Z">
    </lightning-formatted-time>
</template>
```

Salesforce uses the format HH:mm:ss.SSSZ for time fields. The time field is a
timestamp without the date included. Time values in Salesforce are not
localized or associated with a time zone.

