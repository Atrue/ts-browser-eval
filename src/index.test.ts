// eslint-disable-next-line import/extensions,import/no-unresolved
import compile from '.';

describe('compile', () => {
  it('should compile without errors', async () => {
    const project = {
      'root/main.ts': 'import {ABC} from "../utils/inner.ts";\nconsole.log(ABC.a)',
      'utils/inner.ts': 'export enum ABC {a, b, c}',
    };

    const result = await compile(project, 'root/main.ts', {
      target: 'ES2017',
    }, {
      format: 'iife',
      name: 'bundle',
    });

    const bundle = `(function () {
    'use strict';

    var ABC;\r
    (function (ABC) {\r
        ABC[ABC["a"] = 0] = "a";\r
        ABC[ABC["b"] = 1] = "b";\r
        ABC[ABC["c"] = 2] = "c";\r
    })(ABC || (ABC = {}));

    console.log(ABC.a);

}());
`;
    expect(result).toMatchObject([{
      code: bundle,
      dynamicImports: [],
      exports: [],
      fileName: 'main.js',
      facadeModuleId: 'root/main.ts',
      implicitlyLoadedBefore: [],
      importedBindings: {},
      imports: [],
      isDynamicEntry: false,
      isEntry: true,
      isImplicitEntry: false,
      map: null,
      name: 'main',
      referencedFiles: [],
      type: 'chunk',
      modules: {
        'utils/inner.ts': {
          originalLength: 150, removedExports: [], renderedExports: ['ABC'], renderedLength: 141,
        },
        'root/main.ts': {
          originalLength: 63, removedExports: [], renderedExports: [], renderedLength: 19,
        },
      },
    }]);
  });

  it('should add ts extension', async () => {
    const project = {
      'main.ts': 'import {ABC} from "./inner";\nconsole.log(ABC.a)',
      'inner.ts': 'export enum ABC {a, b, c}',
    };

    const result = await compile(project, 'main.ts', {
      target: 'ES2017',
    }, {
      format: 'iife',
      name: 'bundle',
    });

    expect(result.length).toEqual(1);
  });

  it('should raise errors if no module founds', async () => {
    const project = {
      'root/main.ts': 'import {ABC} from "../utils/inner.ts";\nconsole.log(ABC.a)',
    };

    await expect(compile(project, 'root/main.ts', {
      target: 'ES2017',
    }, {
      format: 'iife',
      name: 'bundle',
    })).rejects.toThrowError(Error("Could not resolve '../utils/inner.ts' from 'root/main.ts'"));
  });
});
