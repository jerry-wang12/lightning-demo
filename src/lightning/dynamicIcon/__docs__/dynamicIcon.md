---
examples:
 - name: ellie
   label: Ellie Icon
   description: Displays a pulsing blue circle, which pulses and stops after one animation cycle.
 - name: eq
   label: EQ Icon
   description: Displays an animated graph with three bars that rise and fall randomly.
 - name: score
   label: Score Icon
   description: Displays a green filled circle or a red unfilled circle.
 - name: strength
   label: Strength Icon
   description: Displays three animated horizontal circles that are colored green or red.
 - name: trend
   label: Trend Icon
   description: Displays animated arrows that point up, down, or straight.
 - name: waffle
   label: Waffle Icon
   description: Displays a 3x3 grid of dots that animates on hover.
---
A `lightning-dynamic-icon` component visually indicates an event that's in
progress, such as a graph that's loading.

This component inherits styling from
[dynamic icons](https://www.lightningdesignsystem.com/components/dynamic-icons/) in the
Lightning Design System.

Here's an example of an ellie icon with alternative text.

```html
<template>
    <lightning-dynamic-icon
                type="ellie"
                alternative-text="Your calculation is running.">
    </lightning-dynamic-icon>
</template>
```

#### Usage Considerations

The following `type` options are available.

  * Use the `type="ellie"` attribute to show a pulsing blue circle, which pulses and stops after one animation cycle. This icon is great for field calculations or a process that's running in the background.
  * Use the `type="eq"` attribute to show an animated graph with three bars that rise and fall randomly. This icon is great for a graph that's refreshing.
  * Use the `type="score"` attribute to show a green filled circle or a red unfilled circle. This icon is great for showing positive and negative indicators.
  * Use the `type="strength"` attribute to show three animated horizontal circles that are colored green or red. This icon is great for Einstein calculations or indicating password strengths.
  * Use the `type="trend"` attribute to show animated arrows that point up, down, or straight. This icon is great for showing movement of a value from one range to another, like a forecast score.
  * Use the `type="waffle"` attribute to show a square made up of a 3x3 grid of circles. This icon animates on hover. This icon is great for app-related items, like the App Launcher in Lightning Experience.

#### Accessibility

Optionally, you can use the `alternative-text` attribute to describe the
`lightning-dynamic-icon`.

Sometimes a `lightning-dynamic-icon` is decorative and doesn't need a description.
However, on smaller screens and windows the `lightning-dynamic-icon` can also be
informational. In this case, include `alternative-text`. If you don't include
`alternative-text`, check smaller screens and windows to ensure that the
`lightning-dynamic-icon` is only decorative on all formats.
