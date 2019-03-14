import { normalizeString as normalize } from 'lightning/utilsPrivate';

const DEFAULT_TOAST_MODE = 'dismissible';
const DEFAULT_VARIANT = 'info';
const DEFAULT_DURATION = 3000;

const WARN_MESSAGES = {
    IGNORING_MESSAGE_DATA:
        'Ignoring messageData attribute in toast definition, messageData must be an array of action links.',
    MISSING_TITLE_AND_MESSAGE:
        "Toast definition is invalid. Missing both attributes 'title' and 'message'. At least one of them must be present",
    TOAST_DEFINITION_SHOULD_BE_OBJECT:
        "The toast definition must be an object, for example: { title: 'Title text', message: 'Message text' }",
};

function setPropertyIfTruthyValue(obj, prop, propValue) {
    if (propValue) {
        obj[prop] = propValue;
    }
}

function getStringProp(obj, prop) {
    let value = obj[prop] ? obj[prop] : undefined;

    if (value && !(typeof value === 'string')) {
        console.warn(`Attribute '${prop}' must be a string value.`); // eslint-disable-line no-console
        value = undefined;
    }

    return value;
}

function getMessageData(definition) {
    const msgData = definition.messageData;
    const msgDataIsArray = Array.isArray(msgData);

    if (msgData && !msgDataIsArray) {
        console.warn(WARN_MESSAGES.IGNORING_MESSAGE_DATA); // eslint-disable-line no-console
    }

    return msgData && msgDataIsArray ? msgData : undefined;
}

function getValidToastDefinition(toastDefinition) {
    const toastDefinitionIsObject =
        toastDefinition !== null &&
        typeof toastDefinition === 'object' &&
        !Array.isArray(toastDefinition);

    if (!toastDefinitionIsObject) {
        console.warn(WARN_MESSAGES.TOAST_DEFINITION_SHOULD_BE_OBJECT); // eslint-disable-line no-console

        return null;
    }

    const title = getStringProp(toastDefinition, 'title');
    const message = getStringProp(toastDefinition, 'message');

    if (!title && !message) {
        console.warn(WARN_MESSAGES.MISSING_TITLE_AND_MESSAGE); // eslint-disable-line no-console

        return null;
    }

    return toastDefinition;
}

function getNormalizedToastDefinition(validDefinition) {
    const normalizedToastDefinition = {};
    const title = getStringProp(validDefinition, 'title');
    const message = getStringProp(validDefinition, 'message');
    const messageData = getMessageData(validDefinition);

    normalizedToastDefinition.type = normalize(validDefinition.variant, {
        fallbackValue: DEFAULT_VARIANT,
        validValues: ['info', 'success', 'warning', 'error'],
    });
    normalizedToastDefinition.mode = normalize(validDefinition.mode, {
        fallbackValue: DEFAULT_TOAST_MODE,
        validValues: ['dismissible', 'pester', 'sticky'],
    });
    normalizedToastDefinition.duration = DEFAULT_DURATION;

    setPropertyIfTruthyValue(normalizedToastDefinition, 'title', title);
    setPropertyIfTruthyValue(normalizedToastDefinition, 'message', message);
    setPropertyIfTruthyValue(
        normalizedToastDefinition,
        'messageData',
        messageData
    );

    return normalizedToastDefinition;
}

function getToastEventArgument(normalizedToastDefinition) {
    const eventArguments = {
        mode: normalizedToastDefinition.mode,
        duration: normalizedToastDefinition.duration,
        type: normalizedToastDefinition.type,
    };

    if (normalizedToastDefinition.title && normalizedToastDefinition.message) {
        eventArguments.title = normalizedToastDefinition.title;
    }

    eventArguments.message = normalizedToastDefinition.message
        ? normalizedToastDefinition.message
        : normalizedToastDefinition.title;

    if (normalizedToastDefinition.messageData) {
        eventArguments.messageTemplate = eventArguments.message;
        eventArguments.messageTemplateData =
            normalizedToastDefinition.messageData;
    }

    return eventArguments;
}

export function showToast(toastDefinition, eventDispatcher) {
    const validToastDefinition = getValidToastDefinition(toastDefinition);
    const shouldShowToast = validToastDefinition !== null;

    if (validToastDefinition !== null) {
        const normalizedToast = getNormalizedToastDefinition(
            validToastDefinition
        );

        eventDispatcher(getToastEventArgument(normalizedToast));
    }

    return shouldShowToast;
}
