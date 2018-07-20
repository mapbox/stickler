'use strict';

const path = require('path');

function relativeGlob(glob) {
  if (path.isAbsolute(glob)) {
    return path.relative(process.cwd(), glob);
  }
  return glob;
}

module.exports = relativeGlob;
