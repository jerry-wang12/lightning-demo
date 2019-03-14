export const isObjectLike = function(value) {
    return typeof value === 'object' && value !== null;
};

const proto = {
    add(className) {
        if (typeof className === 'string') {
            this[className] = true;
        } else {
            Object.assign(this, className);
        }
        return this;
    },
    invert() {
        Object.keys(this).forEach(key => {
            this[key] = !this[key];
        });
        return this;
    },
    toString() {
        return Object.keys(this)
            .filter(key => this[key])
            .join(' ');
    },
};

export const classSet = function(config) {
    if (typeof config === 'string') {
        const key = config;
        config = {};
        config[key] = true;
    }
    return Object.assign(Object.create(proto), config);
};

export const isPositiveInteger = function(value) {
    return /^\d+$/.test(value);
};

export const clamp = function(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
};

export function normalizePositiveIntegerAttribute(attrName, value, fallback) {
    if (isPositiveInteger(value)) {
        return parseInt(value, 10);
    }
    // eslint-disable-next-line no-console
    console.warn(
        `The attribute "${attrName}" value passed in is incorrect.
            "${attrName}" value should be an integer >= 0.`
    );
    return fallback;
}
