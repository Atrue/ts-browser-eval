import typescript from '@rollup/plugin-typescript';
import node from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import ignore from 'rollup-plugin-ignore';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/index.ts',
  output: {
    format: 'es',
    dir: 'lib',
  },
  plugins: [
    ignore(['module', 'fs', 'path'], { commonjsBugFix: true }),
    typescript({ sourceMap: false }),
    node({ browser: true, preferBuiltins: false }),
    commonjs({ sourceMap: false, ignoreGlobal: true }),
    json({ compact: true }),
    // replace buffer, will be deleted by tree shake
    replace({
      Buffer: 'Object',
    }),
    // typescript bundle fixes
    replace({
      'process.env.NODE_ENV': '"development"',
      __filename: '"script-bundle.js"',
      __dirname: '"/"',
      process: 'undefined',
      ChakraHost: 'undefined',
      include: [/typescript/],
    }),
    terser({ module: true, output: { comments: 'some' } }),
  ],
};
