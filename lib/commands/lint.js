'use strict';

const eslintFormatterPretty = require('eslint-formatter-pretty');
const createSticklerContext = require('../create-stickler-context');
const createSticklerLinter = require('../lint/create-stickler-linter');

// Returns a string describing linting errors
// or undefined if no errors were found.
function lint({ cwd, globs }) {
  const context = createSticklerContext({ cwd });
  const linter = createSticklerLinter(context);
  return linter.lintGlobs(globs).then((results) => {
    if (results.some((result) => result.errorCount > 0)) {
      return eslintFormatterPretty(results);
    }
  });
}

module.exports = lint;
