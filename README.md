<h1 align="center">ts-browser-eval</h1>

### Overview
Typescript compiler in the browser generating output chunks using rollup

### Installation
```bash
$ npm install typed-route
```

###Quick example:
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
NOTE: some options doesn't work in the browser)
- outputOptions (rollup - https://rollupjs.org/guide/en/#outputoptions-object)

### Return
- array of chunks (https://rollupjs.org/guide/en/#rolluprollup)

### Current issues
- There're no type checks ☹