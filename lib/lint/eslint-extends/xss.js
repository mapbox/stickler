'use strict';

module.exports = {
  plugins: ['xss'],
  env: {
    browser: true
  },
  rules: {
    'xss/no-mixed-html': 'error',
    'xss/no-location-href-assign': 'error'
  }
};
