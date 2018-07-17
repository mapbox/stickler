'use strict';

const path = require('path');
const lintJs = require('../lib/lint-js');
const eslintFormatterPretty = require('eslint-formatter-pretty');

lintJs([path.resolve(__dirname, '../test/fixtures/*.js')])
  .then(results => {
    console.log(eslintFormatterPretty(results));
  })
  .catch(error => {
    console.error(error.stack);
  });
