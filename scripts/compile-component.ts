import { doCompile } from './compile-util';

const option = {
  baseDir: '../src/components/helloWorldApp/',
  name: 'helloWorldApp',
  namespace: 'c',
  outputDir: '../compiled/components/helloWorldApp/'
};

export async function compileComponents(): Promise<void> {
  await doCompile(option);
}

compileComponents();
