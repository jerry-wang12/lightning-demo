import { LightningElement } from 'lwc';

export default class FileUploadFileUploader extends LightningElement {
    accept = ['.jpg', '.jpeg'];
    multiple = true;
    disabled = false;

    handleUploadFinished(event) {
        // This will contain the List of File uploaded data and status
        const uploadedFiles = event.detail.files;
        alert('Files uploaded : ' + uploadedFiles.length); // eslint-disable-line no-alert
    }
}
