import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from "@rollup/plugin-commonjs";
import terser from '@rollup/plugin-terser';

const pkg = require('./package.json');
const libName = pkg.name;

const inputFiles = ['index'];
const libNames = {'index': 'MassageEvent'};
function outputFile(name, lib = libName) {
  return [{
    // commonjs
    format: 'cjs',
    file: `dist/${name}.cjs.js`
  },
  {
    // es module
    format: 'es',
    file: `dist/${name}.esm.js`,
  },
  {
    // 通用格式可以用于node和browser等多个场景
    format: 'umd',
    // 注意如果是umd格式的bundle的话name属性是必须的，这时可以在script标签引入后window下会挂载该属性的变量来使用你的类库方法
    name: lib,
    file: `dist/${name}.umd.js`,
  },
  {
    // 通用格式可以用于node和browser等多个场景
    format: 'umd',
    // 注意如果是umd格式的bundle的话name属性是必须的，这时可以在script标签引入后window下会挂载该属性的变量来使用你的类库方法
    name: lib,
    file: `dist/${name}.min.js`,
    plugins: [terser()]
  }]
}

function singleOptions(name, lib) {
  return {
    input: `./src/${name}.ts`,
    output: outputFile(name, lib),
    plugins: [
      commonjs(),
      resolve(),
      typescript(),
      babel({
        exclude: ['node_modules/**']
      }),
    ],
  }
}

export default inputFiles.map(v => singleOptions(v, libNames[v]));
