'use strict';

const eslintFormatterPretty = require('eslint-formatter-pretty');
const createSticklerContext = require('../create-stickler-context');
const createSticklerLinter = require('../lint/create-stickler-linter');

function lint({ cwd, globs }) {
  const context = createSticklerContext({ cwd });
  const linter = createSticklerLinter(context);
  return linter.lintGlobs(globs).then((results) => {
    return {
      raw: results,
      formatted: eslintFormatterPretty(results),
      errored: results.some((result) => result.errorCount > 0)
    };
  });
}

module.exports = lint;
