'use strict';

const createSticklerContext = require('./create-stickler-context');
const createSticklerFormatter = require('./format/create-stickler-formatter');
const createSticklerLinter = require('./lint/create-stickler-linter');

function formatCode({ cwd, config, configDir, filename, code }) {
  const context = createSticklerContext({ cwd, config, configDir });
  const formatter = createSticklerFormatter(context);
  return formatter.formatCode(filename, code);
}

function formatFile({ cwd, config, configDir, filename, overwrite }) {
  const context = createSticklerContext({ cwd, config, configDir });
  const formatter = createSticklerFormatter(context);
  return formatter.formatFile(filename, { overwrite });
}

function lintCode({ cwd, config, configDir, filename, code }) {
  const context = createSticklerContext({ cwd, config, configDir });
  const linter = createSticklerLinter(context);
  return linter.lintCode(filename, code);
}

function lintFile({ cwd, config, configDir, filename }) {
  const context = createSticklerContext({ cwd, config, configDir });
  const linter = createSticklerLinter(context);
  return linter.lintFile(filename);
}

module.exports = {
  formatCode,
  formatFile,
  lintCode,
  lintFile
};
