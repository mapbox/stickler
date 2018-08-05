'use strict';

// These configs are in a deliberate order, because some must
// override others (e.g. flow overrides a react rule).
const booleanConfigs = [
  'babel',
  'base',
  'browser',
  'es5',
  'flow',
  'jest',
  'promise',
  'react',
  'xss'
];
const nonBooleanConfigs = ['moduleType', 'node'];

/**
 * Create an ESLint config from a Stickler config's jsLint value.
 *
 * @param {Object} options
 * @param {Object} options.jsLintSettings - The "settings" property of a
 *   jsLint object.
 * @param {boolean} options.includeJestOverrides
 * @returns {EslintConfig}
 */
function createEslintConfig({ jsLintSettings, includeJestOverrides }) {
  const eslintConfig = {
    extends: [require.resolve('./eslint-extends/base')],
    globals: jsLintSettings.globals || {}
  };

  const addConfig = (configId) => {
    eslintConfig.extends.push(require.resolve(`./eslint-extends/${configId}`));
  };

  // Add configs that are on by default.
  for (const configId of booleanConfigs) {
    if (jsLintSettings[configId] === true) {
      addConfig(configId);
    }
  }

  for (const configId of nonBooleanConfigs) {
    const value = jsLintSettings[configId];
    switch (configId) {
      case 'moduleType':
        if (value === 'esm') {
          addConfig('es-modules');
        } else if (value === 'cjs') {
          addConfig('cjs-modules');
        }
        break;
      case 'node':
        if (value === true) {
          addConfig('node');
        } else if (value === 6) {
          addConfig('node6');
        } else if (value === 8) {
          addConfig('node8');
        }
        break;
    }
  }

  if (jsLintSettings.eslintConfig) {
    const customEslintConfig = jsLintSettings.eslintConfig;
    if (customEslintConfig.plugins) {
      throw new Error(
        'You cannot use ESLint plugins that are not built into Stickler'
      );
    }
    Object.keys(customEslintConfig).forEach((key) => {
      switch (key) {
        case 'extends':
          eslintConfig.extends = eslintConfig.extends
            .concat(customEslintConfig[key])
            .filter(Boolean);
          break;
        case 'rules':
          eslintConfig.rules = Object.assign(
            {},
            eslintConfig.rules,
            customEslintConfig.rules
          );
          break;
        case 'globals':
          eslintConfig.globals = Object.assign(
            {},
            eslintConfig.globals,
            customEslintConfig.globals
          );
          break;
        default:
          eslintConfig[key] = customEslintConfig[key];
      }
    });
  }

  if (includeJestOverrides) {
    eslintConfig.overrides = (eslintConfig.overrides || []).concat([
      {
        files: [
          '*.test.js',
          'test/**',
          '**/__tests__/**',
          '**/test-utils/*.js'
        ],
        env: {
          jest: true,
          node: true
        }
      }
    ]);
  }

  return eslintConfig;
}

module.exports = createEslintConfig;
