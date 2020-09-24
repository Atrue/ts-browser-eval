import {
  transpile, ScriptTarget, ModuleKind, ModuleResolutionKind, NewLineKind, JsxEmit, CompilerOptions,
} from 'typescript';
import { RenderedChunk, OutputOptions } from 'rollup';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: using browser version without types
import { rollup } from 'rollup/dist/rollup.browser';

const absolutePath = /^(?:\/|(?:[A-Za-z]:)?[\\|/])/;

function isAbsolute(path: string) {
  return absolutePath.test(path);
}

function resolve(...paths: string[]) {
  let resolvedParts = paths.shift()!.split(/[/\\]/);

  paths.forEach((path) => {
    if (isAbsolute(path)) {
      resolvedParts = path.split(/[/\\]/);
    } else {
      const parts = path.split(/[/\\]/);

      while (parts[0] === '.' || parts[0] === '..') {
        const part = parts.shift();
        if (part === '..') {
          resolvedParts.pop();
        }
      }

      resolvedParts.push(...parts);
    }
  });

  return resolvedParts.join('/');
}

function dirname(path: string) {
  const match = /(\/|\\)[^/\\]*$/.exec(path);
  if (!match) return '.';

  const dir = path.slice(0, -match[0].length);

  // If `dir` is the empty string, we're at root.
  return dir || '/';
}

// using string values to avoid using typescript enum object in the final project
type TSNoEnum = {
  target?: keyof typeof ScriptTarget;
  module?: keyof typeof ModuleKind;
  moduleResolution?: keyof typeof ModuleResolutionKind;
  newLine?: keyof typeof NewLineKind;
  jsx?: keyof typeof JsxEmit;
}
type TSOptions = Omit<CompilerOptions, keyof TSNoEnum> & TSNoEnum;

export default async function compile<P extends Record<string, string>>(
  project: P,
  input: keyof P,
  tsOptions: TSOptions,
  bundleOptions: OutputOptions,
): Promise<RenderedChunk[]> {
  const tsFixedOptions: CompilerOptions = {
    ...tsOptions,
    target: tsOptions.target && ScriptTarget[tsOptions.target],
    module: tsOptions.module && ModuleKind[tsOptions.module],
    newLine: tsOptions.newLine && NewLineKind[tsOptions.newLine],
    jsx: tsOptions.jsx && JsxEmit[tsOptions.jsx],
    moduleResolution: tsOptions.moduleResolution
      && ModuleResolutionKind[tsOptions.moduleResolution],
  };
  const rollupOptions = {
    input: [input],
    plugins: [{
      resolveId(importee: string, importer: string) {
        if (!importer) return importee;
        if (importee[0] !== '.') return false;

        let resolved = resolve(dirname(importer), importee).replace(/^\.\//, '');
        if (resolved in project) return resolved;

        resolved += '.ts';
        if (resolved in project) return resolved;

        throw new Error(`Could not resolve '${importee}' from '${importer}'`);
      },
      load(id: string) {
        const code = project[id];
        return transpile(code, tsFixedOptions, id, []);
      },
    }],
  };

  const roll = await rollup(rollupOptions);
  const result = await roll.generate(bundleOptions);

  return result.output;
}
