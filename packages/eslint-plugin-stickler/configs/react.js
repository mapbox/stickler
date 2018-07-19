'use strict';

module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    '@mapbox/stickler/react/default-props-match-prop-types': 'error',
    '@mapbox/stickler/react/display-name': 'error',
    '@mapbox/stickler/react/forbid-foreign-prop-types': 'error',
    '@mapbox/stickler/react/no-access-state-in-setstate': 'error',
    '@mapbox/stickler/react/no-children-prop': 'error',
    '@mapbox/stickler/react/no-danger': 'error',
    '@mapbox/stickler/react/no-deprecated': 'error',
    '@mapbox/stickler/react/no-direct-mutation-state': 'error',
    '@mapbox/stickler/react/no-redundant-should-component-update': 'error',
    '@mapbox/stickler/react/no-string-refs': 'error',
    '@mapbox/stickler/react/no-this-in-sfc': 'error',
    '@mapbox/stickler/react/no-typos': 'error',
    '@mapbox/stickler/react/no-unknown-property': 'error',
    '@mapbox/stickler/react/no-will-update-set-state': 'error',
    '@mapbox/stickler/react/prop-types': 'error',
    '@mapbox/stickler/react/react-in-jsx-scope': 'error',
    '@mapbox/stickler/react/require-render-return': 'error',
    '@mapbox/stickler/react/style-prop-object': 'error',

    '@mapbox/stickler/react/jsx-boolean-value': ['error', 'always'],
    '@mapbox/stickler/react/jsx-no-duplicate-props': 'error',
    '@mapbox/stickler/react/jsx-no-target-blank': 'error',
    '@mapbox/stickler/react/jsx-no-undef': 'error',
    '@mapbox/stickler/react/jsx-uses-react': 'error',
    '@mapbox/stickler/react/jsx-uses-vars': 'error'
  }
};
