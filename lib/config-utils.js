'use strict';

const absolutePath = require('./absolute-path');

/**
 * Validate and normalize Stickler configuration.
 *
 * @param {Object} [config]
 * @returns {SticklerConfig}
 */
function normalize(config = {}) {
  // TODO: Add validation.

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

/**
 * Deeply merge two normalized SticklerConfigs.
 *
 * @param {SticklerConfig} a
 * @param {SticklerConfig} b
 * @returns {SticklerConfig}
 */
function mergeConfigs(a = {}, b = {}) {
  return Object.assign({}, a, b, {
    jsLint: Object.assign({}, a.jsLint, b.jsLint)
  });
}

module.exports.normalize = normalize;
module.exports.mergeConfigs = mergeConfigs;
