import { compile } from '@lwc/compiler';

const options = {
  name: 'foo',
  namespace: 'c',
  files: {
    'foo.js': `
          import { LightningElement } from 'lwc';
          export default class Foo extends LightningElement {}
        `,
    'foo.html': `<template><h1>Foo</h1><lightning-button>button</lightning-button></template>`
  }
};

async function doCompile(): Promise<String> {
  const {
    success,
    diagnostics,
    result: { code }
  } = await compile(options);

  return code;
}

doCompile().then(code => console.log(code));
