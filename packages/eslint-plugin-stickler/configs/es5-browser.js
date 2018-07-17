'use strict';

module.exports = {
  env: {
    commonjs: true,
    browser: true,
    es6: false,
    node: false
  },
  globals: {
    Promise: true
  },
  rules: {
    '@mapbox/stickler/node/no-missing-require': 'error'
  }
};
