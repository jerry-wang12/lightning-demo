export class DependencyManager {
    _fieldValues = {}; // map of fieldName -> {fieldElement, controllerName}
    _dependencyMap = {}; // map of controllerFieldName -> [dependentFieldNames]
    _picklistMap = {}; // map of picklist fieldName -> picklistValues
    _optionsCache = {}; // cache of picklist options, fieldName-controllerValue -> picklistOptions

    constructor(dependencyInfo) {
        if (dependencyInfo) {
            registerDependencyInfo.call(this, dependencyInfo);
        }
    }

    registerDependencyInfo(dependencyInfo) {
        registerDependencyInfo.call(this, dependencyInfo);
    }

    registerField(fieldInfo) {
        registerField.call(this, fieldInfo);
    }

    handleFieldValueChange(fieldName, fieldValue) {
        handleFieldValueChange.call(this, fieldName, fieldValue);
    }
}

function registerDependencyInfo({ dependentFields, picklistValues }) {
    // mainly needed for tests to clear the existing maps before each test
    clearMaps.call(this);
    if (dependentFields) {
        buildDependencyMap.call(this, dependentFields);
    }
    if (picklistValues) {
        Object.assign(this._picklistMap, picklistValues);
    }
}

function buildDependencyMap(config) {
    for (const prop in config) {
        if (config.hasOwnProperty(prop)) {
            const result = Object.keys(config[prop]).reduce((prev, key) => {
                prev.push(key);
                return prev;
            }, []);
            if (result.length > 0) {
                this._dependencyMap[prop] = result;
            }
            buildDependencyMap.call(this, config[prop]);
        }
    }
}

function registerField({ fieldName, fieldElement }) {
    // add field to fieldValues map
    if (!(fieldName in this._fieldValues)) {
        this._fieldValues[fieldName] = {
            controllerName: getControllerName.call(this, fieldName),
            fieldElement,
        };
    }

    initializeField.call(this, fieldName);
}

function initializeField(fieldName) {
    const field = this._fieldValues[fieldName];
    const hasController = field.controllerName !== undefined;

    // controller could be registered after the dependent field. Avoid initializing the dependent before the controller is registered.
    const controllerNotRegistered =
        hasController && this._fieldValues[field.controllerName] === undefined;
    if (controllerNotRegistered) {
        return;
    }

    // checkbox fields don't have options, only need to update its dependents
    if (this._picklistMap[fieldName] !== undefined) {
        const controllerValue = getControllerValue.call(this, fieldName);

        const picklistOptions = getPicklistOptions.call(
            this,
            fieldName,
            controllerValue
        );

        updateFieldOptions(fieldName, field.fieldElement, picklistOptions);
    }

    // If controller field is registered after the dependent field, we have to update the dependents with the correct controller value
    const fieldValue = getFieldValue(fieldName, field.fieldElement);
    updateDependentFields.call(this, fieldName, fieldValue);
}

function handleFieldValueChange(fieldName, fieldValue) {
    updateDependentFields.call(this, fieldName, fieldValue);
}

function updateDependentFields(fieldName, fieldValue) {
    const dependentFieldNames = this._dependencyMap[fieldName] || [];
    if (!dependentFieldNames.length) {
        return;
    }

    // update the options on all of the fields that depend on the field
    for (let i = 0, len = dependentFieldNames.length; i < len; i++) {
        const dependentFieldName = dependentFieldNames[i];
        const field = this._fieldValues[dependentFieldName];

        if (field) {
            const newOptions = getPicklistOptions.call(
                this,
                dependentFieldName,
                fieldValue
            );
            updateFieldOptions(
                dependentFieldName,
                field.fieldElement,
                newOptions
            );
        }
    }
}

function getControllerName(fieldName) {
    return Object.keys(this._dependencyMap).find(key =>
        this._dependencyMap[key].includes(fieldName)
    );
}

function getControllerValue(fieldName) {
    const field = this._fieldValues[fieldName];
    const controllerField = this._fieldValues[field.controllerName];

    // Value on the controller field could have been set to the picklist default value.
    // However, initially we may not have access to the controller field depending on the order that the fields are registered.
    let controllerValue;
    if (controllerField) {
        controllerValue = getFieldValue(
            field.controllerName,
            controllerField.fieldElement
        );
    }

    return controllerValue;
}

function getFieldValue(fieldName, fieldElement) {
    const fieldValue = fieldElement.getFieldValue();
    // for compound fields like address, the value is an object
    if (typeof fieldValue === 'object' && fieldValue !== null) {
        return fieldValue[fieldName];
    }
    return fieldValue;
}

function getPicklistOptions(fieldName, controllerValue) {
    const cacheKey = getOptionsUniqueKey({
        fieldName,
        controllerValue,
    });
    if (cacheKey in this._optionsCache) {
        return this._optionsCache[cacheKey];
    }

    const field = this._fieldValues[fieldName];
    const picklistInfo = this._picklistMap[fieldName];
    let picklistValues = picklistInfo && picklistInfo.values;

    const hasController = field.controllerName !== undefined;

    if (hasController) {
        if (controllerValue !== undefined && controllerValue !== null) {
            picklistValues = getDependentPicklistOptions(
                picklistInfo,
                controllerValue
            );
        } else {
            picklistValues = [];
        }
    }

    this._optionsCache[cacheKey] = picklistValues;
    return picklistValues;
}

function getDependentPicklistOptions(picklistOptions, controllerValue) {
    const controllerIndex = picklistOptions.controllerValues[controllerValue];
    const allPicklistOptions = picklistOptions.values;

    const options = [];
    for (let i = 0, len = allPicklistOptions.length; i < len; i++) {
        const option = allPicklistOptions[i];
        if (option.validFor.includes(controllerIndex)) {
            options.push(option);
        }
    }
    return options;
}

function updateFieldOptions(fieldName, fieldElement, options) {
    fieldElement.updateFieldOptions(fieldName, options);
}

function getOptionsUniqueKey(options) {
    return Object.keys(options).reduce((prev, optionName) => {
        const option = options[optionName];
        return option !== undefined && option !== ''
            ? prev + (prev !== '' ? '-' : '') + option + ''
            : prev + '';
    }, '');
}

function clearMaps() {
    this._fieldValues = {};
    this._dependencyMap = {};
    this._picklistMap = {};
    this._optionsCache = {};
}
