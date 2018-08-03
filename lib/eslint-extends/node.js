'use strict';

module.exports = {
  extends: [require.resolve('./cjs-modules')],
  plugins: ['node'],
  env: {
    node: true
  },
  rules: {
    'node/no-unsupported-features/es-builtins': ['error'],
    'node/no-unsupported-features/es-syntax': ['error'],
    'node/no-unsupported-features/node-builtins': ['error']
  }
};
