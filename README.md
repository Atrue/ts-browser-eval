<h1 align="center">ts-browser-eval</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/ts-browser-eval">
    <img src="https://img.shields.io/npm/v/ts-browser-eval.svg" alt="npm version" >
  </a>
  <a href="https://packagephobia.now.sh/result?p=ts-browser-eval">
    <img src="https://packagephobia.now.sh/badge?p=ts-browser-eval" alt="install size" >
  </a>
  <a href="https://github.com/Atrue/ts-browser-eval/blob/master/README.md">
    <img src="https://img.shields.io/npm/l/ts-browser-eval.svg" alt="license">
  </a>
  <a href="https://david-dm.org/Atrue/ts-browser-eval">
    <img src="https://david-dm.org/Atrue/ts-browser-eval/status.svg" alt="dependency status">
  </a>
</p>


### Overview
Typescript compiler in the browser generating output chunks using rollup

### Installation
```bash
$ npm install ts-browser-eval
```

### Quick example:
```js
// lazy import for code splitting (package size ~2.5 MB)
const compile = await import('ts-browser-eval');

const project = {
  'main.ts': 'import {ABC} from "./inner.ts";\nconsole.log(ABC.a)',
  'inner.ts': 'export enum ABC {a, b, c}',
};

const result = await compile(project, 'root/main.ts', {
  target: 'ES2017',
}, {
  format: 'iife',
  name: 'bundle',
});

console.log(result[0].code);
/*
(function () {
    'use strict';

    var ABC;
    (function (ABC) {
        ABC[ABC["a"] = 0] = "a";
        ABC[ABC["b"] = 1] = "b";
        ABC[ABC["c"] = 2] = "c";
    })(ABC || (ABC = {}));

    console.log(ABC.a);

}());
*/

```

### Arguments
- project (flat object {[filename]: tsCode})
- entry point (the root filename)
- tsOptions 
(https://www.typescriptlang.org/docs/handbook/compiler-options.html 
NOTE: some options don't work in the browser)
- outputOptions (rollup - https://rollupjs.org/guide/en/#outputoptions-object)

### Return
- array of chunks (https://rollupjs.org/guide/en/#rolluprollup)

### Current issues
- There're no type checks ☹