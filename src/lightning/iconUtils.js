import { getPathPrefix, getToken } from 'lightning/configProvider';
import { unwrap } from 'lwc';
import isIframeInEdge from './isIframeInEdge';

const validNameRe = /^([a-zA-Z]+):([a-zA-Z]\w*)$/;
const underscoreRe = /_/g;

let pathPrefix;

const tokenNameMap = Object.assign(Object.create(null), {
  action: 'lightning.actionSprite',
  custom: 'lightning.customSprite',
  doctype: 'lightning.doctypeSprite',
  standard: 'lightning.standardSprite',
  utility: 'lightning.utilitySprite'
});

const defaultTokenValueMap = Object.assign(Object.create(null), {
  'lightning.actionSprite': '/assets/icons/action-sprite/svg/symbols.svg',
  'lightning.customSprite': '/assets/icons/custom-sprite/svg/symbols.svg',
  'lightning.doctypeSprite': '/assets/icons/doctype-sprite/svg/symbols.svg',
  'lightning.standardSprite': '/assets/icons/standard-sprite/svg/symbols.svg',
  'lightning.utilitySprite': '/assets/icons/utility-sprite/svg/symbols.svg'
});

const getDefaultBaseIconPath = category =>
  defaultTokenValueMap[tokenNameMap[category]];

const getBaseIconPath = category =>
  getToken(tokenNameMap[category]) || getDefaultBaseIconPath(category);

const getMatchAtIndex = index => iconName => {
  const result = validNameRe.exec(iconName);
  return result ? result[index] : '';
};

const getCategory = getMatchAtIndex(1);
const getName = getMatchAtIndex(2);
export { getCategory, getName };

export const isValidName = iconName => validNameRe.test(iconName);

export const getIconPath = iconName => {
  pathPrefix = pathPrefix !== undefined ? pathPrefix : getPathPrefix();

  if (isValidName(iconName)) {
    const baseIconPath = getBaseIconPath(getCategory(iconName));
    if (baseIconPath) {
      // This check was introduced the following MS-Edge issue:
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9655192/
      // If and when this get fixed, we can safely remove this block of code.
      if (isIframeInEdge) {
        // protocol => 'https:' or 'http:'
        // host => hostname + port
        const origin = `${window.location.protocol}//${window.location.host}`;
        return `${origin}${pathPrefix}${baseIconPath}#${getName(iconName)}`;
      }
      return `${pathPrefix}${baseIconPath}#${getName(iconName)}`;
    }
  }
  return '';
};

export const computeSldsClass = iconName => {
  if (isValidName(iconName)) {
    const category = getCategory(iconName);
    const name = getName(iconName).replace(underscoreRe, '-');
    return `slds-icon-${category}-${name}`;
  }
  return '';
};

export { polyfill } from './polyfill';

// via https://stackoverflow.com/a/9851769
const isSafari =
  window.safari &&
  window.safari.pushNotification &&
  window.safari.pushNotification.toString() ===
    '[object SafariRemoteNotification]';

// [W-3421985] https://bugs.webkit.org/show_bug.cgi?id=162866
// https://git.soma.salesforce.com/aura/lightning-global/blob/82e8bfd02846fa7e6b3e7549a64be95b619c4b1f/src/main/components/lightning/primitiveIcon/primitiveIconHelper.js#L53-L56
export function safariA11yPatch(svgElement) {
  if (!svgElement || !isSafari) {
    return;
  }

  // In case we're dealing with a proxied element.
  svgElement = unwrap(svgElement);

  const use = svgElement.querySelector('use');
  if (!use) {
    return;
  }

  svgElement.insertBefore(document.createTextNode('\n'), use);

  // If use.nextSibling is null, the text node is added to the end of
  // the list of children of the SVG element.
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
  svgElement.insertBefore(document.createTextNode('\n'), use.nextSibling);
}
