import { showCustomOverlay } from 'lightning/deprecatedOverlayUtils';

export function showCustomModal(options) {
    return showCustomOverlay({
        modal: 'modal',
        header: options.header,
        body: options.body,
        footer: options.footer,
        showCloseButton: options.showCloseButton,
        closeCallback: options.closeCallback,
        modalClass: options.cssClass,
    });
}
