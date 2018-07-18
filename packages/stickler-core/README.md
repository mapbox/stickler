**EXPERIMENTAL! WORK IN PROGRESS!**

## Possible API

```js
module.exports = {
  // Glob-array of files that should be ignored.
  // Replaces .eslintignore and .prettierignore.
  // Everything in .gitignore is automatically ignored.
  ignore: [files],
  // Linting configuration for JS.
  // Everything except `custom` is a boolean that toggles
  // a preconfigured ESLint config that targets a flavor of JS.
  jsLint: {
    // The following are on (true) by default.
    promise: boolean,
    // The rest are off (false) by default.
    // Some of these are incompatible (e.g. es5-browser and import),
    // so you'll be warned when the stickler config is validated.
    //
    // Use babel-eslint, because you're using non-standard syntax.
    babel: boolean,
    // Use for ES5 environments.
    'es5': boolean,
    // Prevent Flow annotations from breaking ESLint.
    // Uses babel-eslint and the base eslint-plugin-flowtype rules.
    flow: boolean,
    // ES2015 modules (import/export).
    'es-module': boolean,
    // CommonJS modules. Node configs already incorporate this; so use
    // this module for browser configs.
    'cjs-module': boolean,
    // Maybe this one should be on by default in __tests__ directories.
    jest: boolean,
    // Code for the browser, not Node. The React config already
    // incorporates this.
    browser: boolean,
    // Only one node option is allowed.
    // node reads from the "engines" field in package.json.
    // The others are useful if for some reason you don't specify an engine.
    node: boolean,
    node6: boolean,
    node8: boolean,
    react: boolean,
    xss: boolean,
    // Add custom ESLint stuff. You won't be able to install your own
    // plugins, but all of the rules from plugins used above will be available
    // at @mapbox/stickler/{pluginName}/{ruleName},
    // e.g. @mapbox/stickler/react/no-whatever.
    eslintConfig: {..}
  },
  // Toggle Prettier formatting of JS. On by default.
  jsFormat: boolean,
  // Toggle Prettier formatting of JSON. On by default.
  jsonFormat: boolean,
  // Toggle linting of Markdown. On by default.
  mdLint: boolean,
  // Toggle formatting of Markdown. On by default.
  mdFormat: boolean,
  // Override the configuration for files that match specific globs.
  // I think only linting changes will be necessary. This is to allow
  // for different flavors of JS in different directories (e.g. React
  // in only some places, Node in some places but ES2015 imports in others).
  // This will replace the need to create nested & cascading .eslintrc files.
  overrides: [
    {
      files: [..],
      jsLint: {..}
    }
  ]
}
```
