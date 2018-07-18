'use strict';

const prettier = require('prettier');
const pify = require('pify');
const fs = require('fs');

/**
 * Format JavaScript files. Overwrites the existing file.
 *
 * @param {SticklerConfig} sticklerConfig
 * @param {Array<string>} filenames
 * @returns {Array<string>} Array of filenames that were formatted.
 */
function formatJs(sticklerConfig, filenames) {
  if (sticklerConfig.formatJs === false) {
    return Promise.resolve();
  }

  return Promise.all(filenames.map(formatJsFile)).then(results => {
    return results.filter(Boolean);
  });
}

function formatJsFile(filename) {
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

module.exports = formatJs;
