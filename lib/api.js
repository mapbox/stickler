'use strict';

const SticklerFormatter = require('./format/stickler-formatter');
const SticklerLinter = require('./lint/stickler-linter');

function formatCode({ cwd, config, filename, code }) {
  const formatter = new SticklerFormatter({ cwd, config });
  return formatter.formatCode(filename, code);
}

function formatFile({ cwd, config, filename, overwrite }) {
  const formatter = new SticklerFormatter({ cwd, config });
  return formatter.formatFile(filename, { overwrite });
}

function lintCode({ cwd, config, filename, code }) {
  const linter = new SticklerLinter({ cwd, config });
  return linter.lintCode(filename, code);
}

function lintFile({ cwd, config, filename }) {
  const linter = new SticklerLinter({ cwd, config });
  return linter.lintFile(filename);
}

module.exports = {
  formatCode,
  formatFile,
  lintCode,
  lintFile
};
