import { compile } from '@lwc/compiler';
import * as fs from 'fs';

let options = {
  outputConfig: {
    minify: false,
    compat: false,
    resolveProxyCompat: {
      global: 'Proxy'
    },
    format: 'es'
  },
  input: 'src/components/helloWorldApp/',
  baseDir: 'src/components/helloWorldApp/',
  name: 'helloWorldApp',
  namespace: 'c',
  files: {
    'src/components/helloWorldApp/helloWorldApp.html': fs.readFileSync('src/components/helloWorldApp/helloWorldApp.html').toString(),
    'src/components/helloWorldApp/helloWorldApp.js': fs.readFileSync('src/components/helloWorldApp/helloWorldApp.ts').toString(),
  }
};
// let options = {
//   outputConfig: {
//     minify: false,
//     compat: false,
//     resolveProxyCompat: {
//       global: 'Proxy'
//     },
//     format: 'es'
//   },
//   input: 'src/lightning/',
//   baseDir: 'src/lightning/',
//   name: 'supportsSvg',
//   namespace: 'lightning',
//   files: {
//     'src/lightning/supportsSvg.js': fs.readFileSync('src/lightning/supportsSvg.js').toString(),
//   }
// };

async function doCompile(options:any): Promise<String> {
  const {
    result: { code }
  } = await compile(options);

  return code;
}

doCompile(options).then(code => {
  // console.log(code);
  fs.writeFileSync('src/components/helloWorldApp/helloWorldApp.js', code);
});

// doCompile(options2).then(code => console.log(code));