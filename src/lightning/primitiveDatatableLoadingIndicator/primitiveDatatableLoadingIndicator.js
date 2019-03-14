import labelLoading from '@salesforce/label/LightningDatatable.loading';
import { LightningElement } from 'lwc';

const i18n = {
    loading: labelLoading,
};

export default class LightningPrimitiveDatatableLoadingIndicator extends LightningElement {
    get i18n() {
        return i18n;
    }
}
