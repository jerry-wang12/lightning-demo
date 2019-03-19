import { camel2snake, extendConfigFile, getModulesByDir, getModulesByFile } from './compile-util';

// 定义不同目录下 文件->模块别名 的转换规则
const labelOption = {
  dir: 'labels/',
  namespace: '@salesforce/label/'
};
const lightningOptions = {
  dir: 'compiled/lightning/',
  namespace: 'lightning/'
};
const componentOption = {
  convertName: camel2snake,
  dir: 'compiled/components/',
  namespace: 'c/'
};
const paths = {
  'assert': ['external/assert.js'],
  'lightning:IntlLibrary': ['external/intl-library.js']
};

export async function initModulePaths(): Promise<void> {
  Object.assign(paths, await getModulesByFile(labelOption));
  Object.assign(paths, await getModulesByDir(lightningOptions));
  Object.assign(paths, await getModulesByDir(componentOption));
  await extendConfigFile(paths);
}

initModulePaths();
