'use strict';

module.exports = {
  plugins: ['node'],
  env: {
    node: true
  },
  parserOptions: {
    sourceType: 'script'
  },
  rules: {
    'node/no-unsupported-features': ['error'],
    'node/no-missing-require': 'error'
  }
};
