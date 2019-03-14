import { getDefaultConfig } from './defaultConfig';

// Closure to hold the APIs if and when available
let PROVIDED_IMPL = getDefaultConfig();
let FORM_FACTOR;

let configProvided = false;

export default function configProviderService(serviceAPI) {
  if (!configProvided) {
    PROVIDED_IMPL = {
      getCoreInfo:
        serviceAPI.getInitializer &&
        serviceAPI.getInitializer('coreInfoConfig'),
      getPathPrefix: serviceAPI.getPathPrefix,
      getFormFactor: serviceAPI.getFormFactor,
      getToken: serviceAPI.getToken,
      getLocale: serviceAPI.getLocale,
      getLocalizationService: serviceAPI.getLocalizationService,
      sanitizeDOM: serviceAPI.sanitizeDOM
    };
    configProvided = true;
    FORM_FACTOR = undefined;
  } else {
    throw new Error(
      'ConfigProvider can only be set once at initilization time'
    );
  }

  return { name: 'lightning-config-provider' };
}

export function getPathPrefix() {
  return (
    (PROVIDED_IMPL &&
      PROVIDED_IMPL.getPathPrefix &&
      PROVIDED_IMPL.getPathPrefix()) ||
    ''
  );
}

export function getToken(name) {
  return (
    PROVIDED_IMPL && PROVIDED_IMPL.getToken && PROVIDED_IMPL.getToken(name)
  );
}

export function getLocale() {
  return PROVIDED_IMPL && PROVIDED_IMPL.getLocale && PROVIDED_IMPL.getLocale();
}

export function getFormFactor() {
  if (!FORM_FACTOR) {
    if (PROVIDED_IMPL && PROVIDED_IMPL.getFormFactor) {
      FORM_FACTOR = PROVIDED_IMPL.getFormFactor();
    } else {
      FORM_FACTOR = 'DESKTOP';
    }
  }

  return FORM_FACTOR;
}

export function getLocalizationService() {
  return (
    PROVIDED_IMPL &&
    PROVIDED_IMPL.getLocalizationService &&
    PROVIDED_IMPL.getLocalizationService()
  );
}

export function sanitizeDOM(dirty, config) {
  if (PROVIDED_IMPL && PROVIDED_IMPL.sanitizeDOM) {
    return PROVIDED_IMPL.sanitizeDOM(dirty, config);
  }
  return '';
}

export function getCoreInfo() {
  return (
    (PROVIDED_IMPL && PROVIDED_IMPL.getCoreInfo) || {
      untrustedContentDomain: '.a.forceusercontent.com',
      localhostPort: '',
      securePort: ''
    }
  );
}
