'use strict';

const v = require('@mapbox/fusspot');
const dirGlob = require('dir-glob');
const absolutePath = require('../utils/absolute-path');

const jsLintSettingsShape = {
  globals: v.plainObject,
  promise: v.boolean,
  react: v.boolean,
  babel: v.boolean,
  es5: v.boolean,
  flow: v.boolean,
  moduleType: v.oneOf('cjs', 'esm', 'none'),
  jest: v.boolean,
  browser: v.boolean,
  node: v.oneOfType(v.boolean, v.oneOf(6, 8)),
  xss: v.boolean,
  eslintConfig: v.plainObject
};

const jsLintItemShape = {
  files: v.arrayOf(v.string),
  fallback: v.boolean,
  settings: v.required(v.strictShape(jsLintSettingsShape))
};

const validateConfig = v.assert(
  v.strictShape({
    ignore: v.arrayOf(v.string),
    mdLint: v.boolean,
    mdFormat: v.boolean,
    jsonFormat: v.boolean,
    jsFormat: v.boolean,
    // This will be validated in more depth elsewhere.
    jsLint: v.oneOfType(
      v.strictShape(jsLintSettingsShape),
      v.arrayOf(v.strictShape(jsLintItemShape))
    )
  })
);

const defaultJsLintFallback = { settings: { node: true } };

/**
 * Validate and normalize Stickler configuration.
 *
 * @param {Object} [config]
 * @returns {SticklerConfig}
 */
function normalizeConfig(config = {}) {
  validateConfig(config);

  // Apply easy defaults.
  const normalized = Object.assign(
    {
      jsFormat: true,
      jsonFormat: true,
      mdLint: true,
      mdFormat: true
    },
    config
  );

  // Prefix ignore with default ignore globs.
  normalized.ignore = [
    '**/node_modules',
    'coverage',
    '**/*.min.js',
    'vendor',
    'dist',
    '**/fixtures'
  ]
    .concat(normalized.ignore)
    .filter(Boolean)
    .map(absolutePath);

  // Expand directories in ignore globs.
  normalized.ignore = dirGlob.sync(normalized.ignore);

  // normalized.jsLint should always end up as an array with a fallback.
  if (Array.isArray(normalized.jsLint)) {
    // If jsLint is already an array, we need to do the following:
    // - Validate that every item has a "files" property, except possibly the last.
    // - Make all the glob-arrays absolute.
    // - If no fallback was specified, provide the default fallback.
    let hasFallback = false;
    normalized.jsLint.forEach((jsLintItem, index) => {
      const fallbackItem =
        index === normalized.jsLint.length - 1 && !jsLintItem.files;
      if (jsLintItem.fallback && !fallbackItem) {
        throw new Error(
          'The "fallback" property can only be used on the final jsLint item when it lacks a "files" property'
        );
      }
      if (fallbackItem && jsLintItem.fallback === false) {
        throw new Error(
          'If the "fallback" property is used, it must be "true"'
        );
      }
      if (fallbackItem) {
        hasFallback = true;
        return;
      }
      if (!jsLintItem.files) {
        throw new Error(
          'A "files" property is required for every item in a jsLint settings array except the last, which can serve as a fallback'
        );
      }
      jsLintItem.files = dirGlob.sync(jsLintItem.files.map(absolutePath));
    });
    if (!hasFallback) {
      normalized.jsLint.push(defaultJsLintFallback);
    }
  } else if (normalized.jsLint) {
    // If jsLint is a plain object, use that value as the settings for the fallback.
    normalized.jsLint = [{ settings: normalized.jsLint }];
  } else {
    // If jsLint was not provided, use the default fallback.
    normalized.jsLint = [defaultJsLintFallback];
  }

  // Apply default settings to every item in the jsLint array.
  for (const jsLintItem of normalized.jsLint) {
    jsLintItem.settings = Object.assign(
      { promise: true, moduleType: 'cjs' },
      jsLintItem.settings
    );
  }

  return normalized;
}

module.exports = normalizeConfig;
