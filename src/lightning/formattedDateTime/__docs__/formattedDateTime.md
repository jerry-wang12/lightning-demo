---
examples:
 - name: date
   label: Date Formatting
   description: Several ways to display formatted dates.
 - name: time
   label: Time Formatting
   description: Various ways to format time.
 - name: datetime
   label: Date and Time Formatting
   description: Use a combination of the year, month, day, hour, and minute attributes, among others, to customize date and time.
---
A `lightning-formatted-date-time` component displays formatted date and time.
This component uses the Intl.DateTimeFormat JavaScript object to format date
values. The locale set in the Salesforce user preferences determines the
default formatting. The following input values are supported.

  * Date object
  * ISO8601 formatted string
  * Timestamp

An ISO8601 formatted string matches one of the following patterns.

  * YYYY
  * YYYY-MM
  * YYYY-MM-DD
  * YYYY-MM-DDThh:mmTZD
  * YYYY-MM-DDThh:mm:ssTZD
  * YYYY-MM-DDThh:mm:ss.sTZD

`YYYY` is the year in the Gregorian calendar, `MM` is the month between 01 and
12, and `DD` is the day between 01 and 31. `hh` is the number of hours that
have passed since midnight, `mm` is the number of minutes that have passed
since the start of the hour, and `ss` is the number of seconds since the start
of the minute.

`TZD` is the time zone designator, like `Z`, `+hh:mm` or `-hh:mm`. To indicate
that a time is measured in Universal Time (UTC), append a `Z` to a time.

Specify optional attributes to modify the date and time display. When no attributes other than `value`
are specified, the component uses the default date format based on the user's locale in Salesforce.
If running outside a Salesforce org, the component defaults to ISO8601 formatting.

The `time-zone-name` attribute specifies how to display the time zone. Set it to `short` to display
a code such as EST, or `long` to display a description such as Eastern Standard Time.

The `time-zone` attribute sets a particular time zone to use to display the date and time. Specify a
time zone listed in the [IANA Time Zone Database](https://www.iana.org/time-zones), such as
`America/New_York`, `Europe/London`, or `Asia/Tokyo`. You cannot use a time zone short code such as
EST to set the `time-zone` attribute. You can use UTC however, as it's the only short code that browsers
must recognize.

Here are some examples based on a locale of en_US.

Displays: 1/11/2019
```html
<template>
     <lightning-formatted-date-time value="1547250828000">
    </lightning-formatted-date-time>
</template>
```

Displays: Friday, Jan 11, 19
```html
<template>
     <lightning-formatted-date-time
                    value="1547250828000"
                    year="2-digit"
                    month="short"
                    day="2-digit"
                    weekday="long">
    </lightning-formatted-date-time>
</template>
```

Displays: 1/11/2019, 3:53 PM PST (if user is in PST time zone)
```html
<template>
     <lightning-formatted-date-time
                    value="1547250828000"
                    year="numeric"
                    month="numeric"
                    day="numeric"
                    hour="2-digit"
                    minute="2-digit"
                    time-zone-name="short">
    </lightning-formatted-date-time>
</template>
```

Displays: 1/11/2019, 6:53 PM EST
```html
<template>
     <lightning-formatted-date-time
                    value="1547250828000"
                    year="numeric"
                    month="numeric"
                    day="numeric"
                    hour="2-digit"
                    minute="2-digit"
                    time-zone-name="short"
                    time-zone="America/New_York">
    </lightning-formatted-date-time>
</template>
```

Salesforce uses the format YYYY-MM-DD to store date fields, and includes no time zone information.

Salesforce uses the format YYYY-MM-DDThh:mm:ss.SZ for date/time fields, which stores date/time in UTC.

When you display Salesforce dates, specify `time-zone="UTC"`. Otherwise the date is parsed and displayed in
local time and could be off by one day.

Assuming a user is in the en_US locale and Pacific time zone, here are two examples for a date field with
the value `1965-04-09`. The time zone is set to UTC to ensure an accurate date.

Displays: 4/9/1965

```html
<template>
     <lightning-formatted-date-time
                    value={contact.Birthdate}
                    time-zone="UTC">
    </lightning-formatted-date-time>
</template>
```


Displays: April 09, 1965
```html
<template>
     <lightning-formatted-date-time
                    value={contact.Birthdate}
                    year="numeric"
                    day="2-digit"
                    month="long"
                    time-zone="UTC">
    </lightning-formatted-date-time>
</template>
```

Assuming an en_US locale and a Pacific time zone,
here's an example for a date/time field with the value
`2017-12-03T20:00:00.000+00:00`.

Displays: December 03, 2017, 12:00 PM
```html
<template>
     <lightning-formatted-date-time
                    value={contact.Next_Meeting__c}
                    year="numeric"
                    day="2-digit"
                    month="long"
                    hour="2-digit"
                    minute="2-digit">
    </lightning-formatted-date-time>
</template>
```
