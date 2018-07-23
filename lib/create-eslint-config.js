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

const nonBooleanConfigs = ['sourceType', 'node'];

/**
 * Create an ESLint config from a Stickler config's jsLint value.
 *
 * @param {Object} sticklerLintConfig
 * @returns {EslintConfig}
 */
function createEslintConfig(sticklerLintConfig = {}) {
  const config = {
    extends: [require.resolve('./eslint-extends/base')],
    globals: sticklerLintConfig.globals || {}
  };

  const addConfig = configId => {
    config.extends.push(require.resolve(`./eslint-extends/${configId}`));
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
        if (value === 'module') {
          addConfig('es-modules');
        } else if (value === 'script') {
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
          Object.assign(config.rules, eslintConfig.rules);
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

module.exports = createEslintConfig;
