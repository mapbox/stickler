'use strict';

const path = require('path');

let cached;

/**
 * Returns a boolean indicating whether the Jest is installed
 * in cwd.
 *
 * @returns {boolean}
 */
function pkgUsesJest() {
  if (cached !== undefined) {
    return cached;
  }
  let pkg;
  try {
    pkg = require(path.join(process.cwd(), 'package.json'));
    return pkg.devDependencies && pkg.devDependencies.jest;
  } catch (e) {
    return false;
  }
}

module.exports = pkgUsesJest;
