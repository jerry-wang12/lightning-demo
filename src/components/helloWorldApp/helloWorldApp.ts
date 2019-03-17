import { LightningElement, track } from 'lwc';

export default class HelloWorldApp extends LightningElement {
  @track
  state = {
    title: 'Welcome to Lightning Web Components Playground!'
  };
  get options() {
    return [
      {
        label: 'supports',
        value: 'supports'
      },
      {
        label: 'has ability to show',
        value: 'shows'
      }
    ];
  }
}
