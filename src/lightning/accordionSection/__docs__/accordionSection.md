---
examples:
 - name: basic
   label: Basic Accordion Section
   description: Content for an accordion is an accordion-section.
---

A `lightning-accordion-section` component keeps related content in a single
container. When you select a section, it's expanded or collapsed. Each section
can hold one or more Lightning components. This component is intended to be
used with `lightning-accordion`.

This component inherits styling from
[accordion](https://www.lightningdesignsystem.com/components/accordion) in the
Lightning Design System.

To additionally style this component, use the Lightning Design System helper
classes.

This example creates a basic accordion with three sections, where section B is
expanded by default.

```html
<template>
   <lightning-accordion active-section-name="B">
     <lightning-accordion-section name="A" label="Accordion Title A">This is the content area for section A</lightning-accordion-section>
     <lightning-accordion-section name="B" label="Accordion Title B">This is the content area for section B</lightning-accordion-section>
     <lightning-accordion-section name="C" label="Accordion Title C">This is the content area for section C</lightning-accordion-section>
   </lightning-accordion>
</template>
```

This example creates the same basic accordion with an added `lightning-button-menu` on
the first section.

```html
<template>
   <lightning-accordion active-section-name="B">
     <lightning-accordion-section name="A" label="Accordion Title A">
        <lightning-button-menu slot="actions" alternative-text="Show menu" menu-alignment="right" >
                <lightning-menu-item value="New" label="Menu Item One"></lightning-menu-item>
                <lightning-menu-item value="Edit" label="Menu Item Two"></lightning-menu-item>
        </lightning-button-menu>
        <p>This is the content area for section A.</p>
     </lightning-accordion-section>
     <lightning-accordion-section name="B" label="Accordion Title B">This is the content area for section B</lightning-accordion-section>
     <lightning-accordion-section name="C" label="Accordion Title C">This is the content area for section C</lightning-accordion-section>
   </lightning-accordion>
</template>
```

#### Usage Considerations

The first section in the `lightning-accordion` is expanded by default. To
change the default, use the `active-section-name` attribute.

If two or more sections use the same name and that name is also specified as
the `active-section-name`, the first section is expanded by default.
