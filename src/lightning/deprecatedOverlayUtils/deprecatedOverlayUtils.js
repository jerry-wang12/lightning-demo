import { showCustomOverlay as platformShowCustomOverlay } from 'lightning/platformOverlayUtils';
// eslint-disable-next-line lwc/no-compat-create, lwc/no-compat-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';

function wrapComponent(cmp) {
    return new Promise((resolve, reject) => {
        if (cmp instanceof HTMLElement) {
            createComponent(
                'lightning:overlayInteropWrapper',
                { domElement: cmp },
                (newComponent, status, errorMessage) => {
                    if (status === 'SUCCESS') {
                        resolve(newComponent);
                    } else {
                        const rejectMessage =
                            status === 'INCOMPLETE'
                                ? 'No response from server or client is offline.'
                                : errorMessage;
                        reject(rejectMessage);
                    }
                }
            );
        } else {
            resolve(cmp);
        }
    });
}

export function showCustomOverlay(configuration) {
    return Promise.all([
        wrapComponent(configuration.header),
        wrapComponent(configuration.body),
        wrapComponent(configuration.footer),
    ]).then(components => {
        const options = Object.assign({}, configuration);
        options.header = components[0];
        options.body = components[1];
        options.footer = components[2];
        return platformShowCustomOverlay(options, eventAttributes => {
            dispatchGlobalEvent('markup://ui:createPanel', eventAttributes);
        });
    });
}
