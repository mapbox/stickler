'use strict';

const eslintPluginStickler = require('@mapbox/eslint-plugin-stickler');

/**
 * Create an ESLint config from a Stickler config's jsLint value.
 *
 * @param {Object} sticklerLintConfig
 */
function createEslintConfig(sticklerLintConfig = {}) {
  const config = {
    extends: [
      'plugin:@mapbox/stickler/base'
    ],
    plugins: ['@mapbox/eslint-plugin-stickler']
  };

  // Add configs that are on by default.
  Object.keys(eslintPluginStickler.configs).forEach(configId => {
    if (sticklerLintConfig[configId] !== false) {
      config.extends.push(`plugin:@mapbox/stickler/${configId}`);
    }
  });

  if (sticklerLintConfig.eslintConfig) {
    const { eslintConfig } = sticklerLintConfig;
    Object.keys(eslintConfig).forEach(key => {
      if (key === 'extends') {
        config.extends = config.extends.concat(eslintConfig[key]);
        return;
      }
      if (key === 'plugins') {
        config.plugins = config.plugins.concat(eslintConfig[key]);
        return;
      }
      config[key] = eslintConfig[key];
    });
  }

  return config;
}

module.exports = createEslintConfig;
