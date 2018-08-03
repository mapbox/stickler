'use strict';

const path = require('path');

let cached;

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
