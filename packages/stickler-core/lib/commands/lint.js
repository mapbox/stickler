'use strict';

const micromatch = require('micromatch');
const globby = require('globby');
const vfileToEslint = require('vfile-to-eslint');
const eslintFormatterPretty = require('eslint-formatter-pretty');
const lintJs = require('../lint-js');
const lintMd = require('../lint-md');

function lint(sticklerConfig, globs) {
  return globby(globs, {
    ignore: sticklerConfig.ignore,
    gitignore: true,
    absolute: true
  }).then(filenames => {
    const jsFilenames = micromatch.match(filenames, '**/*.js');
    const mdFilenames = micromatch.match(filenames, '**/*.md');

    return Promise.all([
      lintJs(sticklerConfig, jsFilenames),
      lintMd(sticklerConfig, mdFilenames)
    ]).then(([jsResults, mdResults]) => {
      const rawResults = [
        ...normalizeResults(jsResults),
        ...normalizeResults(vfileToEslint(mdResults))
      ];
      return {
        raw: rawResults,
        formatted: eslintFormatterPretty(rawResults)
      };
    });
  });
}

function normalizeResults(results) {
  return results.map(result => {
    result.messages = result.messages.map(message => {
      message.ruleId = message.ruleId || 'SyntaxError';
      return message;
    });
    return result;
  });
}

module.exports = lint;
