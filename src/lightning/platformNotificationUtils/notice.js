import { createElement } from 'lwc';
import NoticeFooter from 'lightning/noticeFooter';
import NoticeContent from 'lightning/noticeContent';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import { showCustomOverlay } from 'lightning/platformOverlayUtils';

const DEFAULT_VARIANT = 'info';

function getStringProp(obj, prop) {
    let value = obj[prop] ? obj[prop] : '';

    if (value && !(typeof value === 'string')) {
        const message = `Attribute '${prop}' should have a string value. Defaulting to ''.`;
        console.warn(message); // eslint-disable-line no-console
        value = '';
    }

    return value;
}

function getValidNotice(noticeDefinition) {
    const validDefinition = Object.assign(
        {
            header: ' ',
            title: '',
            message: '',
        },
        noticeDefinition
    );

    if (!(noticeDefinition !== null && typeof noticeDefinition === 'object')) {
        const message =
            "The notice definition should be an object, for example: { header: 'Title text', message: 'Message text' }";
        console.warn(message); // eslint-disable-line no-console
    }

    return validDefinition;
}

function getNormalizedNotice(validNoticeDefinition) {
    const normalizedDefinition = {
        header: getStringProp(validNoticeDefinition, 'header'),
        title: getStringProp(validNoticeDefinition, 'title'),
        message: getStringProp(validNoticeDefinition, 'message'),
    };

    normalizedDefinition.variant = normalize(validNoticeDefinition.variant, {
        fallbackValue: DEFAULT_VARIANT,
        validValues: ['info', 'warning', 'error'],
    });

    if (typeof validNoticeDefinition.closeCallback === 'function') {
        normalizedDefinition.closeCallback =
            validNoticeDefinition.closeCallback;
    }

    return normalizedDefinition;
}

function getModalContentAndFooter(normalizedDefinition) {
    const content = createElement('lightning-notice-content', {
        is: NoticeContent,
    });
    const footer = createElement('lightning-notice-footer', {
        is: NoticeFooter,
    });

    content.messageTitle = normalizedDefinition.title;
    content.messageBody = normalizedDefinition.message;

    return { content, footer };
}

export function showNotice(noticeDefinition, eventDispatcher) {
    const normalizedDefinition = getNormalizedNotice(
        getValidNotice(noticeDefinition)
    );
    const { content, footer } = getModalContentAndFooter(normalizedDefinition);

    return showCustomOverlay({
        modal: 'modal',
        id: 'notification-notice-panel',
        showCloseButton: false,
        modalClass: 'slds-modal_prompt',
        headerClass: `slds-modal__header slds-theme_${
            normalizedDefinition.variant
        } slds-theme_alert-texture`,
        bodyClass: 'slds-modal__content slds-p-around_medium',
        footerClass: 'slds-modal__footer slds-theme_default',
        title: normalizedDefinition.header,
        body: content,
        footer,
        closeCallback: normalizedDefinition.closeCallback,
    }).then(panel => {
        footer.handleClickCallback = () => panel.close();
    }, eventDispatcher);
}
