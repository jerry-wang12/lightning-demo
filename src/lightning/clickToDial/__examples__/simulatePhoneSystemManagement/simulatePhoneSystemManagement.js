import { LightningElement } from 'lwc';
import {
    enable,
    disable,
    addDialListener,
} from '../../../clickToDialService/clickToDialService.js';

export default class LightningExampleAccordionSectionBasic extends LightningElement {
    enableClickToDial() {
        enable();
    }

    disableClickToDial() {
        disable();
    }

    onClickToDial() {
        addDialListener(payload => {
            // eslint-disable-next-line no-alert
            alert(
                'This alert simulates the onClickToDial method for Open CTI in Lightning Experience. The phone number is dialed sending the following payload: ' +
                    JSON.stringify(payload)
            );
        });
    }
}
