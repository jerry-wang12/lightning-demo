---
examples:
 - name: basic
   label: Basic Carousel
   description: A basic carousel with three images. Auto scrolling is enabled by default, and every image stays active for 5 seconds before moving on to the next one.
 - name: autoScroll
   label: Carousel without Auto Scroll
   description: A carousel with three images, with auto scrolling disabled by specifying the disable-auto-scroll attribute.
---
A `lightning-carousel` component displays a series of images in a single
container. Only one image is displayed at a time, and you can select other
images by clicking the carousel indicators.

The carousel auto scrolls by
default and loops through the images repeatedly. A button on the lower left
enables you to pause and restart the automatic scrolling. Disable auto scrolling
by including the `disable-auto-scroll` attribute in the `lightning-carousel` tag.
Disable continuous looping by including the `disable-auto-refresh` attribute.

Use `lightning-carousel-image` components to specify up to five images.

The following attributes are supported for `lightning-carousel-image`.

Attribute|Type|Description
-----|-----|-----
src|string|The path to the image.
header|string|Text for the label that's displayed under the image.
description|string|Text displayed under the header.
alternative-text|string|Assistive text for the image.
href|string|A URL to create a link for the image. Clicking the image opens the link in the same frame.

This component inherits styling from
[carousel](https://www.lightningdesignsystem.com/components/carousel) in the
Lightning Design System.

To implement additional styling for the `lightning-carousel` component, use the Lightning Design
System helper classes.

This example creates a basic carousel with three images.

```html
<template>
    <lightning-carousel disable-auto-scroll>
        <lightning-carousel-image
            src = "path/to/carousel-01.jpg"
            header = "First card"
            description = "First card description"
            alternative-text = "This is a card"
            href = "https://www.salesforce.com">
        </lightning-carousel-image>
        <lightning-carousel-image
            src = "path/to/carousel-02.jpg"
            header = "Second card"
            description = "Second card description"
            alternative-text = "This is a card"
            href = "https://www.salesforce.com">
        </lightning-carousel-image>
        <lightning-carousel-image
            src = "path/to/carousel-03.jpg"
            header = "Third card"
            description = "Third card description"
            alternative-text = "This is a card"
            href = "https://www.salesforce.com">
        </lightning-carousel-image>
    </lightning-carousel>
</template>
```

#### Usage Considerations

Icons are not available in Lightning Out, but they are available in Lightning Components for Visualforce and other experiences.

The first image in the `lightning-carousel` is displayed by default. To use an
image in your org, upload it as a static resource in the Static Resources
setup page. Use the `{!$Resource.image}"` syntax in your `src` attribute,
where `image` is the name you provided in the `Name` field on the setup page.
If the image path is invalid or the image does not load because the user is
offline or another reason, the description and alternative text are shown in
place of the image.


