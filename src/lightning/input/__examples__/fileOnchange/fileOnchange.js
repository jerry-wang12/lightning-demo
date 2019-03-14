import { LightningElement, track } from 'lwc';

export default class InputFileOnChange extends LightningElement {
    @track filesCount = 0;
    @track filesList = [];

    handleFilesChange(event) {
        const filesList = event.detail.files;
        this.filesCount = filesList.length;
        this.filesList = filesList;
    }
}
