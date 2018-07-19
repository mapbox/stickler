'use strict';

const globby = require('globby');
const micromatch = require('micromatch');
const vfileToEslint = require('vfile-to-eslint');
const lintJs = require('../lint-js');
const lintMd = require('../lint-md');

function lint(sticklerConfig, globs) {
  return globby(globs, {
    ignore: sticklerConfig.ignore,
    gitignore: true
  }).then(filenames => {
    const jsFilenames = micromatch.match(filenames, '**/*.js');
    const mdFilenames = micromatch.match(filenames, '**/*.md');

    return Promise.all([
      lintJs(sticklerConfig, jsFilenames),
      lintMd(sticklerConfig, mdFilenames)
    ]).then(([jsResults, mdResults]) => {
      const eslintResults = [
        ...normalizeResults(jsResults),
        ...normalizeResults(vfileToEslint(mdResults))
      ];
      return eslintResults;
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
