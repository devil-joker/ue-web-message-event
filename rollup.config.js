import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from "@rollup/plugin-commonjs";

const pkg = require('./package.json');
const libName = pkg.name;

export default {
  input: './src/index.ts',
  output: [
    {
      // commonjs
      format: 'cjs',
      file: `dist/index.cjs.js`
    },
    {
      // es module
      format: 'es',
      file: `dist/index.esm.js`,
    },
    {
      // 通用格式可以用于node和browser等多个场景
      format: 'umd',
      // 注意如果是umd格式的bundle的话name属性是必须的，这时可以在script标签引入后window下会挂载该属性的变量来使用你的类库方法
      name: libName,
      file: `dist/index.umd.js`,
    }
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      sourceMap: false,
    }),
    commonjs(),
    resolve(),
    babel({
      exclude: ['node_modules/**']
    }),
  ],
}
