'use strict';

module.exports = {
  env: {
    node: true,
    browser: false
  },
  rules: {
    '@mapbox/stickler/node/no-unsupported-features': ['error'],
    '@mapbox/stickler/node/no-missing-require': 'error'
  }
};
