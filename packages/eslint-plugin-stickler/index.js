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
    babel: require('./configs/babel-eslint'),
    base: require('./configs/base'),
    'es5-browser': require('./configs/es5-browser'),
    flow: require('./configs/flow'),
    import: require('./configs/import'),
    jest: require('./configs/jest'),
    node: require('./configs/node'),
    node6: require('./configs/node6'),
    node8: require('./configs/node8'),
    promise: require('./configs/promise'),
    react: require('./configs/react'),
    xss: require('./configs/xss')
  }
};
