'use strict';

const path = require('path');

/**
 * Validate and normalize Stickler configuration.
 *
 * @param {Object} [config]
 * @param {string} configDir
 * @returns {SticklerConfig}
 */
function normalize(config = {}, configDir) {
  // TODO: Add validation.

  const absolutizeGlob = glob => {
    if (glob.startsWith('**') || glob.startsWith('/')) {
      return glob;
    }
    return path.join(configDir, glob);
  };

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
    .map(absolutizeGlob);

  normalized.jsLint = Object.assign(
    {
      promise: true
    },
    normalized.jsLint
  );

  if (normalized.jsLint.overrides) {
    normalized.jsLint.overrides = normalized.jsLint.overrides.map(
      absolutizeGlob
    );
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
