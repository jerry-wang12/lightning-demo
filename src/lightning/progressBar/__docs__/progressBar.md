---
examples:
 - name: basic
   label: Basic Progress Bar
   description: A progress bar can be displayed with an initial value and supports multiple sizes.
 - name: inAction
   label: Progress Bar In Action
   description: A progress bar denotes completion when it reaches 100.
 - name: variants
   label: Progress Bar with Circular Variant
   description: The circular variant adds a border radius to the progress bar to give it a rounded look.
---
A `lightning-progress-bar` component displays the progress of an operation from
left to right, such as for a file download or upload.

This component inherits styling from
[progress bars](https://www.lightningdesignsystem.com/components/progress-bar/) in the
Lightning Design System.

This example loads the progress bar when you click a Start/Stop button.

```html
<template>
    <div class="slds-p-bottom_medium">
        <lightning-button
            label={computedLabel}
            onclick={toggleProgress}>
        </lightning-button>
    </div>
    <lightning-progress-bar value={progress}>
    </lightning-progress-bar>
</template>
```

Here's the JavaScript that changes the value of the progress bar.
Specifying `this.progress === 100 ? this.resetProgress() : this.progress + 10`
increases the progress value by 10% and stops the animation when the progress
reaches 100%. The progress bar is updated every 200 milliseconds.


```javascript
import { LightningElement, track } from 'lwc';

export default class DemoComponent extends LightningElement {

    @track progress = 0;
    @track isProgressing = false;

    updateProgress() {
        this.progress = this.progress === 100 ? this.resetProgress() : this.progress + 10;
    }

    resetProgress() {
        this.progress = 0;
        clearInterval(this._interval);
    }

    disconnectedCallback() {
        clearInterval(this._interval);
    }

    get computedLabel() {
        return this.isProgressing ? 'Stop' : 'Start';
    }

    toggleProgress() {
        if (this.isProgressing) {
            // stop
            this.isProgressing = false;
            if (!this.progress) {
                this.progress = 0;
            }
            clearInterval(this._interval);
        } else {
            // start
            this.isProgressing = true;
            this._interval = setInterval(this.updateProgress.bind(this), 200);
        }
    }
}
```

