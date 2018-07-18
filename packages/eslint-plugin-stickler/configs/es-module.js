'use strict';

module.exports = {
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    '@mapbox/stickler/import/default': 'error',
    '@mapbox/stickler/import/export': 'error',
    '@mapbox/stickler/import/first': 'error',
    '@mapbox/stickler/import/named': 'error',
    '@mapbox/stickler/import/namespace': 'error',
    '@mapbox/stickler/import/newline-after-import': 'error',
    '@mapbox/stickler/import/no-duplicates': 'error',
    '@mapbox/stickler/import/no-dynamic-require': 'error',
    '@mapbox/stickler/import/no-extraneous-dependencies': 'error',
    '@mapbox/stickler/import/no-named-as-default': 'error',
    '@mapbox/stickler/import/no-named-as-default-member': 'error',
    '@mapbox/stickler/import/no-named-default': 'error',
    '@mapbox/stickler/import/no-unresolved': 'error'
  }
};
