---
examples:
 - name: basic
   label: Basic Helptext
   description: Basic default helptext example and an alternative icon example.
---
A `lightning-helptext` component displays an icon with a popover containing a
small amount of text describing an element on screen. The popover is displayed
when you hover or focus on the icon that's attached to it. On iOS devices, the
helptext popover opens when you tap on the icon and closes with a second tap
on the popover or the icon.

This component is
similar to a tooltip and is useful to display field-level help text, for
example. HTML markup is not supported in the tooltip content.

This component inherits styling from
[tooltips](https://www.lightningdesignsystem.com/components/tooltips/) in the
Lightning Design System.

By default, the tooltip uses the `utility:info` icon but you can specify a
different icon with the `icon-name` attribute. The Lightning Design
System utility icon category offers nearly 200 utility icons that can be used
in `lightning-helptext`. Although the Lightning Design System provides several
categories of icons, only the utility category can be used in
`lightning-helptext`.

Visit [utility icons](https://lightningdesignsystem.com/icons/#utility) in the
Lightning Design System to view the utility icons.

When applying Lightning Design System classes or icons, check that they are
available in the Lightning Design System release tied to your org.
The Lightning Design System site shows the latest Lightning Design System
resources, and these become available only when the new release
is available in your org.

You can use the `icon-variant` attribute to change the style of the icon to inverse, warning or error.

This example creates an icon with a tooltip.

```html
<template>
    <lightning-helptext
            content="Your email address will be your login name">
    </lightning-helptext>
</template>
```

The popover is anchored on the lower left of the icon and shown above the icon
if space is available. It automatically adjusts its position according to the
viewport.
