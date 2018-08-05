'use strict';

const path = require('path');

// Returns a function that converts a filename to a relative path.
function relativePath(root) {
  return (filename) => {
    return path.relative(root, filename);
  };
}

module.exports = relativePath;
