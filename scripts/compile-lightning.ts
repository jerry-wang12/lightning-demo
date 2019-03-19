import { doCompileModules } from './compile-util';

const option = {
  baseDir: '../src/lightning/',
  namespace: 'lightning',
  outputDir: '../compiled/lightning/'
};

doCompileModules(option);
