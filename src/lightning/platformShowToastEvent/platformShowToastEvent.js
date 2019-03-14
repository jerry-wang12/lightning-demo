const ShowToastEventName = 'lightning__showtoast';

import { showToast } from 'lightning/platformNotificationUtils';

export class ShowToastEvent extends CustomEvent {
    constructor(toast) {
        super(ShowToastEventName, {
            composed: true,
            cancelable: true,
            bubbles: true,
        });

        showToast(toast, forceShowToastAttributes => {
            Object.defineProperties(this, {
                toastAttributes: {
                    value: forceShowToastAttributes,
                    writable: false,
                },
            });
        });
    }
}
