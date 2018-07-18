'use strict';

const eslintPluginStickler = require('@mapbox/eslint-plugin-stickler');

/**
 * Create an ESLint config from a Stickler config's jsLint value.
 *
 * @param {Object} sticklerLintConfig
 * @returns {EslintConfig}
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
    if (sticklerLintConfig[configId] === true) {
      config.extends.push(`plugin:@mapbox/stickler/${configId}`);
    }
  });

  if (sticklerLintConfig.eslintConfig) {
    const { eslintConfig } = sticklerLintConfig;
    if (eslintConfig.plugins) {
      throw new Error('You cannot use ESLint plugins that are not built into Stickler');
    }
    Object.keys(eslintConfig).forEach(key => {
      if (key === 'extends') {
        config.extends = config.extends.concat(eslintConfig[key]).filter(Boolean);
        return;
      }
      if (key === 'rules') {
        config.rules = normalizeRules(config.rules);
      }
      config[key] = eslintConfig[key];
    });
  }

  return config;
}

function normalizeRules(rules) {
  return Object.keys(rules).reduce((memo, ruleName) => {
    const prefixedRuleName = ruleName.startsWith('@mapbox/stickler/')
      ? ruleName
      : `@mapbox/sticker/${ruleName}`;
    memo[prefixedRuleName] = rules[ruleName];
    return memo;
  }, {});
}

module.exports = createEslintConfig;
