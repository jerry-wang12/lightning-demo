---
examples:
 - name: basic
   label: Basic Avatar
   description: Avatar with the default size and variant.
 - name: sizes
   label: Avatar Sizes
   description: Avatars of different sizes. The default size is medium.
 - name: variant
   label: Avatar Variants
   description: Avatars support circle and square variants. The default variant is square.
 - name: initials
   label: Avatar Initials
   description: Avatars can display initials if the image fails to load.
 - name: icons
   label: Avatar Icons
   description: Avatars can display fallback icons if the image fails to load and initials are not provided.
---
A `lightning-avatar` component is an image that represents an object, such as
an account or user. By default, the image renders in medium sizing with a
rounded rectangle, which is also known as the `square` variant.

This component inherits styling from
[avatars](https://www.lightningdesignsystem.com/components/avatar/) in the
Lightning Design System.

Use the `class` attribute to apply additional styling.

Here is a basic avatar example.

```html
    <lightning-avatar src="/images/codey.jpg"
                      alternative-text="Codey Bear">
    </lightning-avatar>
```

To use an image in your org as an avatar, upload the image as a static resource in the Static
Resources setup page. Use the `{!$Resource.logo}"` syntax in your `src`
attribute, where `logo` is the name you provided in the `Name` field on the
setup page.

#### Handling Invalid Image Paths

The `src` attribute resolves the relative path to an image, but sometimes the
image path doesn't resolve correctly because the user is offline or the image
has been deleted. To handle an invalid image path, you can provide fallback
initials using the `initials` attribute or a fallback icon with the `fallback-icon-name`
attribute. These attributes work together if both are specified.

If initials and fallback icon name are provided, the initials are displayed and the
background color of the fallback icon is used as the background color for the initials.
The fallback icon is displayed only when the image path is invalid and initials are
not provided.

This example displays the initials "Sa" if the image path is invalid. The fallback icon
 "standard:account" provides the background color for the initials. The icon is one of the
 [standard icons](https://www.lightningdesignsystem.com/icons/#standard)
in Lightning Design System.

```html
<template>
    <lightning-avatar src="/bad/image/url.jpg"
              initials="Sa"
              fallback-icon-name="standard:account"
              alternative-text="Salesforce">
    </lightning-avatar>
</template>
```

When applying Lightning Design System classes or icons, check that they are
available in the Lightning Design System release tied to your org. The latest
Lightning Design System resources become available only when the new release
is available in your org.

#### Accessibility

Use the `alternative-text` attribute to describe the avatar, such as a user's
initials or name. This description provides the value for the `alt` attribute
in the `img` HTML tag.
