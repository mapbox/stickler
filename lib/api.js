'use strict';

const createSticklerContext = require('./create-stickler-context');
const createSticklerFormatter = require('./format/create-stickler-formatter');
const createSticklerLinter = require('./lint/create-stickler-linter');

// This API is currently experimental so undocumented.

// Returns the formatted code or null if the code was ignored.
function formatCode({ cwd, config, configDir, filename, code }) {
  const context = createSticklerContext({ cwd, config, configDir });
  const formatter = createSticklerFormatter(context);
  return formatter.formatCode(filename, code);
}

// Returns an array of the filenames of files that were overwritten with
// formatted code.
function formatGlob({ cwd, config, configDir, globs }) {
  const context = createSticklerContext({ cwd, config, configDir });
  const formatter = createSticklerFormatter(context);
  return formatter.formatGlobs(globs);
}

function lintCode({ cwd, config, configDir, filename, code }) {
  const context = createSticklerContext({ cwd, config, configDir });
  const linter = createSticklerLinter(context);
  return linter.lintCode(filename, code);
}

function lintGlobs({ cwd, config, configDir, globs }) {
  const context = createSticklerContext({ cwd, config, configDir });
  const linter = createSticklerLinter(context);
  return linter.lintGlobs(globs);
}

module.exports = {
  formatCode,
  formatGlob,
  lintCode,
  lintGlobs
};
