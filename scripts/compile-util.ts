import { compile } from '@lwc/compiler';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { CompilerOptions } from '../typings/lwc/compiler/options';

export const exists = promisify(fs.exists);
export const readFile = promisify(fs.readFile);
export const readdir = promisify(fs.readdir);
export const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const lstat = promisify(fs.lstat);

export interface IOptionsDefine {
  baseDir: string;
  name?: string;
  namespace: string;
  outputDir?: string;
}

export async function doCompile(options: IOptionsDefine): Promise<string> {
  const normalizedOptions = await getOptions(options);
  const { diagnostics, result } = await compile(normalizedOptions);
  if (!result || !result.code) {
    throw new Error(JSON.stringify(diagnostics, null, 2));
  }
  if (options.outputDir) {
    await mkdirs(options.outputDir);
    writeFile(`${path.join(options.outputDir, options.name)}.js`, result.code);
  }
  return result.code;
}

export async function doCompileModules(options: IOptionsDefine): Promise<void> {
  for (const file of await readdir(options.baseDir)) {
    const moduleDir = path.join(options.baseDir, file);
    if (!(await lstat(moduleDir)).isDirectory()) {
      continue;
    }
    const moduleOptions = Object.assign(Object.create(null), options, {
      baseDir: moduleDir,
      name: file,
      outputDir: path.join(options.outputDir, file)
    });
    await doCompile(moduleOptions);
  }
}

async function getOptions({ name, baseDir, namespace }: IOptionsDefine): Promise<CompilerOptions> {
  const options = {
    baseDir,
    files: {},
    name,
    namespace,
    outputConfig: {
      compat: false,
      format: 'es',
      minify: false,
      resolveProxyCompat: {
        global: 'Proxy'
      }
    }
  };
  Object.assign(options.files, await readTypedFiles(baseDir, '.html', '.js', '.ts', '.css'));
  return options;
}

async function readTypedFiles(dir: string, ...types: string[]): Promise<object> {
  if (!dir.endsWith('/')) {
    dir += '/';
  }
  const fileList = await readdir(dir);
  const result = {};
  for (const file of fileList) {
    const fileType = path.extname(file);
    if (types.includes(fileType)) {
      if (fileType === '.ts') {
        result[`${dir}${path.basename(file, '.ts')}.js`] = await readFile(`${dir}${file}`, 'utf8');
      } else {
        result[`${dir}${file}`] = await readFile(`${dir}${file}`, 'utf8');
      }
    }
  }
  return result;
}

export async function mkdirs(dir: string, mode = {}): Promise<boolean> {
  if (await exists(dir)) {
    console.log(`目录- ${dir} 已存在`);
    return true;
  }
  let pathtmp: string;
  for (const dirname of dir.split(path.sep)) {
    pathtmp = pathtmp ? path.join(pathtmp, dirname) : dirname;
    if (await exists(pathtmp)) {
      continue;
    }
    await mkdir(pathtmp, mode);
    console.log(`创建目录- ${dir} 成功`);
  }
  return true;
}

export interface IModulesOption {
  dir: string;
  namespace: string;
  baseDir?: string;
  convertName?: (source: string) => string;
}

export async function getModulesByFile({ dir, namespace, baseDir = '../' }: IModulesOption): Promise<object> {
  const paths = {};
  for (const file of await readdir(path.join(baseDir, dir))) {
    paths[path.join(namespace, path.basename(file, '.js'))] = [path.join(dir, file)];
  }
  return paths;
}

export async function getModulesByDir({
  dir,
  namespace,
  baseDir = '../',
  convertName = (source) => source
}: IModulesOption): Promise<object> {
  const paths = {};
  for (const name of await readdir(path.join(baseDir, dir))) {
    const modulePath = path.join(baseDir, dir, name, `${name}.js`);
    if (!exists(modulePath)) {
      continue;
    }
    paths[path.join(namespace, convertName(name))] = [path.join(dir, name, `${name}.js`)];
  }
  return paths;
}

export async function extendConfigFile(paths: object): Promise<void> {
  readFile('../tsconfig.json').then((content) => {
    const tsconfig = JSON.parse(content.toString());
    Object.assign(tsconfig.compilerOptions.paths, paths);
    writeFile('../tsconfig.json', JSON.stringify(tsconfig, null, 2));
  });
}

export function camel2snake(source: string): string {
  return source.replace(/([A-Z])/g, '-$1').toLowerCase();
}
