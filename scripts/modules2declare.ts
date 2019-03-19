import { camel2snake, extendConfigFile, getModulesByDir } from './compile-util';

const option = {
  convertName: camel2snake,
  dir: 'compiled/components/',
  namespace: 'c/'
};
getModulesByDir(option).then((paths) => {
  extendConfigFile(paths);
});
