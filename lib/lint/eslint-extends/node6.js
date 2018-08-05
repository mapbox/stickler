'use strict';

module.exports = {
  extends: require.resolve('./node'),
  rules: {
    'node/no-unsupported-features/es-builtins': ['error', { version: 6 }],
    'node/no-unsupported-features/es-syntax': ['error', { version: 6 }],
    'node/no-unsupported-features/node-builtins': ['error', { version: 6 }]
  }
};
