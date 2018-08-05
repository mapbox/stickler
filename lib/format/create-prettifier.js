'use strict';

const prettier = require('prettier');

function createPrettifier() {
  const format = (filename, code) => {
    return prettier.format(code, {
      filepath: filename,
      singleQuote: true,
      arrowParens: 'always'
    });
  };

  return {
    format
  };
}

module.exports = createPrettifier;
