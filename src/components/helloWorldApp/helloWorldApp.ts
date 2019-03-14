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
  get contacts() {
    return [
      {
        Id: 1,
        Name: 'Amy Taylor',
        Title: 'VP of Engineering'
      },
      {
        Id: 2,
        Name: 'Michael Jones',
        Title: 'VP of Sales'
      },
      {
        Id: 3,
        Name: 'Jennifer Wu',
        Title: 'CEO'
      }
    ];
  }
}
