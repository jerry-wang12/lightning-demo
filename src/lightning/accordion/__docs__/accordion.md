---
examples:
 - name: basic
   label: Basic Accordion
   description: Accordion with a pre-selected open section, and a button that programmatically opens another section. By default, only one section can be open at a time. You can close a section by opening another section.
 - name: conditional
   label: Accordion with Conditional Section
   description: Accordion sections can be toggled to be visible or not.
 - name: multiple
   label: Accordion with Multiple Open Sections
   description: Accordion sections can be open or closed without restrictions, programmatically or by clicking the section headers.
---

A `lightning-accordion` component groups related content in a single container. Only one accordion section is expanded at a time.
When you select a section, it's expanded or collapsed. Each section can hold one or more Lightning components.

This component inherits styling from [accordion](https://www.lightningdesignsystem.com/components/accordion) in the Lightning Design System.

To additionally style this component, use the Lightning Design System helper classes.


This example creates a basic accordion with three sections, where section B is expanded by default.

```html
<template>
   <lightning-accordion active-section-name="B">
     <lightning-accordion-section name="A" label="Accordion Title A">This is the content area for section A</lightning-accordion-section>
     <lightning-accordion-section name="B" label="Accordion Title B">This is the content area for section B</lightning-accordion-section>
     <lightning-accordion-section name="C" label="Accordion Title C">This is the content area for section C</lightning-accordion-section>
   </lightning-accordion>
</template>
```

To find out which sections are active, use the `sectiontoggle` event.

```html
<template>
    <lightning-accordion allow-multiple-sections-open={multiple} onsectiontoggle={handleSectionToggle}>
        <!-- Your accordion sections here -->
    </lightning-accordion>
</template>
```
Use the `detail` property to return the active section names.

```javascript
import { LightningElement } from 'lwc';

export default class DemoAccordion extends LightningElement {
    multiple = true;

    handleSectionToggle(event){
        const myOpenSections = event.detail.openSections;
    }
}
```

#### Usage Considerations

The first section in the `lightning-accordion` is expanded by default. To change the default, use the `active-section-name` attribute. This attribute is case-sensitive.

If two or more sections use the same name and that name is also specified as the `active-section-name`, the first section is expanded by default.

Set the `allow-multiple-sections-open` attribute to true to allow multiple sections open at a time, with all sections closed by default.

#### Custom Events

**`sectiontoggle`**

The event fired when an accordion section is toggled.

The `sectiontoggle` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
openSections|object|The name of the active section. Returns an array if multiple sections are opened.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.
