import { LightningElement, api } from 'lwc';

export default class NoticeContent extends LightningElement {
    @api messageTitle;
    @api messageBody;
}
