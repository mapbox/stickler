'use strict';

module.exports = {
  parser: 'babel-eslint',
  rules: {
    '@mapbox/stickler/flowtype/define-flow-type': 'error',
    '@mapbox/stickler/flowtype/use-flow-type': 'error',
    '@mapbox/stickler/react/prop-types': 'off'
  }
};
