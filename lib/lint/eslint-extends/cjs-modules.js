'use strict';

module.exports = {
  plugins: ['node'],
  env: {
    commonjs: true
  },
  parserOptions: {
    sourceType: 'script'
  },
  rules: {
    'node/no-extraneous-require': 'error',
    'node/no-missing-require': 'error'
  }
};
