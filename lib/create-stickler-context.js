'use strict';

const path = require('path');
const globby = require('globby');
const normalizeConfig = require('./normalize-config');

function createSticklerContext({ config, configDir, cwd }) {
  configDir = configDir || cwd;

  let rawConfig = config;
  if (!rawConfig) {
    try {
      rawConfig = require(path.join(configDir, 'stickler.config.js'));
    } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') {
        throw error;
      }
    }
  }

  let projectUsesJest = false;
  try {
    const pkg = require(path.join(configDir, 'package.json'));
    projectUsesJest = pkg.devDependencies && pkg.devDependencies.jest;
  } catch (e) {
    // Assume the error means the project is not using Jest.
  }

  return {
    projectUsesJest,
    configDir,
    cwd,
    config: normalizeConfig(rawConfig, configDir),
    isGitignored: globby.gitignore.sync({ cwd })
  };
}

module.exports = createSticklerContext;
