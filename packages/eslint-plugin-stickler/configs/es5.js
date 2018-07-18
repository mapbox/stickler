'use strict';

module.exports = {
  env: {
    es6: false
  },
  globals: {
    // We're assuming that there will always be a Promise polyfill.
    Promise: true
  }
};
