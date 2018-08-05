'use strict';

const prettier = require('prettier');

// The returned Prettifier can be used for format anything Prettier formats.
function createPrettifier() {
  // Returns the formatted code.
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
