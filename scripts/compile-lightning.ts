import { doCompileModules } from './compile-util';

const option = {
  baseDir: '../src/lightning/',
  namespace: 'lightning',
  outputDir: '../compiled/lightning/'
};

export async function compileLightningModules(): Promise<void> {
  await doCompileModules(option);
}

compileLightningModules();
