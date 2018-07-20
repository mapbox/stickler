# @mapbox/stickler

**EXPERIMENTAL! WORK IN PROGRESS! DO NOT USE!**

No-fuss code-quality tooling for Mapbox frontend repositories.

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Inspirations](#inspirations)

## About

Stickler lints and formats JavaScript and Markdown. In the future, it may do more.

Behind the curtain, Stickler uses independent packages that you have probably used before — ESLint and ESLint plugins, Prettier, remark and remark-lint plugins. But Stickler is black box that contains that complexity, provides vetted defaults, and exposes simplified configuration. Stickler saves you from the chores of researching, installing, configurating, and periodically updating a boatload of dependencies in order to set up your workflow.

Stickler's options and defaults are selected to meet the needs of Mapbox repositories — especially our frontend repositories, which often bobble various flavors of JS (React, ES2015, ES5, ES modules, Flow, etc.).

The base ESLint configuration includes universal rule-catching errors. (No code-style rules are included because Stickler will format your code.) With your Stickler configuration you can toggle support for various JS flavors and environments: each setting activates appropriate linter settings and error-catching rules.

Stickler's CLI exposes the commands you'll need to check your work.

## Installation

```
npm install @mapbox/stickler
```

If you want to use `stickler precommit`, you'll also need to install [Husky](https://github.com/typicode/husky) or something similar.

## Configuration

Create a `stickler.config.js` file in your project root. It should export a configuration object.

```js
// stickler.config.js

'use strict';

module.exports = {
  // Glob-array of files that should be ignored by both linting and formatting.
  // (Replaces .eslintignore, .prettierignore, .remarkignore, etc.)
  // Everything in .gitignore is automatically ignored.
  ignore: [files],
  // Linting configuration for JS.
  jsLint: {
    // Allow for globals.
    globals: { [string]: boolean },
    // A few Promise-linting rules.
    // This is the only option turned on by default.
    promise: boolean,
    // Enables JSX, lints it, enforces various error-preventing
    // conventions.
    react: boolean,
    // Use babel-eslint, because you're using non-standard syntax
    // (e.g. class properties).
    babel: boolean,
    // Expect an ES5 environment.
    es5: boolean,
    // Prevent Flow annotations from breaking ESLint.
    // Turns on babel-eslint and the base eslint-plugin-flowtype rules.
    flow: boolean,
    // CommonJS or ES modules.
    sourceType: 'cjs' | 'esm',
    // Allow for Jest's globals. Usually you'll use this within an
    // override.
    jest: boolean,
    // Allow for browser globals.
    browser: boolean,
    // Expose Node globals. A truthy value also sets sourceType to cjs
    // (though this can be overridden with sourceType).
    // If the value is true, the Node version is read from the "engines"
    // field in package.json. If for some reason you don't specify an
    // engine in package.json, you can use a number.
    node: boolean | 6 | 8,
    // Catch code that might allow XSS attacks. Turns on "browser" settings, also.
    xss: boolean,
    // Add custom ESLint stuff. You won't be able to install your own
    // plugins, but you can do everything else.
    eslintConfig: {..},
    // Override the linting configuration for files that match specific globs.
    // This is to allow for different flavors of JS in different directories
    // (e.g. React in only some places, Node in some places but ES2015 imports
    // in others). This replaces the need to create nested & cascading .eslintrc
    // files. The first override whose glob matches a file will be used: the
    // override configuration will be merged with the base defined above.
    overrides: [
      {
        files: [..],
        ...jsLint
      }
    ]
  },
  // Toggle formatting of JS (with Prettier). On by default.
  jsFormat: boolean,
  // Toggle formatting of JSON (with Prettier). On by default.
  jsonFormat: boolean,
  // Toggle linting of Markdown (with remark-lint). On by default.
  mdLint: boolean,
  // Toggle formatting of Markdown (with remark). On by default.
  mdFormat: boolean
}
```

## Usage

The Stickler CLI exposes the following commands:

- `lint`: Lint files.
- `format`: Format files.
- `precommit`: Lint and format staged files. To use with Husky, for example, you'll
  invoke this in the npm `"precommit"` script: `"precommit": "stickler precommit"`.
- `watch`: Lint files as you work. When you save a file, it gets linted.

Run `stickler --help` for details.

## Inspirations

- [XO](https://github.com/xojs/xo)
- [Standard](https://github.com/standard/standard)
- [kcd-scripts](https://github.com/kentcdodds/kcd-scripts)
