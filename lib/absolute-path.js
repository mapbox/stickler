'use strict';

const path = require('path');

/**
 * Convert a filename to an absolute path.
 *
 * @param {string} filename
 * @returns {string}
 */
function absolutePath(filename) {
  if (path.isAbsolute(filename)) {
    return filename;
  }
  return path.join(process.cwd(), filename);
}

module.exports = absolutePath;
