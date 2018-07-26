# @mapbox/stickler

No-fuss code-quality tooling for Mapbox frontend repositories.

## Table of contents

- [About](#about)
  - [Features](#features)
  - [Caveats](#caveats)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [ignore](#ignore)
  - [jsLint](#jslint)
  - [jsFormat](#jsformat)
  - [jsonFormat](#jsonformat)
  - [mdLint](#mdlint)
  - [mdFormat](#mdformat)
  - [Configuration examples](#configuration-examples)
- [Inspirations](#inspirations)

## About

Stickler lints and formats JavaScript, JSON, and Markdown. (In the future, it may do more.)

Behind the curtain, Stickler uses independent packages that you have probably used before — ESLint and ESLint plugins, Prettier, remark and remark-lint plugins, Husky and lint-staged. But Stickler is a black box that contains that complexity, provides vetted defaults, and exposes simplified higher-level configuration. Stickler saves you from the chores of researching, installing, configuring, and periodically updating a boatload of dependencies in order to set up your workflow.

Stickler's options and defaults are selected to meet the needs of Mapbox repositories — especially frontend repositories, which often bobble various flavors of JS (React, ES2015, ES5, ES modules, Flow, etc.).

The base ESLint configuration includes universal rule-catching errors. (No code-style rules are included because Stickler will format your JS.) With your Stickler configuration you can toggle support for various JS flavors and environments: each setting activates appropriate linter settings and error-catching rules.

Stickler's CLI exposes the commands you'll need to check your work.

### Features

These are some reasons you might want to use Stickler instead of setting up all the individual tools it incorporates:

- Take advantage of lots of ESLint plugins and configuration presets without having to install, configure, and periodically update them all individually.
- Useful Markdown validation and formatting, like validating Markdown links between files and adding tables of contents to Markdown files.
- An `ignore` option in the config so you won't need multiple coordinated `.*ignore` files. And more `ignore` defaults, so you'll have to specify additional ignore globs less frequently.
- Folder-specific linting settings live in `stickler.config.js`, so you won't need to coordinate nested, cascading `.eslintrc` files.
- Built-in precommit hook to ensure that auto-formatting happens automatically.
- Useful defaults and simplified higher-level configuration options, reducing boilerplate across projects.

### Caveats

- No editor plugins yet. If you want realtime linting feedback, you can use `stickler watch`.

## Installation

```
npm install @mapbox/stickler
```

If you want to use `stickler precommit`, you'll also need to install [Husky](https://github.com/typicode/husky) or something similar.

## Usage

The Stickler CLI exposes the following commands:

- `lint`: Lint files.
- `format`: Format files.
- `precommit`: Lint and format staged files. You'll invoke this in the npm `"precommit"` script: `"precommit": "stickler precommit"`. (This hook is enabled by [Husky].)
- `watch`: Lint files as you work. When you save a file, it gets linted.

Run `stickler --help` for details.

## Configuration

Create a `stickler.config.js` file in your project root, where you'll run the `stickler` command. It should export a configuration object.

**All configuration globs can be relative to `stickler.config.js` or absolute.**

### ignore

Type: `Array<string>`.

Glob-array of files that should be ignored by both linting and formatting. (Replaces the need for `.eslintignore`, `.prettierignore`, `.remarkignore`, etc.)

Everything in .gitignore is automatically ignored. Also, the following globs are automatically ignored:

```
**/node_modules/**
coverage/**
**/*.min.js
vendor/**
dist/**
**/fixtures/**
```

### jsLint

Type: `JsLintSettings | Array<{ files?: Array<string>, settings: JsLintSettings }>`.

Configuration for JS linting.

`jsLint` can be one of the following:

- A single object that applies to *all* JS files in the codebase.
- An array of objects that specify different lint settings for different files.

By using an array, you can lint different JS flavors or environments within the same codebase. For example, many codebases have React code for browser within certain directories, Node code in other directories, Jest tests in others, and so on. (This replaces the need for nested and cascading `.eslintrc` files.)

If you use an array, the following rules apply:

- The `files` property of each item is a glob-array that matches files the `settings` apply to. *It is required for every item except the last* (see below).
- Each file you lint must match *only one* of the `files` glob-arrays. If a file matches multiple, that's a mistake and an error will be thrown.
- The *last* item in the array does not require a `files` property. If it has no `files` property, it serves as a *fallback*: its `settings` will apply to all files that didn't match one of the items above.
- If the last item in the array is *not* a fallback (without a `files` property), Stickler will apply a default fallback of `{ node: true }`.

**If Jest is a development dependency of the codebase,** Stickler will automatically allow for Jest and Node globals in files matching the following glob-array: `['*.test.js', 'test/**', '**/__tests__/**', '**/test-utils/*.js']`.

**Keep in mind that you can use `Object.assign` and other JS to extend and merge settings.** `stickler.config.js` is a regular JS module.

#### JsLintSettings.globals

Type: `{ [string]: boolean }`.

Allow the specified globals. For example, you may use an `analytics` global in some code.

#### JsLintSettings.promise

Type: `boolean`. Default: `true`.

Enable Promise-linting rules from [eslint-plugin-promise].

#### JsLintSettings.react

Type: `boolean`. Default: `false`.

Enables JSX-linting rules from [eslint-plugin-react].

#### JsLintSettings.babel

Type: `boolean`. Default: `false`.

Use [babel-eslint] to parse JS, because you're using non-standard syntax such as class properties or Flow annotations.

#### JsLintSettings.es5

Type: `boolean`. Default: `false`.

Enforce ES5 JS. Useful for code that you want to run in browsers without any Babel compilation.

The `Promise` global is enabled, expecting that you're using a `Promise` polyfill.

#### JsLintSettings.flow

Type: `boolean`. Default: `false`.

Prevent Flow annotations from breaking ESLint. Uses [eslint-plugin-flowtype] and turns on [babel-eslint] \(so you don't need to also turn on [`babel`]).

#### JsLintSettings.moduleType

Type: `'cjs' | 'esm' | 'none'`. Default: `'cjs'`.

Tell Stickler which type of JS modules you're using. `cjs` = CommonJS; `esm` = ES Modules. Turns on rules from [eslint-plugin-node] or [eslint-plugin-import], respectively, to validate your dependencies. `none` = No modules allowed.

#### JsLintSettings.jest

Type: `boolean`. Default: `false`.

Allow Jest's globals. Usually you won't need to set this manually because Stickler will automatically figure out you're using Jest.

#### JsLintSettings.browser

Type: `boolean`. Default: `false`.

Allow browser globals, like `window`.

#### JsLintSettings.node

Type: `boolean | 6 | 8`. Default: `false`.

Configure linting for Node. Allows Node globals and sets `moduleType: 'cjs'` (though this can be overridden with [`moduleType`]).

Also uses [eslint-plugin-node] to check that you're using JS features supported by your version of Node. If the value is `true`, the Node version is read from the `"engines"` field in your `package.json`. If for some reason you don't specify `"engines"`, use a number to specify your Node version.

#### JsLintSettings.xss

Type: `boolean`. Default: `false`.

Enable XSS-preventing rules from [eslint-plugin-xss]. Usually you should use this in combination with [`browser`].

#### JsLintSettings.eslintConfig

Type: `Object`.

Add custom ESLint configuration. You won't be able to install your own plugins, but you can do everything else. Typically you'll use this to add or override rules set by the other options.

### jsFormat

Type: `boolean`. Default: `true`.

Toggle the formatting of JS files.

### jsonFormat

Type: `boolean`. Default: `true`.

Toggle the formatting of JSON files.

### mdLint

Type: `boolean`. Default: `true`.

Toggle the linting of Markdown files.

### mdFormat

Type: `boolean`. Default: `true`.

Toggle the formatting of Markdown files.

In addition to normalize the Markdown syntax, **this will automatically add and update a 3-level-deep table of contents if you put a `## Table of contents` header in your document.**

### Configuration examples

All JS files run in the version of Node specified in `"engines"` in `package.json`.

```
// No config required!
```

All JS files are expected to run in Node 10, but it's not specified in `"engines"` in `package.json`.

```js
'use strict';

module.exports = {
  jsLint: {
    node: 10
  }
};
```

Files in `src/` are React components and use ES2015 modules and Flow, and Jest tests live in nested `__tests__/` subdirectories. There are also a few JS files that run in Node in the project root and a `scripts/` directory.

```js
'use strict';

module.exports = {
  jsLint: [
    {
      files: ['src/**'],
      settings: {
        react: true,
        browser: true,
        moduleType: 'esm',
        flow: true,
      }
    },
    // { node: true } is the automatic fallback
  ]
};
```

The same situation as above, except we haven't designated an `"engines"` field in `package.json` so we want to tell Stickler which version of Node to expect in files outside of `src/`:

```js
'use strict';

module.exports = {
  jsLint: [
    {
      files: ['src/**'],
      settings: {
        react: true,
        browser: true,
        moduleType: 'esm',
        flow: true,
      }
    },
    {
      node: 8
    }
  ]
};
```

Most files are ES5, so they can run uncompiled in the browser. We're ignoring the `ignore-me/` directory. We're allowing for a global `analytics` object. Within a couple of directories we're turning on a couple of additional linting rules. In one directory we have JS files with *no modules* (!), just immediately invoked function expressions. And we're turning off JS formatting.

```js
'use strict';

const baseJsLint = {
  browser: true,
  es5: true,
  globals: { analytics: true }
};

module.exports = {
  ignore: ['ignore-me/**'],
  jsFormat: false,
  jsLint: [
    {
      files: ['services/**', 'lib/**'],
      settings: Object.assign({}, baseJsLint, {
        eslintConfig: {
          rules: {
            'no-extra-parens': 'error',
            'valid-jsdoc': 'error'
          }
        }
      })
    },
    {
      files: ['iifes/**'],
      settings: Object.assign({}, baseJsLint, {
        moduleType: 'none'
      })
    },
    baseJsLint
  ]
}
```

## Inspirations

- [XO](https://github.com/xojs/xo)
- [Standard](https://github.com/standard/standard)
- [kcd-scripts](https://github.com/kentcdodds/kcd-scripts)

[`moduletype`]: #jslintsettingsmoduletype

[`babel`]: #jslintsettingsbabel

[`browser`]: #jslintsettingsbrowser

[babel-eslint]: https://github.com/babel/babel-eslint

[eslint-plugin-node]: https://github.com/mysticatea/eslint-plugin-node

[eslint-plugin-import]: https://github.com/benmosher/eslint-plugin-import

[eslint-plugin-xss]: https://github.com/Rantanen/eslint-plugin-xss

[eslint-plugin-promise]: https://github.com/xjamundx/eslint-plugin-promise

[eslint-plugin-react]: https://github.com/yannickcr/eslint-plugin-react

[eslint-plugin-flowtype]: https://github.com/gajus/eslint-plugin-flowtype

[husky]: https://github.com/typicode/husky
