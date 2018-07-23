'use strict';

const prettier = require('prettier');
const pify = require('pify');
const fs = require('fs');

/**
 * Format files with Prettier. Overwrites the existing file.
 *
 * @param {Array<string>} filenames
 * @returns {Array<string>} Array of filenames that were formatted.
 */
function prettify(filenames) {
  return Promise.all(filenames.map(prettifyFile)).then(results => {
    return results.filter(Boolean);
  });
}

function prettifyFile(filename) {
  return pify(fs.readFile)(filename, 'utf8').then(raw => {
    const formatted = prettier.format(raw, {
      filepath: filename,
      singleQuote: true
    });

    // Don't write if the file didn't change.
    if (raw === formatted) {
      return;
    }
    return pify(fs.writeFile)(filename, formatted).then(() => filename);
  });
}

module.exports = prettify;
