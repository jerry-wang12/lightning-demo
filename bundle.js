(function (Engine) {
  'use strict';

  // import { LightningElement, api } from 'lwc';

  function tmpl($api, $cmp, $slotset, $ctx) {
    const {
      d: api_dynamic
    } = $api;
    return [api_dynamic($cmp.label)];
  }

  var _tmpl = Engine.registerTemplate(tmpl);
  tmpl.stylesheets = [];
  tmpl.stylesheetTokens = {
    hostAttribute: "lightning-badge_badge-host",
    shadowAttribute: "lightning-badge_badge"
  };

  /**
   * Represents a label which holds a small amount of information, such as the
   * number of unread notifications.
   */

  class LightningBadge extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.label = void 0;
    }

    connectedCallback() {
      this.classList.add('slds-badge');
    }

  }

  Engine.registerDecorators(LightningBadge, {
    publicProps: {
      label: {
        config: 0
      }
    }
  });

  var badge = Engine.registerComponent(LightningBadge, {
    tmpl: _tmpl
  });

  // import { LightningElement, track } from 'lwc';

  function tmpl$1($api, $cmp, $slotset, $ctx) {
    const {
      t: api_text,
      h: api_element,
      c: api_custom_element
    } = $api;
    return [api_element("h1", {
      key: 2
    }, [api_text("Foo")]), api_custom_element("lightning-badge", badge, {
      key: 3
    }, [api_text("help text")])];
  }

  var _tmpl$1 = Engine.registerTemplate(tmpl$1);
  tmpl$1.stylesheets = [];
  tmpl$1.stylesheetTokens = {
    hostAttribute: "c-helloWorldApp_helloWorldApp-host",
    shadowAttribute: "c-helloWorldApp_helloWorldApp"
  };

  class HelloWorldApp extends Engine.LightningElement {
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

    get contacts() {
      return [{
        Id: 1,
        Name: 'Amy Taylor',
        Title: 'VP of Engineering'
      }, {
        Id: 2,
        Name: 'Michael Jones',
        Title: 'VP of Sales'
      }, {
        Id: 3,
        Name: 'Jennifer Wu',
        Title: 'CEO'
      }];
    }

  }

  Engine.registerDecorators(HelloWorldApp, {
    track: {
      state: 1
    }
  });

  var helloWorldApp = Engine.registerComponent(HelloWorldApp, {
    tmpl: _tmpl$1
  });

  // import './assets/css/salesforce-lightning-design-system.css';
  var rootEl = document.getElementById('root');
  var element = Engine.createElement('c-app', { is: helloWorldApp });
  rootEl.appendChild(element);

}(Engine));
