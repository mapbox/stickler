'use strict';

const prettier = require('prettier');

class Prettifier {
  format(filename, code) {
    return prettier.format(code, {
      filepath: filename,
      singleQuote: true,
      arrowParens: 'always'
    });
  }
}

module.exports = Prettifier;
