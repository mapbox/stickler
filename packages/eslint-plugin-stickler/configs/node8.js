'use strict';

module.exports = {
  extends: require.resolve('./node'),
  rules: {
    '@mapbox/stickler/node/no-unsupported-features': ['error', { version: 8 }]
  }
};
