'use strict';

const v = require('@mapbox/fusspot');
const absolutePath = require('./absolute-path');

const jsLintShape = {
  globals: v.plainObject,
  promise: v.boolean,
  react: v.boolean,
  babel: v.boolean,
  es5: v.boolean,
  flow: v.boolean,
  sourceType: v.oneOf('script', 'module'),
  jest: v.boolean,
  browser: v.boolean,
  node: v.oneOfType(v.boolean, v.oneOf(6, 8)),
  xss: v.boolean,
  eslintConfig: v.plainObject
};

const validateConfig = v.assert(
  v.strictShape({
    ignore: v.arrayOf(v.string),
    mdLint: v.boolean,
    mdFormat: v.boolean,
    jsonFormat: v.boolean,
    jsFormat: v.boolean,
    jsLint: v.strictShape(
      Object.assign({}, jsLintShape, {
        overrides: v.arrayOf(
          Object.assign({}, jsLintShape, {
            files: v.required(v.arrayOf(v.string))
          })
        )
      })
    )
  })
);

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
    '**/node_modules/**',
    'coverage/**',
    '**/*.min.js',
    'vendor/**',
    'dist/**',
    '**/fixtures/**'
  ]
    .concat(normalized.ignore)
    .filter(Boolean)
    .map(absolutePath);

  normalized.jsLint = Object.assign(
    {
      promise: true
    },
    normalized.jsLint
  );

  if (normalized.jsLint.overrides) {
    for (const override of normalized.jsLint.overrides) {
      override.files = override.files.map(absolutePath);
    }
  }

  return normalized;
}

module.exports = normalizeConfig;
