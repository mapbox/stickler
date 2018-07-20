'use strict';

const path = require('path');

function absolutePath(filename) {
  if (path.isAbsolute(filename)) {
    return filename;
  }
  return path.join(process.cwd(), filename);
}

module.exports = absolutePath;
