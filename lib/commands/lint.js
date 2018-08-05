'use strict';

const eslintFormatterPretty = require('eslint-formatter-pretty');
const SticklerLinter = require('../lint/stickler-linter');

function lint(globs) {
  const linter = new SticklerLinter();
  return linter.lintGlobs(globs).then((results) => {
    return {
      raw: results,
      formatted: eslintFormatterPretty(results),
      errored: results.some((result) => result.errorCount > 0)
    };
  });
}

module.exports = lint;
