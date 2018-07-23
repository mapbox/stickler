'use strict';

const micromatch = require('micromatch');
const flatten = require('lodash.flatten');
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
    const lintPromises = [];
    if (sticklerConfig.jsLint) {
      const jsFilenames = micromatch.match(filenames, '**/*.js');
      const jsLintPromise = lintJs(sticklerConfig, jsFilenames).then(
        normalizeResults
      );
      lintPromises.push(jsLintPromise);
    }
    if (sticklerConfig.mdLint) {
      const mdFilenames = micromatch.match(filenames, '**/*.md');
      const mdLintPromise = lintMd(sticklerConfig, mdFilenames).then(
        mdResults => {
          return normalizeResults(vfileToEslint(mdResults));
        }
      );
      lintPromises.push(mdLintPromise);
    }

    return Promise.all(lintPromises).then(results => {
      const flatResults = flatten(results);
      return {
        raw: flatResults,
        formatted: eslintFormatterPretty(flatResults)
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
