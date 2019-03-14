---
examples:
 - name: basic
   label: Basic Progress Indicator
   description: A progress indicator shows the current step in a process and any previous or later steps.
 - name: pathType
   label: Path Type
   description: The path type displays with a different visual styling than the basic progress indicator.
 - name: pathTypeWithIteration
   label: Path Type with Iteration
   description: Steps can be created from a data source using iteration.
 - name: pathTypeWithIfCondition
   label: Path Type with If Condition
   description: Steps can be displayed conditionally.
---
A `lightning-progress-indicator` component displays a horizontal list of steps
in a process, indicating the number of steps in a given process, the current
step, as well as prior steps completed. For example, Sales Path uses a
progress indicator to guide sales reps through the stages of the sales
process.

You can create progress indicators with different visual styling by specifying
the `type` attribute. Set `type="base"` to create a component that inherits
styling from
[progress indicators](https://www.lightningdesignsystem.com/components/progress-indicator/)
in the Lightning Design System. Set `type="path"` to create a
component that inherits styling from
[path](https://www.lightningdesignsystem.com/components/path/) in the
Lightning Design System.

If the type is not specified, the default type (base) is used. To create
steps, use one or more `lightning-progress-step` component along with `label`
and `value` attributes. To specify the current step, the `current-step`
attribute must match one of the `value` attributes on a
`lightning-progress-step` component.

```html
<template>
    <lightning-progress-indicator current-step="step2">
        <lightning-progress-step label="Step One" value="step1">
        </lightning-progress-step>
        <lightning-progress-step label="Step Two" value="step2">
        </lightning-progress-step>
        <lightning-progress-step label="Step Three" value="step3">
        </lightning-progress-step>
    </lightning-progress-indicator>
</template>
```

In the previous example, the `label` is displayed in a tooltip when you hover
over the step. If the progress indicator type is `path`, the label is
displayed on hover if the step is completed or on the step itself if it's a
current or incomplete step.

This example creates a path showing the current step at "Step Two". "Step One"
is marked completed and "Step Three" is not yet completed.

```html
<template>
    <lightning-progress-indicator type="path" current-step="step2">
        <lightning-progress-step label="Step One" value="step1">
        </lightning-progress-step>
        <lightning-progress-step label="Step Two" value="step2">
        </lightning-progress-step>
        <lightning-progress-step label="Step Three" value="step3">
        </lightning-progress-step>
    </lightning-progress-indicator>
</template>
```

#### Events

The `lightning-progress-step` component supports these events.

Events|Payload|Description
-----|-----|-----
onstepblur|index|The index of the step that released focus. This event applies to the `base` type only.
onstepfocus|index|The index of the step that received focus. This event applies to the `base` type only.
onstepmouseenter|index|The index of the step for which the mouse pointer is moved onto. This event applies to the `base` type only.
onstepmouseleave|index|The index of the step for which the mouse pointer is moved out of. This event applies to the `base` type only.

For example, to see the index of the step that released focus:

```javascript

    import { LightningElement } from 'lwc';

    export default class MyDemoComponent extends LightningElement {

    handleStepBlur(event) {
        const stepIndex = event.detail.index;
    }

}
```

#### Accessibility

Each progress step is decorated with assistive text, which is also the label
of that step. For the base type, you can use the Tab key to navigate from one
step to the next. Press Shift+Tab to go to the previous step. For the path
type, press Tab to activate the current step and use the Up and Down Arrow key
or the Left and Right arrow key to navigate from one step to another.
