import { camel2snake, extendConfigFile, getModulesByDir } from './compile-util';

const option = {
  convertName: camel2snake,
  dir: 'compiled/components/',
  namespace: 'c/'
};

export async function initCustomModules(): Promise<void> {
  const paths = await getModulesByDir(option);
  extendConfigFile(paths);
}

initCustomModules();
