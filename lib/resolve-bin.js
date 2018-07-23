'use strict';

const path = require('path');
const normalizePackageData = require('normalize-package-data');

/**
 * Get an absolute path to a package's executable.
 *
 * @param {string} pkgName
 * @param {string} [executableName] - Defaults to pkgName.
 * @returns {string}
 */
function resolveBin(pkgName, executableName) {
  executableName = executableName || pkgName;
  const pkgPath = require.resolve(`${pkgName}/package.json`);
  const pkgDir = path.dirname(pkgPath);
  const pkg = require(pkgPath);
  normalizePackageData(pkg);
  const binPath = path.join(pkgDir, pkg.bin[executableName]);
  return binPath;
}

module.exports = resolveBin;
