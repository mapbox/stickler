'use strict';

const plugins = {
  flowtype: require('eslint-plugin-flowtype'),
  import: require('eslint-plugin-import'),
  node: require('eslint-plugin-node'),
  promise: require('eslint-plugin-promise'),
  react: require('eslint-plugin-react'),
  xss: require('eslint-plugin-xss'),
};

const scopedPluginRules = {};
Object.keys(plugins).forEach(pluginName => {
  const pluginRules = plugins[pluginName].rules;
  if (!pluginRules) {
    throw new Error(`${pluginName} has no rules`);
  }
  Object.keys(pluginRules).forEach(ruleName => {
    scopedPluginRules[`${pluginName}/${ruleName}`] = pluginRules[ruleName];
  });
});

module.exports = {
  rules: scopedPluginRules,
  configs: {
    babel: require('./configs/babel'),
    base: require('./configs/base'),
    browser: require('./configs/browser'),
    'es5': require('./configs/es5'),
    flow: require('./configs/flow'),
    'cjs-module': require('./configs/cjs-module'),
    'es-module': require('./configs/es-module'),
    jest: require('./configs/jest'),
    node: require('./configs/node'),
    node6: require('./configs/node6'),
    node8: require('./configs/node8'),
    promise: require('./configs/promise'),
    react: require('./configs/react'),
    xss: require('./configs/xss')
  },
  configOrder: [
    'babel',
    'base',
    'cjs-module',
    'es-module',
    'es5',
    'jest',
    'browser',
    'node',
    'node6',
    'node8',
    'promise',
    'xss',
    'react',
    'flow'
  ]
};
