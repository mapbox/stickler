'use strict';

const prettier = require('prettier');
const pify = require('pify');
const fs = require('fs');

function formatJs(sticklerConfig, filenames) {
  if (sticklerConfig.formatJs === false) {
    return Promise.resolve();
  }

  return Promise.all(filenames.map(formatJsFile));
}

function formatJsFile(filename) {
  return pify(fs.readFile)(filename, 'utf8').then(raw => {
    return prettier
      .format(raw, {
        filepath: filename,
        singleQuote: true
      })
      .then(formatted => {
        // Don't write if the file didn't change.
        if (raw !== formatted) {
          return pify(fs.writeFile)(filename, formatted);
        }
      });
  });
}

module.exports = formatJs;
