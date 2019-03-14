---
examples:
 - name: basic
   label: Basic Icons
   description: Action icons, doctype icons, standard icons, and utility icons. You can change the icon size by setting the size attribute.
 - name: variants
   label: Icons with Variants
   description: Effects of the inverse, warning, and error variants.
 - name: custom
   label: Custom Icons
   description: Load custom icons from an external resource by specifying the src attribute.
---
A `lightning-icon` is a visual element that provides context and enhances
usability. Icons can be used inside the body of another component or on their
own.

Visit [icons](https://lightningdesignsystem.com/icons) to view the available icons.

When applying Lightning Design System classes or icons, check that they are
available in the Lightning Design System release tied to your org. The latest
Lightning Design System resources become available only when the new release
is available in your org.

Here is an example.
```html
<template>
    <lightning-icon
            icon-name="action:approval"
            size="large"
            alternative-text="Indicates approval">
    </lightning-icon>
</template>
```

Use the `variant`, `size`, or `class` attributes to customize the styling. The
`variant` attribute changes the appearance of a utility icon. For example, the
`error` variant adds a red fill to the error utility icon.

```html
<template>
    <lightning-icon icon-name="utility:error" variant="error">
    </lightning-icon>
</template>
```

If you want to make additional changes to the color or styling of an icon, use
the `class` attribute. For example, you can set `class="slds-m-vertical_large"` or other
[margin](https://lightningdesignsystem.com/utilities/margin/) classes to add
spacing around the icon.

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

#### Accessibility

Use the `alternative-text` attribute to describe the icon. The description
should indicate what happens when you click the button, for example 'Upload
File', not what the icon looks like, 'Paperclip'.

Sometimes an icon is decorative and does not need a description. But icons can
switch between being decorative or informational based on the screen size. If
you choose not to include an `alternative-text` description, check smaller
screens and windows to ensure that the icon is decorative on all formats.

#### Using Custom Icons

Use the `src` attribute to specify the path of the resource for the custom
icon. When this attribute is present, `lightning-icon` attempts to load an
icon from the provided resource.

Here's an example:

 ```html
<lightning-icon src="path/to/customSvgSprite.svg#my-icon">
</lightning-icon>
```

Note that all the icons have a default css fill attribute value `##fff`, which
you can override with your svg sprite directly or via css.

For IE11, this feature is disabled for now due to performance issues.

