import { compile } from '@lwc/compiler';
import * as fs from 'fs';
import * as path from 'path';

const inputDir = 'src/lightning/',
  outputDir = 'compiled/lightning/',
  fileList = fs.readdirSync(inputDir);
for (const file of fileList) {
  let lightningModule = inputDir + file;
  if (fs.lstatSync(lightningModule).isDirectory()) {
    let options = getOptions(file, lightningModule);
    doCompile(options).then(code => {
      mkdirsSync(outputDir + file);
      fs.writeFileSync(`${outputDir + file}/${file}.js`, code);
    });
  } else {
    let options = getSingleOptions(file.split('.')[0], inputDir);
    doCompile(options).then(code => {
      mkdirsSync(outputDir);
      fs.writeFileSync(`${outputDir}/${file}`, code);
    });
  }
}

function getSingleOptions(fileName, parentPath) {
  let options = {
    outputConfig: {
      minify: false,
      compat: false,
      resolveProxyCompat: {
        global: 'Proxy'
      },
      format: 'es'
    },
    input: parentPath,
    baseDir: parentPath,
    name: fileName,
    namespace: 'lightning',
    files: {}
  };
  Object.assign(options.files, readTypedFiles(parentPath));
  return options;
}

function getOptions(shortName, fullName) {
  let cssKey = `${fullName}/${shortName}.css`,
    options = {
      outputConfig: {
        minify: false,
        compat: false,
        resolveProxyCompat: {
          global: 'Proxy'
        },
        format: 'es'
      },
      input: fullName,
      baseDir: fullName,
      name: shortName,
      namespace: 'lightning',
      files: {}
    };
  if (fs.existsSync(cssKey)) {
    options.files[cssKey] = fs.readFileSync(cssKey).toString();
  }
  Object.assign(options.files, readTypedFiles(fullName, '.html'));
  Object.assign(options.files, readTypedFiles(fullName));
  return options;
}

async function doCompile(options: any): Promise<String> {
  const output = await compile(options);
  return (output && output.result && output.result.code) || '';
}

function readTypedFiles(dirpath: string, type: String = '.js') {
  if (!dirpath.endsWith('/')) {
    dirpath += '/';
  }
  let fileList = fs.readdirSync(dirpath),
    result = {};
  for (let file of fileList) {
    if (path.extname(file) === type) {
      result[`${dirpath}${file}`] = fs
        .readFileSync(`${dirpath}${file}`)
        .toString();
    }
  }
  return result;
}

function mkdirsSync(dirpath, mode = {}) {
  if (!fs.existsSync(dirpath)) {
    var pathtmp;
    dirpath.split(path.sep).forEach(function(dirname) {
      if (pathtmp) {
        pathtmp = path.join(pathtmp, dirname);
      } else {
        pathtmp = dirname;
      }
      if (!fs.existsSync(pathtmp)) {
        fs.mkdirSync(pathtmp, mode);
      }
    });
  }
  return true;
}
