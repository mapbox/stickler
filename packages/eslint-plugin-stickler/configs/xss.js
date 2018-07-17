'use strict';

module.exports = {
  env: {
    'browser': true
  },
  rules: {
    '@mapbox/stickler/xss/no-mixed-html': 'error',
    '@mapbox/stickler/xss/no-location-href-assign': 'error'
  }
};
