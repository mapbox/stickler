'use strict';

module.exports = {
  env: {
    node: true,
    browser: false
  },
  parserOptions: {
    sourceType: 'script'
  },
  rules: {
    '@mapbox/stickler/node/no-unsupported-features': ['error'],
    '@mapbox/stickler/node/no-missing-require': 'error'
  }
};
