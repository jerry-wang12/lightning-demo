import _lightningCombobox from 'lightning/combobox';
import _lightningBadge from 'lightning/badge';
import _lightningHelptext from 'lightning/helptext';
import { registerTemplate, registerDecorators, registerComponent, LightningElement } from 'lwc';

function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    d: api_dynamic,
    h: api_element,
    c: api_custom_element
  } = $api;
  return [api_element("h1", {
    classMap: {
      "slds-text-heading_large": true
    },
    key: 2
  }, [api_dynamic($cmp.state.title)]), api_custom_element("lightning-combobox", _lightningCombobox, {
    props: {
      "options": $cmp.options,
      "value": "supports"
    },
    key: 3
  }, []), api_custom_element("lightning-badge", _lightningBadge, {
    props: {
      "label": "Lightning Components"
    },
    key: 4
  }, []), api_custom_element("lightning-helptext", _lightningHelptext, {
    props: {
      "content": "isn't that cool?"
    },
    key: 5
  }, [])];
}

var _tmpl = registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetTokens = {
  hostAttribute: "c-helloWorldApp_helloWorldApp-host",
  shadowAttribute: "c-helloWorldApp_helloWorldApp"
};

class HelloWorldApp extends LightningElement {
  constructor(...args) {
    super(...args);
    this.state = {
      title: 'Welcome to Lightning Web Components Playground!'
    };
  }

  get options() {
    return [{
      label: 'supports',
      value: 'supports'
    }, {
      label: 'has ability to show',
      value: 'shows'
    }];
  }

}

registerDecorators(HelloWorldApp, {
  track: {
    state: 1
  }
});

var helloWorldApp = registerComponent(HelloWorldApp, {
  tmpl: _tmpl
});

export default helloWorldApp;
