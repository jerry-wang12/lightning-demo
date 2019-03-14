import labelOkButton from '@salesforce/label/LightningNoticeFooter.okButton';
import { LightningElement, api } from 'lwc';

const i18n = {
    okButton: labelOkButton,
};

export default class NoticeFooter extends LightningElement {
    @api handleClickCallback;

    get buttonText() {
        return `${i18n.okButton}`;
    }

    handleButtonClick() {
        if (typeof this.handleClickCallback === 'function') {
            this.handleClickCallback.call();
        }
    }
}
