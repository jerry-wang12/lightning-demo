export function ratioToScale() {
    return 'devicePixelRatio' in window &&
        Math.round(window.devicePixelRatio) > 1
        ? 2
        : 1;
}

export function calculateSize(width, height, formFactor) {
    const display = {
        width: window.innerWidth || document.body.clientWidth || 0,
        height: window.innerHeight || document.body.clientHeight || 0,
    };

    if (width == null || width === 0) {
        if (formFactor === 'PHONE') {
            if (display.width > 30) {
                width = display.width - 30;
            } else {
                width = 300;
            }
        } else if (formFactor === 'TABLET') {
            width = display.width;
            if (width > 768) {
                width = 768;
            }
            // assume 2 columns could be used
            width = Number(width / 2).toFixed();
            if (width > 30) {
                width -= 30;
            } else {
                width = 300;
            }
        } else {
            // DESKTOP
            width = formFactor !== 'DESKTOP' ? 564 : display.width;
            if (width > 768) {
                width = 768;
            }
            // assume 2 columns could be used
            width = Number(width / 2).toFixed();
            if (width > 30) {
                width -= 30;
            } else {
                width = 360;
            }
        }
    }

    // default height to make a 16:9 aspect ratio
    if (height == null || height === 0) {
        height = Number(width * 9 / 16).toFixed();
    }

    return {
        width,
        height,
    };
}
