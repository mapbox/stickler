# @mapbox/stickler

**EXPERIMENTAL! WORK IN PROGRESS! DO NOT USE!**

No-fuss code-quality tooling for Mapbox frontend repositories.

## Table of contents

- [About](#about)
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

Glob-array of files that should be ignored by both linting and formatting. (Replaces the need for .eslintignore, .prettierignore, .remarkignore, etc.)

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

Type: `Object`.

Configuration for JS linting.

#### jsLint.globals

Type: `{ [string]: boolean }`.

Allow the specified globals. For example, you may use an `analytics` global in some code.

#### jsLint.promise

Type: `boolean`. Default: `true`.

Enable Promise-linting rules from [eslint-plugin-promise].

#### jsLint.react

Type: `boolean`. Default: `false`.

Enables JSX-linting rules from [eslint-plugin-react].

#### jsLint.babel

Type: `boolean`. Default: `false`.

Use [babel-eslint] to parse JS, because you're using non-standard syntax such as class properties or Flow annotations.

#### jsLint.es5

Type: `boolean`. Default: `false`.

Enforce ES5 JS. Useful for code that you want to run in browsers without any Babel compilation.

The `Promise` global is enabled, expecting that you're using a `Promise` polyfill.

#### jsLint.flow

Type: `boolean`. Default: `false`.

Prevent Flow annotations from breaking ESLint. Uses [eslint-plugin-flowtype] and turns on [babel-eslint] \(so you don't need to also turn on [`babel`]).

#### jsLint.moduleType

Type: `'cjs' | 'esm'`.

Tell Stickler which type of JS modules you're using. `cjs` = CommonJS; `esm` = ES Modules. Turns on rules from [eslint-plugin-node] or [eslint-plugin-import], respectively, to validate your dependencies.

#### jsLint.jest

Type: `boolean`. Default: `false`.

Allow Jest's globals. Usually you'll use this within an override, targeting your test directories.

#### jsLint.browser

Type: `boolean`. Default: `false`.

Allow browser globals, like `window`.

#### jsLint.node

Type: `boolean | 6 | 8`. Default: `false`.

Configure linting for Node. Allows Node globals and sets `moduleType: 'cjs'` (though this can be overridden with [`moduleType`]).

Also uses [eslint-plugin-node] to check that you're using JS features supported by your versino of Node. If the value is `true`, the Node version is read from the `"engines"` field in your `package.json`. If for some reason you don't specify `"engines"`, use a number to specify your Node version.

#### jsLint.xss

Type: `boolean`. Default: `false`.

Enable XSS-preventing rules from [eslint-plugin-xss]. Usually you should use this in combination with [`browser`].

#### jsLint.eslintConfig

Type: `Object`.

Add custom ESLint configuration. You won't be able to install your own plugins, but you can do everything else. Typically you'll use this to add or override rules set by the other options.

#### jsLint.overrides

Type: `Array<{ files: Array<string>, ...jsLint }>`.

An array of overrides. Each override has a `files` property whose value is a glob-array, and the rest of the properties can be any other `jsLint` property (except `overrides`).

Override the linting configuration for files that match the specified globs. This allows for different JS flavors or environments in different directories. For example, many codebases have React code for browser within a certain directory, Node code in other directories, Jest tests in others. This replaces the need for nested and cascading `.eslintrc` files.

The first override whose glob matches a file will be used. Its configuration will be merged with the base `jsLint` configuration defined outside of `overrides`.

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

### Configuration examples

All JS files run in Node.

```js
{
  jsLint: {
    node: true
  }
}
```

Most files are React components and use ES2015 modules and Flow. There are also Jest tests and a few JS files that run in Node.

```js
{
  jsLint: {
    react: true,
    browser: true,
    moduleType: 'esm',
    flow: true,
    overrides: [
      {
        files: ['src/test-utils/**', 'src/**/__tests__/**'],
        jest: true
      },
      {
        files: ['*.js', 'scripts/**'],
        node: 6,
        flow: false,
        react: false,
        moduleType: 'cjs'
      }
    ]
  }
}
```

Most files are ES5, so they can run uncompiled in the browser, but use CommonJS so they can be bundled. We're ignoring a `www` directory, where website files are built. We're allowing for a global `analytics` object. Within a couple of directories we're turning on a couple of additional linting rules. And we're turning off JS formatting.

```js
{
  ignore: ['www/**'],
  jsFormat: false,
  jsLint: {
    globals: { analytics: true },
    moduleType: 'cjs',
    browser: true,
    es5: true,
    overrides: [
      {
        files: ['services/**', 'lib/**'],
        browser: true,
        eslintConfig: {
          rules: {
            'no-extra-parens': 'error',
            'valid-jsdoc': 'error'
          }
        }
      }
    ]
  }
}
```

## Inspirations

- [XO](https://github.com/xojs/xo)
- [Standard](https://github.com/standard/standard)
- [kcd-scripts](https://github.com/kentcdodds/kcd-scripts)

[`moduletype`]: #jslintmoduletype

[`babel`]: #jslintbabel

[`browser`]: #jslintbrowser

[babel-eslint]: https://github.com/babel/babel-eslint

[eslint-plugin-node]: https://github.com/mysticatea/eslint-plugin-node

[eslint-plugin-import]: https://github.com/benmosher/eslint-plugin-import

[eslint-plugin-xss]: https://github.com/Rantanen/eslint-plugin-xss

[eslint-plugin-promise]: https://github.com/xjamundx/eslint-plugin-promise

[eslint-plugin-react]: https://github.com/yannickcr/eslint-plugin-react

[eslint-plugin-flowtype]: https://github.com/gajus/eslint-plugin-flowtype

[husky]: https://github.com/typicode/husky
