'use strict';

const defaultExtendables = [
  'promise',
  'xss'
];

const optInExtendables = [
  'es5-browser',
  'import',
  'jest',
  'node',
  'node6',
  'node8',
  'react'
]

function createEslintConfig(sticklerLintConfig = {}) {
  const config = {
    extends: [
      'plugin:@mapbox/stickler/base'
    ],
    plugins: ['@mapbox/eslint-plugin-stickler']
  };

  // Add configs that are on by default.
  defaultExtendables.forEach(extendable => {
    if (sticklerLintConfig[extendable] !== false) {
      config.extends.push(`plugin:@mapbox/stickler/${extendable}`);
    }
  });

  // Add configs that are opt-in.
  optInExtendables.forEach(extendable => {
    if (sticklerLintConfig[extendable] === true) {
      config.extends.push(`plugin:@mapbox/stickler/${extendable}`);
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
