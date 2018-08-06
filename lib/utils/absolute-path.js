'use strict';

const path = require('path');

// Returns a function that converts a filename to an absolute path.
function absolutePath(root) {
  return (filename) => {
    return path.resolve(root, filename);
  };
}

module.exports = absolutePath;
