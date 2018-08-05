'use strict';

module.exports = {
  plugins: ['flowtype', 'react'],
  parser: 'babel-eslint',
  rules: {
    'flowtype/define-flow-type': 'error',
    'flowtype/use-flow-type': 'error',
    'react/prop-types': 'off'
  }
};
