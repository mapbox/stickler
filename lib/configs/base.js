'use strict';

module.exports = {
  extends: 'eslint:recommended',
  env: {
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'smart'],
    'no-confusing-arrow': ['error', { allowParens: false }],
    'no-extend-native': 'error',
    'no-use-before-define': ['error', 'nofunc'],
    strict: 'error',
    'no-console': 'off'
  }
};
