A `lightning-file-upload` component provides an easy and integrated way for
users to upload multiple files. The file uploader includes drag-and-drop
functionality and filtering by file types.

This component inherits styling from
[file selector](https://www.lightningdesignsystem.com/components/file-selector) in
the Lightning Design System.

File uploads are always associated to a record, so the `record-id` attribute
is required. Uploaded files are available in Files Home under the Owned by Me
filter and on the record's Attachments related list on the record detail page.
Although all file formats that are supported by Salesforce are allowed, you
can restrict the file formats using the `accept` attribute.

This example creates a file uploader that allows multiple PDF and PNG files to
be uploaded. Change the `record-id` value to your own.

```html
<template>
    <lightning-file-upload
            label="Attach receipt"
            name="fileUploader"
            accept={acceptedFormats}
            record-id={myRecordId}
            onuploadfinished={handleUploadFinished}
            multiple>
    </lightning-file-upload>
</template>
```

You must handle the `uploadfinished` event, which is fired when the upload
is finished.

```javascript
import { LightningElement, api } from 'lwc';
export default class MyComponentName extends LightningElement {
    @api
    myRecordId;

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        alert("No. of files uploaded : " + uploadedFiles.length);
    }
}
```

#### File Upload Limits

By default, you can upload up to 10 files simultaneously. Admins can contact
Salesforce to request a change up to a maximum of 25 files uploaded at one time,
or a minimum of 3. The maximum file size you can upload is 2 GB. In Communities,
the file size limits and types allowed follow the settings determined by community
file moderation. By default, guest users can't upload files to Communities. You
can enable the org preference `Allow site guest users to upload files`.

#### Usage Considerations

This component is not supported in Lightning Out or standalone apps, and
displays as a disabled input. Additionally, if the `Don't allow HTML uploads
as attachments or document records` security setting is enabled for your
organization, the file uploader cannot be used to upload files with the
following file extensions: .htm, .html, .htt, .htx, .mhtm, .mhtml, .shtm,
.shtml, .acgi, .svg. For more information, see
[Upload and Share Files](https://help.salesforce.com/articleView?id=collab_files_upload_share.htm) in Salesforce Help.

#### Custom Events

**`uploadfinished`**

The event fired when files are uploaded successfully.

The `uploadfinished` event returns the following parameter.

Parameter|Type|Description
-----|-----|----------
files|object|The list of files that are uploaded.

`event.detail.files` returns a list of uploaded files with the attributes
`name` and `documentId`.

  * `name`: The file name in the format `filename.extension`, for example, account.jpg.
  * `documentId`: The ContentDocument Id in the format `069XXXXXXXXXXXX`.

The event properties are as follows.

Property|Value|Description
-----|-----|----------
bubbles|false|This event does not bubble.
cancelable|false|This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event.
composed|false|This event does not propagate outside the template in which it was dispatched.
