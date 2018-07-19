'use strict';

// These configs are in a deliberate order, because some must
// override others (e.g. flow overrides a react rule).

const booleanConfigs = [
  'babel',
  'base',
  'es5',
  'jest',
  'browser',
  'promise',
  'xss',
  'react',
  'flow'
];

const nonBooleanConfigs = ['sourceType', 'node'];

/**
 * Create an ESLint config from a Stickler config's jsLint value.
 *
 * @param {Object} sticklerLintConfig
 * @returns {EslintConfig}
 */
function createEslintConfig(sticklerLintConfig = {}) {
  const config = {
    extends: ['plugin:@mapbox/stickler/base'],
    plugins: ['@mapbox/eslint-plugin-stickler'],
    globals: sticklerLintConfig.globals || {}
  };

  const addConfig = configId => {
    config.extends.push(`plugin:@mapbox/stickler/${configId}`);
  };

  // Add configs that are on by default.
  for (const configId of booleanConfigs) {
    if (sticklerLintConfig[configId] === true) {
      addConfig(configId);
    }
  }

  for (const configId of nonBooleanConfigs) {
    const value = sticklerLintConfig[configId];
    switch (configId) {
      case 'sourceType':
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

  if (sticklerLintConfig.eslintConfig) {
    const { eslintConfig } = sticklerLintConfig;
    if (eslintConfig.plugins) {
      throw new Error(
        'You cannot use ESLint plugins that are not built into Stickler'
      );
    }
    Object.keys(eslintConfig).forEach(key => {
      switch (key) {
        case 'extends':
          config.extends = config.extends
            .concat(eslintConfig[key])
            .filter(Boolean);
          break;
        case 'rules':
          config.rules = normalizeRules(eslintConfig.rules);
          break;
        case 'globals':
          Object.assign(config.globals, eslintConfig.globals);
          break;
        default:
          config[key] = eslintConfig[key];
      }
    });
  }

  return config;
}

function normalizeRules(rules) {
  return Object.keys(rules).reduce((memo, ruleName) => {
    memo[ruleName] = rules[ruleName];
    return memo;
  }, {});
}

module.exports = createEslintConfig;
